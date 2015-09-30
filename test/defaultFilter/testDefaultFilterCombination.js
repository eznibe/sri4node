// Utility methods for calling the SRI interface
var assert = require('assert');
var sriclient = require('sri4node-client');
var doGet = sriclient.get;

exports = module.exports = function (base) {
  'use strict';

  describe('Generic Filters', function () {

    describe('Combination match', function () {

      it('should find resources with a combined match', function () {
        return doGet(base + '/alldatatypes?text=vsko&number=450').then(function (response) {
          assert.equal(response.statusCode, 200);
          assert.equal(response.body.results.length, 1);
          assert.equal(response.body.results[0].$$expanded.text, 'VSKO');
          assert.equal(response.body.results[0].$$expanded.number, 450);
        });
      });

      it('should find resources with a combined match and modifiers', function () {
        return doGet(base + '/alldatatypes?textCaseSensitiveNot=VSKO&numberAfter=230').then(function (response) {
          assert.equal(response.statusCode, 200);
          assert.equal(response.body.results.length, 2);
          assert.equal(response.body.results[0].$$expanded.text, 'dienst informatica');
          assert.equal(response.body.results[0].$$expanded.number, 230);
          assert.equal(response.body.results[1].$$expanded.text, 'combined unit');
          assert.equal(response.body.results[1].$$expanded.number, 1000);
        });
      });

      it('should not find resources with a combined match', function () {
        return doGet(base + '/alldatatypes?textCaseSensitive=vsko&number=230').then(function (response) {
          assert.equal(response.statusCode, 200);
          assert.equal(response.body.results.length, 0);
        });
      });

    });
  });

};