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

export function getFormat(url, context, defaultGetFormat) {
  if (useLoader(url)) {
    let isModule;
    if (url.endsWith(".mjs")) {
      isModule = true;
    } else if (url.endsWith(".cjs")) {
      isModule = false;
    } else {
      // default to true, since NodeJS loaders only are triggered by ESM code
      // Alternatively, we could consider looking up the nearest package.json to the process.cwd()
      // And seeing if it has `"type": "module"`
      isModule = true;
    }

    return {
      format: "module",
    };
  }

  return defaultGetFormat(url, context, defaultGetFormat);
}

export function getSource(url, context, defaultGetSource) {
  if (useLoader(url)) {
    return fetch(url).then((r) => {
      if (r.ok) {
        return r.text().then((source) => {
          return {
            source,
          };
        });
      } else {
        throw Error(
          `Request to download javascript code from ${url} failed with HTTP status ${r.status} ${r.statusText}`
        );
      }
    });
  }

  return defaultGetSource(url, context, defaultGetSource);
}

function useLoader(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
