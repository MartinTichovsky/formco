const { createCollector } = require("jest-collector");

createCollector({
  include: ["**/*"],
  roots: ["packages/formco/src"]
});
