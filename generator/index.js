module.exports = api => {
  api.render('./template');

  // These dependencies always need to be added
  const devDependencies = {
      "codeceptjs": "^2.3.6",
      "@codeceptjs/configure": "^0.4.0",
      "@codeceptjs/ui": "^0.2.0",
      "puppeteer": "^2.0.0"
    };

  api.extendPackage({
    devDependencies,
    scripts: {
      'test:e2e': 'vue-cli-service test:e2e',
      'test:e2e:parallel': 'vue-cli-service test:e2e:parallel',
      'test:e2e:open': 'vue-cli-service test:e2e:open',
    },
  }); 
}
