"use strict";

const core = require('@lumjs/core');
const {S,N,isObj} = core.types;
const lux = require('luxon');

/**
 * Date related functions
 * @namespace module:@lumjs/mongo-utils.date
 */

/**
 * Convert an EJSON Date object (or other value) into a JS Date object
 * @alias module:@lumjs/mongodb-utils.date.jsDate
 * @param {(object|string|number)} v - Value to convert
 * @returns {Date}
 */
function jsDate(v)
{
  if (v instanceof Date)
  { // It's already a date
    return v;
  }

  if (isObj(v))
  {
    if (typeof v.$date === S)
    { // Relaxed schema
      return Date(v.$date);
    }
    if (isObj(v.$date) && typeof v.$date.$numberLong === S)
    { // Canonical schema
      const ms = parseInt(v.$date.$numberLong);
      return new Date(ms);
    }
  }

  // Pass it to the Date constructor and cross your fingers
  return new Date(v);
}
/**
 * Convert an EJSON Date object (or other value) into a Luxon DateTime object
 * @alias module:@lumjs/mongodb-utils.date.luxonDate
 * @param {(object|string|number)} v - Value to convert
 * @returns {Date}
 */
function luxonDate(v, opts)
{
  if (v instanceof lux.DateTime)
  {
    return v;
  }

  if (typeof opts === S || opts instanceof lux.Zone)
  {
    opts = {setZone: true, zone: opts}
  }
  else if (opts === true)
  {
    opts = {setZone: true}
  }

  if (v instanceof Date)
  {
    return lux.DateTime.fromJSDate(v, opts);
  }

  if (isObj(v) && v.$date)
  {
    if (typeof v.$date === S)
    { // Relaxed schema
      return lux.DateTime.fromISO(v.$date, opts);
    }
    if (isObj(v.$date) && typeof v.$date.$numberLong === S)
    { // Canonical schema
      const ms = parseInt(v.$date.$numberLong);
      return lux.DateTime.fromMillis(ms, opts);
    }
  }
  else if (typeof v === S)
  {
    return lux.DateTime.fromISO(v, opts);
  }
  else if (typeof v === N)
  {
    return lux.DateTime.fromMillis(v, opts);
  }

  // If we reached here, things didn't work out...
  console.error("Unsupported luxon.DateTime format", v, opts);
  return lux.DateTime.now();
}

/**
 * Convert a value into an EJSON Date object
 * @alias module:@lumjs/mongodb-utils.date.mongoDate
 * 
 * @param {(object|string|number)} v - Value to convert
 * 
 * May be a `Date`, `luxon.DateTime`, `string`, or `number`.
 * Non-object values must be a format supported by the
 * JS `Date()` constructor.
 * 
 * @returns {Date}
 */
function mongoDate(v)
{
  let ms;
  
  if (v instanceof lux.DateTime)
  {
    ms = v.toMillis();
  }
  else
  {
    if (!(v instanceof Date))
    { // Force it into a Date
      v = new Date(v);
    }
    ms = v.getTime();
  }

  return {$date:{$numberLong: ms.toString()}};
}

module.exports =
{
  jsDate, luxonDate, mongoDate,
}
