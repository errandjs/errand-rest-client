var kue = require('kue');
var queue = kue.createQueue();
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var _ = require('underscore');
var Client = require('node-rest-client').Client;


var MONGODB_URL = process.env['ERRAND_MONGODB_URL'] ? process.env['ERRAND_MONGODB_URL'] : "mongodb://localhost:27017";

function graceful() {
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

function helpers(request, options) {
  _.each(options, function(option) {
    _.each( option, function( val, key ) {

      switch(key) {

        case "replace":
          var re = new RegExp(val.regexp,"g");
          request=JSON.parse(JSON.stringify(request).replace(re,val.newSubstr));
          break;

      }

    });
  });

  return (request);
}

queue.process('errand-rest-client', function(job, done){

  switch(job.data.request.method) {

    case 'get.array.into.collection':

      MongoClient.connect( MONGODB_URL + "/" + job.data.request.database, function(err, db) {

        var client = new Client();

        client.get(job.data.request.parameters.url,
          {
            data: job.data.request.parameters.request,
            headers: { "Content-Type": "application/json" }
          },
          function (data, responses) {

            async.eachSeries(data, function(item, callback_item) {

              var filter = {};
              filter[job.data.request.parameters.index] = item[job.data.request.parameters.index];

              db.collection(job.data.request.collection).updateOne(
                filter,
                helpers(item, job.data.request.parameters.helpers),
                {upsert:true},
                function(err, query) {
                  callback_item();
                });

            }, function(err) {
              done();
            })

          });

        });

      break;

      case 'put.array.from.collection':

        MongoClient.connect( MONGODB_URL + "/" + job.data.request.database, function(err, db) {

          var client = new Client();

          db.collection(job.data.request.collection).find({}).toArray(function(err, results){
            client.put(job.data.request.parameters.url,
              {
                data: results,
                headers: { "Content-Type": "application/json" }
              },
              function (data, response) {
                console.log(data);
                done();
              });
          });

        });

      break;

  }


});
