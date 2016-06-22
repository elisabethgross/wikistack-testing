var chai = require('chai');
var expect = require('chai').expect;
var spies = require('chai-spies');
var models = require('../models');
var Page = models.Page;
var User = models.User;
var marked = require('marked');
chai.should();
chai.use(require('chai-things'));
chai.use(spies);
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe('http requests', function () {

  describe('GET /wiki/', function () {
    it('gets 200 on index', function (done) {
      agent
      .get('/wiki')
      .expect(200, done);
    });
  });

  describe('GET /wiki/add', function () {
    it('responds with 200', function(done){
      agent
      .get('/wiki/add')
      .expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle', function () {
    it('responds with 404 on page that does not exist', function(done){
       agent
      .get('/wiki/sdlkfjdkjf')
      .expect(404, done);
    });
    it('responds with 200 on page that does exist', function(done){
        Page.create({
        title: 'foo4',
        content: 'bar',
        tags: ['foo', 'bar']
      })
      .catch(done);

       agent
      .get('/wiki/foo4')
      .expect(200, done);
    });
  });

  describe('GET /wiki/search', function () {
    it('responds with 200', function(done){
      agent
      .get('/wiki/search')
      .expect(200, done);

    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', function(done){
        agent
        .get('/wiki/sdlkfjdkjf/similar')
        .expect(404, done);
    });
    it('responds with 200 for similar page', function(done){
      var base, shared_tag;
      Page.create({
        title: 'foo',
        content: 'bar',
        tags: ['foo', 'bar']
      })
      .then(function (createdPage) {
        base = createdPage;
        return Page.create({
          title: 'foo2',
          content: 'bar2',
          tags: ['foo', 'bar2']
        })
      })
      .then(function(anotherOne){
        shared_tag = anotherOne;
      })
      .catch(done);
      agent
      .get('/wiki/foo/similar')
      .expect(200,done);
    });
  });

  describe('POST /wiki', function () {
    it('responds with 302');
    it('creates a page in the database');
  });

});
