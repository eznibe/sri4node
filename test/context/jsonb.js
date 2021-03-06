var common = require('../../js/common.js');
var roa = require('../../sri4node.js');
var $m = roa.mapUtils;
var $s = roa.schemaUtils;

exports = module.exports = function (extra) {
  'use strict';
  var ret = {
    type: '/jsonb',
    metaType: 'SRI4NODE_JSONB',
    'public': true, // eslint-disable-line
    schema: {
      $schema: 'http://json-schema.org/schema#',
      title: 'jsonb test context.',
      type: 'object',
      properties: {
        key: $s.guid(''),
        details: { "type": "object" },
        foo: $s.permalink('/foo', 'json permalink test')
      },
      required: ['key', 'details', 'foo']
    },    
    map: {
      key: {},
      details: {},
      foo: {}
    }
  };

  common.mergeObject(extra, ret);
  return ret;
};
