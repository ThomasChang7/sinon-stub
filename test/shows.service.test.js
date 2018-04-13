process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();

const shows = require('./fixtures/shows.json');

const base = 'http://localhost:3000';

describe('show service', () => {
  describe.skip('when not stubbed', () => {
    describe('GET /api/v1/shows', () => {
      it('should return all shows', done => {
        request.get(`${base}/api/v1/shows`, (err, res, body) => {
          res.statusCode.should.eql(200);

          res.headers['content-type'].should.contain('application/json');

          body = JSON.parse(body);

          body.status.should.eql('success');

          body.data.length.should.eql(3);

          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');

          body.data[0].name.should.eql('Westworld');
          done();
        });
      });
    });
    describe('GET /api/v1/shows/:id', () => {
      it('should respond with a single show', done => {
        request.get(`${base}/api/v1/shows/4`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
          body.data[0].name.should.eql('Westworld');
          done();
        });
      });
      it('should throw an error if the show does not exist', done => {
        request.get(`${base}/api/v1/shows/999`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That show does not exist.');
          done();
        });
      });
    });
    describe('POST /api/v1/shows', () => {
      it('should return the show that was added', done => {
        const options = {
          method: 'post',
          body: {
            name: 'Family Guy',
            genre: 'Comedy',
            rating: 8,
            explicit: true
          },
          json: true,
          url: `${base}/api/v1/shows`
        };
        request(options, (err, res, body) => {
          res.statusCode.should.equal(201);
          res.headers['content-type'].should.contain('application/json');
          body.status.should.eql('success');
          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
          done();
        });
      });
    });
  });

  describe('when stubbed', () => {
    beforeEach(() => {
      this.get = sinon.stub(request, 'get');
      this.post = sinon.stub(request, 'post');
      this.put = sinon.stub(request, 'put');
      this.delete = sinon.stub(request, 'delete');
    });

    afterEach(() => {
      request.get.restore();
      request.post.restore();
      request.put.restore();
      request.delete.restore();
    });

    describe('GET /api/v1/shows', () => {
      it('should return all shows', done => {
        this.get.yields(null, shows.all.success.res, JSON.stringify(shows.all.success.body));
        request.get(`${base}/api/v1/shows`, (err, res, body) => {
          res.statusCode.should.eql(200);

          res.headers['content-type'].should.contain('application/json');

          body = JSON.parse(body);

          body.status.should.eql('success');

          body.data.length.should.eql(3);

          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');

          body.data[0].name.should.eql('Westworld');
          done();
        });
      });
    });
    describe('GET /api/v1/shows/:id', () => {
      it('should respond with a single show', done => {
        const obj = shows.single.success;
        this.get.yields(null, obj.res, JSON.stringify(obj.body));
        request.get(`${base}/api/v1/shows/4`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
          body.data[0].name.should.eql('Westworld');
          done();
        });
      });
      it('should throw an error if the show does not exist', done => {
        const obj = shows.single.failure;
        this.get.yields(null, obj.res, JSON.stringify(obj.body));
        request.get(`${base}/api/v1/shows/999`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That show does not exist.');
          done();
        });
      });
    });
    describe('POST /api/v1/shows', () => {
      it('should return the show that was added', done => {
        const options = {
          body: {
            name: 'Family Guy',
            genre: 'Comedy',
            rating: 8,
            explicit: true
          },
          json: true,
          url: `${base}/api/v1/shows`
        };
        const obj = shows.add.success;
        this.post.yields(null, obj.res, JSON.stringify(obj.body));
        request.post(options, (err, res, body) => {
          res.statusCode.should.equal(201);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
          body.data[0].name.should.eql('Family Guy');
          done();
        });
      });
      it('should throw an error if the payload is malformed', done => {
        const options = {
          body: { name: 'Family Guy' },
          json: true,
          url: `${base}/api/v1/shows`
        };
        const obj = shows.add.failure;
        this.post.yields(null, obj.res, JSON.stringify(obj.body));
        request.post(options, (err, res, body) => {
          res.statusCode.should.equal(400);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          should.exist(body.message);
          done();
        });
      });
    });
    describe('PUT /api/v1/shows', () => {
      it('should return the show that was updated', done => {
        const options = {
          body: { rating: 9 },
          json: true,
          url: `${base}/api/v1/shows/5`
        };
        const obj = shows.update.success;
        this.put.yields(null, obj.res, JSON.stringify(obj.body));
        request.put(options, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
          body.data[0].name.should.eql('Family Guy');
          body.data[0].rating.should.eql(8);
          done();
        });
      });
      it('should throw an error if the show does not exist', done => {
        const options = {
          body: { rating: 9 },
          json: true,
          url: `${base}/api/v1/shows/5`
        };
        const obj = shows.update.failure;
        this.put.yields(null, obj.res, JSON.stringify(obj.body));
        request.put(options, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That show does not exist.');
          done();
        });
      });
    });
    describe('DELETE /api/v1/shows/:id', () => {
      it('should return the show that was deleted', done => {
        const obj = shows.delete.success;
        this.delete.yields(null, obj.res, JSON.stringify(obj.body));
        request.delete(`${base}/api/v1/shows/5`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
          body.data[0].name.should.eql('Family Guy');
          done();
        });
      });
      it('should throw an error if the show does not exist', done => {
        const obj = shows.delete.failure;
        this.delete.yields(null, obj.res, JSON.stringify(obj.body));
        request.delete(`${base}/api/v1/shows/5`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That show does not exist.');
          done();
        });
      });
    });
  });
});
