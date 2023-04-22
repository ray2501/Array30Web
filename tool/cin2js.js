#!/usr/bin/env node

import fs from 'fs';

const args = process.argv;
let filename = 'array30-OpenVanilla-big-v2023-1.0-20230211.cin';
let varname = 'webData'
if (args.length > 2 && args.length == 4) {
    filename = args[2];
    varname = args[3]
}

var mainTable = new Object();

const allFileContents = fs.readFileSync(filename, 'utf-8');
allFileContents.split(/\r?\n/).forEach(line =>  {
  if (line.charAt(0).localeCompare("#") != 0 &&
     line.charAt(0).localeCompare("%") != 0)
  line = line.trim();
  let myArray = line.split("\t");
  if (myArray.length == 2) {
      let key = myArray[0];
      let value = myArray[1];
      if (mainTable.hasOwnProperty(key)) {
          let values = mainTable[key];
          values.push(value);
          mainTable[key] = values;
      } else {
          let values = [value];
          mainTable[key] = values;
      }
  }
});

let result = JSON.stringify(mainTable, null, "\t");
let output = `${varname}.js`;
fs.writeFileSync(output, `export let ${varname} = ${result};`);
