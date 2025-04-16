"use strict";

const oid = require('./oid');
const date = require('./date');

/**
 * MongoDB Extended JSON (EJSON) Utilities
 * @exports module:@lumjs/mongo-utils
 */

module.exports =
{
  date,
  ...oid,
}
