const { createCollector } = require("jest-collector");

createCollector({
  include: ["packages/formco/src/**/*"],
  roots: ["packages/formco/src"]
});
