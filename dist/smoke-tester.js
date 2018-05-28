#!/usr/bin/env node
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const util = require("util");
const assert = require("assert");
if (process.env.r2g_copy_smoke_tester !== 'yes') {
    process.chdir(__dirname);
    const nm = path.resolve(__dirname + '/node_modules');
    const pkgJSON = require(__dirname + '/package.json');
    const deps = Object.assign({}, pkgJSON.dependencies || {}, pkgJSON.devDependencies || {});
    const links = Object.keys(deps);
    if (links.length < 1) {
        throw new Error('no requireable packages in package.json to smoke test with r2g.');
    }
    const getAllPromises = function (links) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(links.map(function (l) {
                let mod;
                try {
                    mod = require(l);
                }
                catch (err) {
                    console.error('Could not load your package with path:', l);
                    throw err;
                }
                try {
                    assert.equal(typeof mod.r2gSmokeTest, 'function');
                }
                catch (err) {
                    console.error('A module failed to export a function from "main" with key "r2gSmokeTest".');
                    console.error('The module missing this export has the following path:');
                    console.error(l);
                    throw err;
                }
                return Promise.resolve(mod.r2gSmokeTest())
                    .then((v) => ({ path: l, result: v }));
            }));
        });
    };
    getAllPromises(links).then(function (results) {
        console.log('This many packages were tested:', results.length);
        const failures = results.filter(function (v) {
            return !v.result;
        });
        if (failures.length > 1) {
            throw new Error(util.inspect(failures, { breakLength: Infinity }));
        }
        console.log('r2g smoke test passed');
        process.exit(0);
    })
        .catch(function (err) {
        console.log('r2g smoke test failed:');
        console.error(err);
        process.exit(1);
    });
}
else {
    fs.createReadStream(__filename).pipe(process.stdout);
}
