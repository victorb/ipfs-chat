require('babel/register');

const config   = require('./config');
config.set('webpack_lint_in_dev', false);

config.set('node', {
  console: 'empty',
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
})

module.exports = require('./build/webpack/' + config.get('env'));
