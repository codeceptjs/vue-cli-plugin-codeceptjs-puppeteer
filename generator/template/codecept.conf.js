const { setHeadlessWhen, setWindowSize } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);
setWindowSize(1400, 1000);

exports.config = {
  tests: './tests/e2e/**/*_test.js',
  output: './tests/e2e/output',
  helpers: {
    Puppeteer: {
      url: 'http://127.0.0.1:8080',
      show: true,      
    }
  },
  include: {
    I: './tests/e2e/support/steps_file.js'
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true
    },
  },
  name: 'vue e2e tests'
};
