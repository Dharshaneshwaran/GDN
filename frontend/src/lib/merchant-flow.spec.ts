import * as assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

const require = createRequire(import.meta.url);
const {
  canOpenWithoutSelectedStyle,
  getLoginLandingPath,
  getStyleLandingPath,
  merchantDepartments
} = require("./merchant-flow.ts") as typeof import("./merchant-flow");

describe("merchant flow", () => {
  it("routes merchant login to the merchant page before style selection", () => {
    assert.equal(getLoginLandingPath("MERCHANT"), "/merchant");
    assert.equal(getLoginLandingPath("OWNER"), "/style-select");
  });

  it("allows the merchant page before a style is selected", () => {
    assert.equal(canOpenWithoutSelectedStyle("/merchant"), true);
    assert.equal(canOpenWithoutSelectedStyle("/style-select"), true);
    assert.equal(canOpenWithoutSelectedStyle("/"), false);
  });

  it("routes merchant new styles to the merchant department page", () => {
    assert.equal(getStyleLandingPath("MERCHANT", "new"), "/merchant");
    assert.equal(getStyleLandingPath("MERCHANT", "existing"), "/");
    assert.equal(getStyleLandingPath("OWNER", "new"), "/");
  });

  it("lists the requested merchant sidebar departments", () => {
    assert.deepEqual(
      merchantDepartments.map((department) => department.label),
      ["Yarn", "Knitting", "Dyeing", "Washing", "Cutting", "Stitching", "Printing"]
    );
  });
});
