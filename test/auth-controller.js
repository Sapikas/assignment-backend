const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth controller - Login', function() {
  before(function(done) {
    mongoose
    .connect(
      'mongodb://localhost/test-messages'
    )
    .then(result => {
      const user = new User({
        email: 'test@test.com',
        password: 'tester',
        name: 'Test',
        posts: [],
        _id: '62a7542e83abad186852d8b7'
      });
      return user.save();
    })
    .then(() => {
      done();
    })
  });

  it('should throw an error with code 500 if accessing database fails', function(done) { //with done for parameter mocha understand that should execute the code sync (where there is "done()" (check line 22))
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: '12345'
      }
    };

    AuthController.login(req, {}, () => {}).then(results => {
      expect(results).to.be.an('error');
      expect(results).to.have.property('statusCode', 500);
      done()
    });

    User?.fineOne?.restore();
  });

  it('should send a response with a valid user status for an existing user', function() {
    const req = {
      userId: '62a7542e83abad186852d8b7'
    }
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status
      }
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        mongoose.disconnect();
        done()
      })
  }) 
});