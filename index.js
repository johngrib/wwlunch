#!/usr/bin/env node
'use strict';
/* jshint esversion: 6 */

const program = require('commander');
const getJSON = require('get-json');
const bob_url = 'https://spreadsheets.google.com/feeds/list/1GqW4dY5DSUZ4Qkg7NnbKBrQnaw9goNooarjb1IgqYac/od6/public/values?alt=json';

(function(){
    program
      .version('0.0.1')
      .usage('[options]')
      .option('-n, --next <number>', 'An integer argument', parseInt)
      .option('-d, --date <YYYY.MM.dd>', 'date formatted string argument', (v) => new Date(v))
      .parse(process.argv);

    program.next = program.next || 0;
    program.date = program.date || new Date();

    getJSON(bob_url, main);
})();

function main(error, json) {

    const today = program.date;
    const list = json.feed.entry;

    // 재귀 함수에 리미터를 부착하여 오버플로우를 방지한다.
    const search = add_limiter_on_function(binary_search_slicer, 100);
    const date_checker = get_date_checker(today);

    const result = search.bind
        ({}, date_checker)
        ({ head: [], body: list, tail: []});

    const result_list = (function(next){
        if(next > 0)
            return result.body.concat(result.tail.slice(0, next));
        if(next < 0)
            return result.head.slice(result.head.length + next).concat(result.body);
        else
            return result.body;
    })(program.next);

    print_result(result_list);

    return 0;
}

function print_result(obj){
    const filtered = obj.map((o) => {
        return { date: o.gsx$date.$t, breakfast: o.gsx$breakfast.$t, lunch: o.gsx$lunch.$t };
    });
    console.log(filtered);
}

/**
 * 파라미터로 전달된 함수에 call limiter 를 부착한다.
 * 리미터가 부착된 함수는 limit 숫자만큼만 호출이 가능하고, 그 이상 호출하면 false 를 리턴한다.
 *
 * func : 리미터를 부착할 함수
 * limit : 호출 제한 숫자.
 */
function add_limiter_on_function(func, limit) {
    return function() {
        if(typeof func.limit === 'undefined') {
            func.limit = 0;
        } else if(func.limit >= limit) {
            return false;
        } else {
            func.limit++;
        }
        return func.apply(null, [].slice.call(arguments, 0));
    };
}

function get_date_checker(date) {
    const today = new Date(date).setHours(0,0,0,0);
    const tomorrow = new Date(today).setHours(24,0,0,0);

    return function(check_date){
        if(check_date < today)
            return -1;
        if(check_date >= tomorrow)
            return 1;
        else
            return 0;
    };
}

function binary_search_slicer(date_checker, list) {

    var body = list.body;

    if(list.body.length < 1) {
        return list;
    }

    const mid = parseInt(body.length / 2, 10);
    const time = new Date(body[mid].gsx$date.$t).setHours(0,0,0,0);
    const check = date_checker(time);
    let newList = {};

    if(check < 0) {
        newList.head = list.head.concat(list.body.slice(0, mid+1));
        newList.body = list.body.slice(mid+1);
        newList.tail = list.tail;
        return binary_search_slicer(date_checker, newList);
    } else if(check > 0) {
        newList.head = list.head;
        newList.body = list.body.slice(0, mid);
        newList.tail = list.body.slice(mid).concat(list.tail);
        return binary_search_slicer(date_checker, newList);
    } else {
        newList.head = list.head.concat(list.body.slice(0, mid));
        newList.body = list.body.slice(mid, mid+1);
        newList.tail = list.body.slice(mid+1).concat(list.tail);
        return newList;
    }
}

