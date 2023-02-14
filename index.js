/// <reference path="index.d.ts"/>

const os = require('os');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const commandExistsSync = require('command-exists').sync;

module.exports = function (inFileName, outFileName, format) {
    format = format || 'svg';
    const renderBin = commandExistsSync('plantuml') ? 'plantuml' : path.join(__dirname, 'plantuml-v1.2023.1.glibc2.4-x86_64.AppImage');

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '.pumlr-'));
    try{
        const args = [
            `-t${format}`,
            `-o`,
            tmp,
            inFileName
        ];
        const pstatus = child_process.spawnSync(renderBin, args);
        if (pstatus.status!=0) {
            throw new Error(`plantuml report error: ${(pstatus.output || '').toString()}`);
        }

        const tmpFilename = path.join(tmp, path.parse(path.basename(inFileName)).name + '.svg' );
        fs.renameSync(tmpFilename, outFileName);
    } finally{
        try{ fs.rmdirSync(tmp); }catch(_){ /* eatall */ }
    }
}
