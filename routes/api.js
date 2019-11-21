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
const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      Issue.find(req.query, (err, data) => {
        if (err) return res.status(500).json({error: `Something went wrong`});
        res.send(data);
      });
    })

    .post(function (req, res){
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
        if (err) return res.status(500).json({error: `Something went wrong`});
        res.json(data);
      });

    })

    .put(function (req, res){
      let issueID = req.body._id;
      let request = Object.assign({}, req.body);
      delete request._id;

      if (!mongoose.Types.ObjectId.isValid(issueID)) {
        return res.send(`could not update ${issueID}`);
      }

      for (var item in request) {
        if (!request[item]) {
          delete request[item];
        }
      }

      if (Object.keys(request).length == 0) {
        return res.send('no updated field sent');
      }

      request.updated_on = Date.now();
      Issue.findOneAndUpdate(issueID, request, (err, issue) => {
        if (err) return res.status(500).json({error: `Something went wrong`});
        if (!issue) return res.send(`could not update ${issueID}`);
        res.send('successfully updated');
      });
    })

    .delete(function (req, res){
      let issueID = req.body._id;
      if (!mongoose.Types.ObjectId.isValid(issueID)) {
        return res.send('_id error');
      }
      Issue.findByIdAndRemove(issueID, (err, issue) => {
        if (err) return res.status(500).json({error: `Something went wrong`});
        if (!issue) return res.send(`could not delete ${issueID}`);
        res.send(`deleted ${issueID}`)
      });
    });

};
