var common = require('../../js/common.js');
const pMap = require('p-map'); 
const queryobject = require('../../js/queryObject.js');
const prepare = queryobject.prepareSQL; 

exports = module.exports = function (roa, extra) {
  'use strict';

  var $m = roa.mapUtils;
  var $s = roa.schemaUtils;
  var $u = roa.utils;

  var ret = {
    type: '/transactions',
    metaType: 'SRI4NODE_TRANSACTION',
    'public': false, // eslint-disable-line
    map: {
      key: {},
      transactiontimestamp: {
        fieldToColumn: [ $m.now ]
      },
      fromperson: {
        references: '/persons'
      },
      toperson: {
        references: '/persons'
      },
      description: {},
      amount: {}
    },
    schema: {
      $schema: 'http://json-schema.org/schema#',
      title: 'A single transaction between 2 people.',
      type: 'object',
      properties: {
        key: $s.guid('GUID for this transaction.'),
        transactiontimestamp: $s.timestamp('Date and time when the transaction was recorded.'),
        fromperson: $s.permalink('/persons', 'A permalink to the person that sent currency.'),
        toperson: $s.permalink('/persons', 'A permalink to the person that received currency.'),
        description: $s.string('A description, entered by the person sending, of the transaction.'),
        amount: $s.numeric('The amount of currency sent. ' +
                           'This unit is expressed as 20 units/hour, ' +
                           'irrelevant of the group\'s currency settings.')
      },
      required: ['fromperson', 'toperson', 'description', 'amount']
    },
    afterInsert: [
      async function (tx, sriRequest, elements) {
        await pMap(elements, async ({incoming}) => {
          const amount = incoming.amount;
          const tokey = incoming.toperson.href.split('/')[2];

          const query = prepare();
          query.sql('update persons set balance = (balance + ')
            .param(amount).sql(') where key = ').param(tokey);

          await common.pgExec(tx, query)
        }, {concurrency: 1})
      },
      async function (tx, sriRequest, elements) {
        await pMap(elements, async ({incoming}) => {
          const amount = incoming.amount;
          const fromkey = incoming.fromperson.href.split('/')[2];

          const query = prepare();
          query.sql('update persons set balance = (balance - ')
            .param(amount).sql(') where key = ').param(fromkey);

          await common.pgExec(tx, query)
        }, {concurrency: 1})
      }
    ],
    afterUpdate: [
      function ( tx, sriRequest, elements ) {
        throw new sriRequest.SriError({status: 401, errors: [{code: 'update.on.transactions.not.allowed'}]})
      }
    ]
  };

  common.mergeObject(extra, ret);
  return ret;
};
