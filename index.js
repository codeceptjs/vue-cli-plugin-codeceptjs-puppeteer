module.exports = (api, options) => {
  const { info, chalk, execa, openBrowser } = require('@vue/cli-shared-utils') 

  api.registerCommand('test:e2e', {
    description: 'run e2e tests with CodeceptJS',
    usage: 'vue-cli-service test:e2e [options]',
    options: {
      '--headless': 'run in headless mode',
      '-s, --serve': 'run dev server before a test',
      '--mode': 'specify the mode the dev server should run in. (default: production)',
    },
    details:
      `All CodeceptJS CLI options are also supported:\n` +
      chalk.yellow(`https://codecept.io/commands#run`)
  }, async (args, rawArgs) => {
    removeArg(rawArgs, 'headless');
    removeArg(rawArgs, 'serve');
    removeArg(rawArgs, 'mode');

    info(`Starting e2e tests...`);
    if (args.headless) info('Headless mode enabled');

    const server = await runServer(args.serve, args, rawArgs);
    
    const { container, config, codecept } = require('codeceptjs');
    const { setHeadlessWhen } = require('@codeceptjs/configure');
      
    const opts = { steps: true };
    
    setHeadlessWhen(args.headless);
    config.load(args.config || api.getCwd());

    const conf = config.get();
    

    if (server) conf.teardown = () => server.close();

    // create runner
    let runner = new codecept(conf, { ...opts, ...args });
    
    // initialize codeceptjs in tests/e2e
    runner.initGlobals(api.getCwd());
    
    // create helpers, support files, mocha
    container.create(conf, opts);
    
    // initialize listeners
    runner.runHooks();
    
    // load tests
    runner.loadTests();
    
    // run tests
    return runner.run();      
  });

  api.registerCommand('test:e2e:parallel', {
    description: 'run e2e tests with CodeceptJS in workers',
    usage: 'vue-cli-service test:e2e:parallel [options]',
    options: {
      '-s, --serve': 'run dev server before a test',
      '--mode': 'specify the mode the dev server should run in. (default: production)',
    },
    details:
      `All CodeceptJS CLI options are also supported:\n` +
      chalk.yellow(`https://codecept.io/commands#run`)
  }, async (args, rawArgs) => {

    // set default workers
    const workers = args._[0] || 2;

    removeArg(rawArgs, 'serve');
    removeArg(rawArgs, 'mode');
    rawArgs.unshift('run-workers')

    info(`Starting e2e tests in ${workers} workers...`);

    const server = await runServer(args.serve, args, rawArgs);

    const codeceptBin = require.resolve('codeceptjs/bin/codecept');

    // run tests in headless mode
    const runner = execa(codeceptBin, rawArgs, { stdio: 'inherit', env: { HEADLESS: true } })
    if (server) {
      runner.on('exit', () => server.close());
      runner.on('error', () => server.close());
    }

    if (process.env.VUE_CLI_TEST) {
      runner.on('exit', code => {
        process.exit(code)
      })
    }

    return runner;
  });
  
  api.registerCommand('test:e2e:open', {
    description: 'run UI for CodeceptJS',
    usage: 'vue-cli-service test:open',
    details:
      `More about CodeceptUI :\n` +
      chalk.yellow(`https://github.com/codecept-js/ui`)
  
  }, async (args, rawArgs) => {
    info(`Openning e2e dashboard...`)

    const server = await runServer(args.serve, args, rawArgs);   
  
    const codeceptBin = require.resolve('@codeceptjs/ui/bin/codecept-ui.js');
    const runner = execa(codeceptBin, '', { stdio: 'inherit' });

    setTimeout(() => {
      info('Launching default browser...');
      openBrowser('http://localhost:3001');
    }, 2000);

    if (server) {
      runner.on('exit', () => server.close())
      runner.on('error', () => server.close())
    }
  
    if (process.env.VUE_CLI_TEST) {
      runner.on('exit', code => {
        process.exit(code)
      })
    }
  
    return runner;
  });

  async function runServer(runServer = false, args = {}, rawArgs = []) {
    if (!runServer) return;
    const { server } = await api.service.run('serve', args, rawArgs);
    return server;
  }
}

module.exports.defaultModes = {
  'test:e2e': 'production'
}

function removeArg (rawArgs, argToRemove, offset = 1) {
  const matchRE = new RegExp(`^--${argToRemove}`)
  const equalRE = new RegExp(`^--${argToRemove}=`)
  const i = rawArgs.findIndex(arg => matchRE.test(arg))
  if (i > -1) {
    rawArgs.splice(i, offset + (equalRE.test(rawArgs[i]) ? 0 : 1))
  }
}
