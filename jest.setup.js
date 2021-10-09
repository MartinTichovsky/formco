const { createCollector } = require("jest-collector");

createCollector({
  include: ["**/*.c.test.(ts|tsx)"],
  roots: ["packages/formco/src"]
});
