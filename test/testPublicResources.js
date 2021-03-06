// Utility methods for calling the SRI interface
var assert = require('assert');
var sriclient = require('@kathondvla/sri-client/node-sri-client');

exports = module.exports = function (base) {
  'use strict';

  const sriClientConfig = {
    baseUrl: base
  }
  const api = require('@kathondvla/sri-client/node-sri-client')(sriClientConfig)
  const doGet = function() { return api.getRaw(...arguments) };

  const utils =  require('./utils.js')(api);
  const makeBasicAuthHeader = utils.makeBasicAuthHeader;


  describe('GET public resource', function () {

    describe('List', function () {

      describe('without authentication', function () {
        it('should return resource', async function () {
          const response = await doGet('/alldatatypes?textIn=value')
        });
      });

      describe('with authentication', function () {
        it('should return resource', async function () {
          const auth = makeBasicAuthHeader('kevin@email.be', 'pwd')
          const response = await doGet('/alldatatypes?textIn=value', null, { headers: { authorization: auth } })
        });
      });

    });

    describe('Regular resource', function () {
      describe('without authentication', function () {
        it('should return resource', async function () {
          const response = await doGet('/alldatatypes/fd7e38e1-26c3-425e-9443-8a80722dfb16')
        });
      });

      describe('with authentication', function () {
        it('should return resource', async function () {
          const auth = makeBasicAuthHeader('nicole@email.be', 'pwd')
          const response = await doGet('/alldatatypes/fd7e38e1-26c3-425e-9443-8a80722dfb16', null, { headers: { authorization: auth } })
        });
      });

    });


  });

  describe('GET private resource', function () {
    describe('List', function () {

      describe('without authentication', function () {
        it('should return 401', async function () {
          await utils.testForStatusCode(
            async () => {
              await doGet('/alldatatypes')
            }, 
            (error) => {
              assert.equal(error.status, 401);
            })
        });
      });

      describe('with authentication', function () {
        it('should return resource', async function () {
          const auth = makeBasicAuthHeader('kevin@email.be', 'pwd')
          await doGet('/alldatatypes', null, { headers: { authorization: auth } })
        });
      });

    });

    describe('Regular resource', function () {
      describe('without authentication', function () {
        it('should return 401', async function () {
          await utils.testForStatusCode(
            async () => {
              await doGet('/alldatatypes/de3d49e0-70df-4cf1-ad1e-6e8645049977')
            }, 
            (error) => {
              assert.equal(error.status, 401);
            })          
        });
      });

      describe('with authentication', function () {
        it('should return resource', async function () {
          const auth = makeBasicAuthHeader('nicole@email.be', 'pwd')
          await doGet('/alldatatypes/de3d49e0-70df-4cf1-ad1e-6e8645049977', null, { headers: { authorization: auth } })
        });
      });

    });
  });

};
