'use strict';

let request = require('request');
let rp = require('request-promise');

module.exports = {
  queryBuilder: (queryVar, locationVar, limitVar, startVar) => {
    /////////////////////////////////
    // Indeed API request parameters
    /////////////////////////////////

    // ----------------- //
    // PARAMETERS IN USE //
    // ----------------- //
    // publisher Publisher ID. Your publisher ID is "PUBLISHER ID HERE". This is assigned when you register as a publisher.
    let apikey = 'api_key=' + '21db46d5bdd6f0fd8f09a7963fe46d4a'; //process.env.INDEED_PUBLISHER_ID;//
    // v Version. Which version of the API you wish to use. All publishers should be using version 2. Currently available versions are 1 and 2. This parameter is required.
    let method = '&method=' + 'aj.jobs.search';
    // format  Format. Which output format of the API you wish to use. The options are "xml" and "json". If omitted or invalid, the XML format is used.
    let format = '&format=' + 'json';
    // q Query. By default terms are ANDed. To see what is possible, use our advanced search page to perform a search and then check the url for the q value.


    // --------------------- //
    // PARAMETERS NOT IN USE //
    // --------------------- //

    /*
    // callback  Callback. The name of a javascript function to use as a callback to which the results of the search are passed. This only applies when format=json. For security reasons, the callback name is restricted letters, numbers, and the underscore character.
    let callback = '&callback=' + '';
    // radius  Distance from search location ("as the crow flies"). Default is 25.
    let radius = '&radius=' + '25';
    // st  Site type. To show only jobs from job boards use "jobsite". For jobs from direct employer websites use "employer".
    let siteType = '&st=' + '';
    // jt  Job type. Allowed values: "fulltime", "parttime", "contract", "internship", "temporary".
    let jobType = '&jt=' + '';
    // highlight Setting this value to 1 will bold terms in the snippet that are also present in q. Default is 0.
    let highlight = '&highlight=' + '';
    // filter  Filter duplicate results. 0 turns off duplicate job filtering. Default is 1.
    let filter = '&filter=' + '';
    // chnl  Channel Name: Group API requests to a specific channel
    let chnl = '&chnl=' + '';
    // sort  Sort by relevance or date. Default is relevance.
    let sort = '&sort=' + 'date';
    */

    // Built out URL from parameters
    let params = apikey + method + format;
    let builtUrl = 'https://authenticjobs.com/api/?' + params;
    return builtUrl;
  }
};


