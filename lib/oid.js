"use strict";

const core = require('@lumjs/core');
const {S,isObj,isNil} = core.types;

/**
 * Convert an ObjectId EJSON object into an id string
 * @alias module:@lumjs/mongodb-utils.oidStr
 * @param {(object|string)} v - ObjectId to convert
 * @returns {string}
 */
function oidStr(v)
{
  if (typeof v === S)
  { // It's already a string
    return v;
  }

  if (isObj(v) && typeof v.$oid === S)
  { // A MongoDB ObjectID in serialized JSON format.
    return v.$oid;
  }
  
  // Try forcing it to be a string.
  return isNil(v) ? v : v.toString();
}

/**
 * Convert an ObjectId string into an EJSON object
 * @alias module:@lumjs/mongodb-utils.oidObj
 * @param {(object|string)} v - ObjectId to convert
 * @returns {object}
 */
function oidObj(v)
{
  if (isObj(v) && typeof v.$oid === S)
  { // It's already an oid object
    return v;
  }

  return isNil(v) ? v : {$oid: v.toString()};
}

module.exports =
{
  oidStr, oidObj,
}
