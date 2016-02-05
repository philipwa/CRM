/**
 * Created by philip on 01/02/16.
 */
'use strict';

var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf'),
    env = process.env.NODE_ENV || 'local',
    absEnvironmentConfigPath,
    configs = [];
// list of files to merge
//    configs = [ __dirname + '/global.json' ];

// normalize env names
switch (env) {
    case 'local':
        env = 'local';
        break;
    default:
        env = 'local';
}

absEnvironmentConfigPath = path.resolve(__dirname + '/' + env + '.json');

// Check if file exists
if (fs.existsSync(absEnvironmentConfigPath)) {
    configs.push(absEnvironmentConfigPath);
}

module.exports = nconf.loadFilesSync(configs);