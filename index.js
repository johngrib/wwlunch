#!/usr/bin/env node
'use strict';
/* jshint esversion: 6 */

const program = require('commander');
const getJSON = require('get-json');
const bob_url = 'https://spreadsheets.google.com/feeds/list/1GqW4dY5DSUZ4Qkg7NnbKBrQnaw9goNooarjb1IgqYac/od6/public/values?alt=json';
const today = new Date().setHours(0,0,0,0);
const tomorrow = new Date().setHours(24,0,0,0);

program
  .version('0.0.1')
  .usage('[options]')
  .option('-n, --next <n>', 'An integer argument', parseInt)
  .parse(process.argv);

if(typeof program.next === 'undefined'){
    program.next = 0;
}

getJSON(bob_url, main);

function main(error, json) {

    var list = json.feed.entry;
    var menu = binary_search(list, today, tomorrow);

    console.log(menu);
}

function binary_search(list, today, tomorrow) {

    if(list.length <= 1) {
        return list[0];
    }

    const mid = parseInt(list.length / 2, 10);
    const time = new Date(list[mid].gsx$date.$t).getTime();

    if(time < today) {
        return binary_search(list.slice(mid+1), today, tomorrow);
    } else if(time > tomorrow) {
        return binary_search(list.slice(0, mid-1), today, tomorrow);
    } else {
        return list[mid];
    }
}

