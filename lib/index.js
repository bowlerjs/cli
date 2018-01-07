const yeoman = require('yeoman-environment');
const program = require('commander');
const meta = require('generator-bowler/meta');
const semver = require('semver');
const updateNotifier = require('update-notifier');

const env = yeoman.createEnv();

const bowlerGenerators = 'generator-bowler/generators';

Object.keys(meta).forEach(name => {
  const moduleName = `${bowlerGenerators}/${name}`;
  env.register(require.resolve(moduleName), `bowler:${name}`);
});

module.exports = function (argv, generatorOptions = {}) {
  const pkg = require('../package.json');
  let description = 'Run a generator. Type can be\n';

  Object.keys(meta).forEach(name => {
    description += `\t• ${name} - ${meta[name]}\n`;
  });

  updateNotifier({pkg}).notify();

  program
      .version(pkg.version)
      .usage('upgrade <version>')
      .usage('generate [type]');

  if(!semver.satisfies(process.version, '<= 8.0.0')) {
    console.error('This tool and generated application requires Node v8.0.0 or later.');
    return process.exit(1);
  }

  program
      .command('generate [type]')
      .alias('g')
      .description(description)
      .action(version => {
        if(!type) {
          program.help();
        } else {
          env.run(`bowler:${type}`, generatorOptions);
        }
      });

  /*program
      .command('upgrade')
      .alias('u')
      .description('Upgrade to the latest version of Bowler.')
      .action(() => upgrade(process.cwd()));*/

  program
      .command('*')
      .action(() => program.help());
  program.parse(argv);

  if(argv.length === 2) {
    program.help();
  }
};