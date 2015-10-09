// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var assert = require('chai').assert;

function ConnectionString(value, segments) {
  var valueStr = String(value);

  if (segments) {
    if (Object.prototype.toString.call(segments) !== '[object Array]') {
      segments = [segments];
    }

    segments.forEach(function (name) {
      var exp = '(?:^|;)' + name + '=([^;]+)';
      var match = valueStr.match(new RegExp(exp));
      if (!!match) this[name] = match[1];
    }.bind(this));
  }
}

describe('ConnectionString', function () {
  describe('#constructor', function () {
    it('finds the given segment in the connection string', function () {
      var cn = new ConnectionString('name=value', 'name');
      assert.propertyVal(cn, 'name', 'value');
    });

    it('does not find the given segment if it is missing from the connection string', function () {
      var cn = new ConnectionString('name=value', 'othername');
      assert.notProperty('othername');
    });

    it('finds more than one segment in the connection string', function () {
      var cn = new ConnectionString('name1=value1;name2=value2', ['name1', 'name2']);
      assert.propertyVal(cn, 'name1', 'value1');
      assert.propertyVal(cn, 'name2', 'value2');
    });

    it('exactly matches segment names', function () {
      var cn = new ConnectionString('not-my-name=value', 'name');
      assert.notProperty(cn, 'name');
    });

    it('only matches the segments you care about', function () {
      var cn = new ConnectionString('name1=value1;name2=value2', 'name2');
      assert.notProperty(cn, 'name1');
      assert.propertyVal(cn, 'name2', 'value2');
    });

    it('accepts any value argument that is convertible to string', function () {
      var arg = { value: 'name=value', toString: function () { return this.value; } };
      var cn = new ConnectionString(arg, 'name');
      assert.propertyVal(cn, 'name', 'value');
    });

    it('accepts any segments argument that is convertible to string', function () {
      var arg = { value: 'name', toString: function () { return this.value; } };
      var cn = new ConnectionString('name=value', arg);
      assert.propertyVal(cn, 'name', 'value');
    });

    it('accepts any segments argument that is convertible array of strings', function () {
      var arg = [
        { value: 'name', toString: function () { return this.value; } }
      ];
      var cn = new ConnectionString('name=value', arg);
      assert.propertyVal(cn, 'name', 'value');
    });

    it('creates no properties when value argument is falsy', function () {
      var cn = new ConnectionString('', 'name');
      assert.deepEqual(cn, {});
    });
  });
});