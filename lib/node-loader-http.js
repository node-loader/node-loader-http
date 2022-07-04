import fetch from "make-fetch-happen";
import path from "path";
import { homedir } from "os";

const HTTP_IMPORT_CACHING = process.env.HTTP_IMPORT_CACHING || "default";

const allowedStrategies = [
  "default",
  "no-store",
  "reload",
  "no-cache",
  "force-cache",
  "only-if-cached",
];

if (!allowedStrategies.includes(HTTP_IMPORT_CACHING)) {
  throw new Error(
    `Incorrect HTTP_IMPORT_CACHING value "${HTTP_IMPORT_CACHING}". Please refer to make-fetch-happen documentation https://github.com/npm/make-fetch-happen#--optscache for allowed values`
  );
}

const HTTP_IMPORT_CACHDIR =
  process.env.HTTP_IMPORT_CACHDIR ||
  (process.platform === "darwin"
    ? path.join(homedir(), "Library", "Caches", "node-loader-http")
    : process.platform === "win32"
    ? path.join(
        process.env.LOCALAPPDATA || path.join(homedir(), "AppData", "Local"),
        "node-loader-http-cache"
      )
    : path.join(
        process.env.XDG_CACHE_HOME || path.join(homedir(), ".cache"),
        "node-loader-http"
      ));

console.info("@node-loader/http", "cache =", HTTP_IMPORT_CACHING);
console.info("@node-loader/http", "cachePath =", HTTP_IMPORT_CACHDIR);

export function resolve(specifier, context, defaultResolve) {
  const { parentURL = null } = context;

  // Normally Node.js would error on specifiers starting with 'https://', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (useLoader(specifier)) {
    return {
      url: specifier,
    };
  } else if (parentURL && useLoader(parentURL)) {
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      return {
        url: new URL(specifier, parentURL).href,
      };
    } else {
      const adjustedContext = { ...context };
      delete adjustedContext.parentURL;
      return defaultResolve(specifier, adjustedContext, defaultResolve);
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (useLoader(url)) {
    let format;
    // TODO: maybe change to content-type / mime type check rather than file extensions
    if (url.endsWith(".mjs")) {
      format = "module";
    } else if (url.endsWith(".cjs")) {
      format = "commonjs";
    } else if (url.endsWith(".wasm")) {
      format = "wasm";
    } else if (url.endsWith(".json")) {
      format = "json";
    } else {
      // default to true, since NodeJS loaders only are triggered by ESM code
      // Alternatively, we could consider looking up the nearest package.json to the process.cwd()
      // And seeing if it has `"type": "module"`
      format = "module";
    }

    let source;

    const httpResponse = await fetch(url, {
      cachePath: HTTP_IMPORT_CACHDIR,
      cache: HTTP_IMPORT_CACHING,
    });

    if (httpResponse.ok) {
      source = await httpResponse.text();
    } else {
      throw Error(
        `Request to download javascript code from ${url} failed with HTTP status ${httpResponse.status} ${httpResponse.statusText}`
      );
    }

    return {
      source,
      format,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}

export function getSource(url, context, defaultGetSource) {
  return defaultGetSource(url, context, defaultGetSource);
}

function useLoader(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
