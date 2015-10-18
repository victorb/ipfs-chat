import webpackConfig from './_base';

webpackConfig.devtool = 'source-map';
webpackConfig.eslint.emitWarning = false;

export default webpackConfig;
