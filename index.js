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

        let tmpFilename = '<null>';
        try{
            tmpFilename = fs.readdirSync(tmp).filter(x=>x.endsWith(format))[0];
            fs.copyFileSync(tmpFilename, outFileName);
        }catch(e){
            throw new Error(`cant find plantuml result in folder ${tmp} with name ${tmpFilename}: ${e}`);
        }
    } finally{
        try{ fs.rmSync(tmp, {recursive:true, force: true}); }catch(_){ /* eatall */ }
    }
}
