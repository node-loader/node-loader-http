import assert from "assert";

describe(`basic http / https tests`, () => {
  it.only(`can load a module over http`, async () => {
    const ns = await import(
      "http://unpkg.com/single-spa@5.5.5/lib/esm/single-spa.dev.js"
    );
    assert.ok(ns.start);
    ns.start();
  });

  it(`can load a module over https`, async () => {
    const ns = await import(
      "https://unpkg.com/single-spa@5.5.5/lib/esm/single-spa.dev.js"
    );
    assert.ok(ns.start);
    ns.start();
  });

  it(`can load a json module`, async () => {
    const ns = await import("https://unpkg.com/single-spa@5.5.5/package.json");
    assert.equal(ns.default.name, "single-spa");
  });
});
