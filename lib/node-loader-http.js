import fetch from "node-fetch";

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

export async function load(url, context, defaultLoad, loaderOptions) {
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

    const httpResponse = await fetch(
      url,
      loaderOptions ? loaderOptions.fetchOptions : undefined
    );

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
