'use strict';

import options from './cli-options';
const dashdash = require('dashdash');
import residence = require('residence');
import chalk from "chalk";

const allowUnknown = process.argv.indexOf('--allow-unknown') > 0;
const parser = dashdash.createParser({options, allowUnknown});

let opts: any;

try {
  opts = parser.parse(process.argv);
} catch (e) {
  console.error('foo: error: %s', e.message);
  process.exit(1);
}

if (opts.help) {
  let help = parser.help({includeEnv: true}).trimRight();
  console.log('usage: node foo.js [OPTIONS]\n' + 'options:\n' + help);
  process.exit(0);
}

if (opts.version) {
  console.log('version:', 'foo');
  process.exit(0);
}


const cwd = process.cwd();
const projectRoot = residence.findProjectRoot(cwd);

if(!projectRoot){
  throw chalk.magenta('Could not find a project root given your current working directory => ') + chalk.magenta.bold(cwd);
}


export {opts, cwd, projectRoot};




