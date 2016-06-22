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
describe('Page model', function () {
  before(function(){
    return Page.sync({force: true})
    .then(function(){
      return User.sync({force:true})
    })
  });

  describe('Virtuals', function () {
    var page;
    beforeEach(function(){
      page = Page.build({});

    });
    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function(){
        page.urlTitle = 'some_title';
        expect(page.route).to.equal('/wiki/some_title');
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function(){
        page.content = "whatever";
        var result = marked(page.content);
        expect(page.renderedContent).to.equal(result);
      });
    });
  });

  describe('Class methods', function () {
    beforeEach(function (done) {
      Page.create({
        title: 'foo4',
        content: 'bar',
        tags: ['foo', 'bar']
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
    afterEach(function(done){
      Page.destroy({where: {title: 'foo4'}})
      .then(function () {
        done();
      })
      .catch(done);
    });
    it('gets pages with the search tag', function (done) {
      Page.findByTag('bar')
      .then(function (pages) {
        expect(pages).to.have.lengthOf(1);
        done();
      })
      .catch(done);
    });

it('does not get pages without the search tag', function (done) {
  Page.findByTag('falafel')
  .then(function (pages) {
    expect(pages).to.have.lengthOf(0);
    done();
  })
  .catch(done);
});

  });

  describe('Instance methods', function () {
    var base, shared_tag, no_shared_tag;
    beforeEach(function (done) {

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
        return Page.create({
          title: 'foo3',
          content: 'bar3',
          tags: ['foos', 'bars']
        })
      })
      .then(function(last){
        no_shared_tag = last;
        done();
      })
      .catch(done);

    });

     afterEach(function(done){
      Page.destroy({where: {title: {
         $like: 'foo%'
      }}})
      .then(function () {
        done();
      })
      .catch(done);
    });

    describe('findSimilar', function () {
      it('never gets itself', function(done){
        //console.log(base);
        base.findSimilar()
        .then(function(answer){
          // console.log(answer.length);
          answer.should.not.include.something.with.property('title', base.title);
          expect(answer).to.have.lengthOf(1);
          done();
        });

        //expect(result).to.have.lengthOf(1);
      });
      it('gets other pages with any common tags', function(done) {
        base.findSimilar()
        .then(function(answer){
          // console.log(answer.length);
          answer.should.not.include.something.with.property('title', base.title);
          expect(answer).to.have.lengthOf(1);
          done();
        });
      });
      it('does not get other pages without any common tags', function(done) {
        base.findSimilar()
        .then(function(answer){
          // console.log(answer.length);
          answer.should.not.include.something.with.property('title', base.title);
          expect(answer).to.have.lengthOf(1);
          done();
        });
      });
    });
  });

  describe('Validations', function () {

    // beforeEach(function (done) {
    //   var page = Page.build({
    //   })
    //   done();
    // });

    it('errors without title', function (done) {
      var p = Page.build({});

      return p.validate()
      .then(function(err) {
        expect(err).to.exist;
        done();
      }).catch(done);

    });
    it('errors without content', function (done) {
      var p = Page.build({
        title: 'carsfoo'
      });

      return p.validate()
      .then(function(err) {
        expect(err).to.exist;
        done();
      }).catch(done);

    });
    it('errors given an invalid status', function (done) {
      var p = Page.build({
        status: 'carsfind'
      });

      return p.validate()
      .then(function(err) {
        expect(err).to.exist;
        done();
      }).catch(done);

    });
    // });
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating', function(done){
       var p = Page.build({
        title: 'anything &*cool',
        content: 'whatever'
      });
       p.save()
       .then(function(page){
         expect(page.urlTitle).to.equal('anything_cool');
         done();
       })
       .catch(done);

    });
  });
});

