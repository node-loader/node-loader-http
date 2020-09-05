import assert from "assert";

describe(`basic http / https tests`, () => {
  it(`can load a module over http`, async () => {
    const ns = await import(
      "http://unpkg.com/single-spa@5.5.5/lib/esm/single-spa.dev.js"
    );
    console.log("ns", ns);
    assert.ok(ns.start);
    ns.start();
  });

  it(`can load a module over https`, async () => {
    const ns = await import(
      "https://unpkg.com/single-spa@5.5.5/lib/esm/single-spa.dev.js"
    );
    console.log("ns", ns);
    assert.ok(ns.start);
    ns.start();
  });
});
