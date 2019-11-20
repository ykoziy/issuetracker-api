/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
//var ObjectId = require('mongodb').ObjectID;

const Issue = require('../models/Issue');
const requiredFields = ['Title','Text','Created by'];

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      Issue.find(req.query, (err, data) => {
        if (err) return res.status(500).send('error');
        res.send(data);
      });
    })

    .post(function (req, res){
      // optional can be empty
      let requiredFields = ['issue_title','issue_text','created_by'];
      let areRequiredFieldsMissing = [!req.body.issue_title, !req.body.issue_text, !req.body.created_by];
      let missingFields = requiredFields.filter((item, index) => {
        if (areRequiredFieldsMissing[index]) {
          return true;
        }
      });
      if (missingFields.length > 0) {
        return res.status(422).json({ error: `Missing fields: ${missingFields}`});
      }

      let newIssue = new Issue(req.body);
      newIssue.save((err, data) => {
        if (err) return console.error(err);
        res.json(data);
      });

    })

    .put(function (req, res){
      var project = req.params.project;

    })

    .delete(function (req, res){
      var project = req.params.project;

    });

};
