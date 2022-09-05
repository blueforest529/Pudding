const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const dirname = path.resolve()

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false
  // outputDir: path.resolve(dirname, '../backend/dist')
})
