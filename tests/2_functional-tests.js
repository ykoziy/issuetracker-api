/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    let id1;
    let id2;

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          id1 = res.body._id;
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "Functional Test - Every field filled in");
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          done();
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
         .post('/api/issues/apitest')
         .send({
           issue_title: 'Functional Test - Required fields filled in',
           issue_text: 'text',
           created_by: 'Alice'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isObject(res.body);
           assert.property(res.body, 'issue_title');
           assert.property(res.body, 'issue_text');
           assert.property(res.body, 'created_on');
           assert.property(res.body, 'updated_on');
           assert.property(res.body, 'created_by');
           assert.property(res.body, 'open');
           assert.property(res.body, '_id');
           id2 = res.body._id;
           assert.equal(res.body.issue_title, "Functional Test - Required fields filled in");
           assert.equal(res.body.issue_text, "text");
           assert.equal(res.body.created_by, "Alice");
           done();
         });
      });

      test('Missing required fields', function(done) {
        chai.request(server)
         .post('/api/issues/apitest')
         .send({
           issue_title: 'Functional Test - Missing required fields'
         })
         .end(function(err, res){
           assert.equal(res.status, 422);
           assert.equal(res.body.error, "Missing fields: issue_text,created_by");
           done();
         });
      });

    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
        chai.request(server)
         .put('/api/issues/apitest')
         .send({_id: id1})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'no updated field sent');
           done();
         });
      });

      test('One field to update', function(done) {
        chai.request(server)
         .put('/api/issues/apitest')
         .send({_id: id1, issue_title: 'Updated issue title test'})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'successfully updated');
           done();
         });
      });

      test('Multiple fields to update', function(done) {
        chai.request(server)
         .put('/api/issues/apitest')
         .send({_id: id2, issue_title: 'Updated title (multiple fields test)', issue_text: 'Updated text (multiple fields test)'})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'successfully updated');
           done();
         });
      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({created_by: 'Alice'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, 'Alice');
          done();
        });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({created_by: 'Alice', issue_title: 'Functional Test - Required fields filled in'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, 'Alice');
          assert.equal(res.body[0].issue_title, 'Functional Test - Required fields filled in');
          done();
        });
      });

    });

    //If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/apitest')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          done();
        });
      });

      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/apitest')
        .send({_id: id2})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, `deleted ${id2}`);
          console.log(res.text);
          done();
        });
      });

    });

});
