const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportWidth: 1700,
  viewportHeight: 1024,
  e2e: {
    fixturesFolder: false,
  },
})