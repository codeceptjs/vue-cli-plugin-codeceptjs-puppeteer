const fs = require('fs');

module.exports = (api, options) => {
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
  
  if (options.demo) api.injectImports(api.entryFile, `import TestMe from './components/TestMe'`);
}

module.exports.hooks = (api, options) => {
  api.afterInvoke(() => {
    appendGitIgnore(api);
    if (options.demo) replaceAppFile(api);
  })
}


function replaceAppFile(api) {
  const contentMain = fs.readFileSync(api.entryFile, { encoding: 'utf-8' });
  const newContent = contentMain.replace('new Vue({', `
Vue.component('TestMe', TestMe);

new Vue({`);

  fs.writeFileSync(api.entryFile, newContent, { encoding: 'utf-8' });

  const appPath = api.resolve('src/App.vue')
  const appFile = fs.readFileSync(appPath, { encoding: 'utf-8' });

  // replace div inside a template
  const newAppFile = appFile.replace('</div>', `<TestMe></TestMe></div>`);  
  fs.writeFileSync(appPath, newAppFile, { encoding: 'utf-8' });
}

function appendGitIgnore(api) {
  const ignorePath = api.resolve('.gitignore');
  fs.appendFileSync(ignorePath, `\n/tests/e2e/output`);
}
