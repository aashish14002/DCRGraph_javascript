(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var evn = require('./Events');
var mrk = require('./Marking');
var prs = require('./dcrparser');

var DCRGraph = function () {
  function DCRGraph(rawtext) {
    _classCallCheck(this, DCRGraph);

    this.events = {};

    if (rawtext != undefined) {
      var data = prs.parse(rawtext);
      var events = data[0];
      var relations = data[1];

      var i = 0;
      var j = 0;
      var k = 0;

      // Adds the events first, and sets their marking to the one described
      for (i = 0; i < events.length; i++) {
        var e = events[i];
        var event = this.addEvent(e[0], e[1]);
        event.marking = new mrk.Marking(e[2][0], e[2][1], e[2][2]);
      };

      // Adds the relations between events, they consist of [[type, [src], [dest]]]
      for (i = 0; i < relations.length; i++) {
        var type = relations[i][0];
        var srcs = relations[i][1];
        var dsts = relations[i][2];
        for (j = 0; j < srcs.length; j++) {
          var src = srcs[j];
          for (k = 0; k < dsts.length; k++) {
            var dst = dsts[k];
            if (type == 'c') {
              this.addCondition(src, dst);
            } else if (type == 'm') {
              this.addMilestone(src, dst);
            } else if (type == 'r') {
              this.addResponse(src, dst);
            } else if (type == 'i') {
              this.addInclude(src, dst);
            } else {
              this.addExclude(src, dst);
            }
          }
        }
      }
    }
  }

  _createClass(DCRGraph, [{
    key: 'addEvent',
    value: function addEvent(name, label) {
      if (label == undefined) {
        var event = new evn.Event(name, name);
        this.events[name] = event;
        return event;
      } else {
        var _event = new evn.Event(name, label);
        this.events[name] = _event;
        return _event;
      }
    }
  }, {
    key: 'getEvent',
    value: function getEvent(name) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.values(this.events)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var event = _step.value;

          if (event.name == name) {
            return event;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
    }

    // src -->* trg

  }, {
    key: 'addCondition',
    value: function addCondition(src, dist) {
      if (!(src in this.events) || !(dist in this.events)) {
        return;
      }

      this.events[dist].conditions[src] = this.events[src];
    }

    // src --><> trg

  }, {
    key: 'addMilestone',
    value: function addMilestone(src, dist) {
      if (!(src in this.events) || !(dist in this.events)) {
        return;
      }

      this.events[dist].milestones[src] = this.events[src];
    }

    // src *--> trg

  }, {
    key: 'addResponse',
    value: function addResponse(src, dist) {
      if (!(src in this.events) || !(dist in this.events)) {
        return;
      }

      this.events[src].responses[dist] = this.events[dist];
    }

    // src -->+ trg

  }, {
    key: 'addInclude',
    value: function addInclude(src, dist) {
      if (!(src in this.events) || !(dist in this.events)) {
        return;
      }

      this.events[src].includes[dist] = this.events[dist];
    }

    // src -->% trg

  }, {
    key: 'addExclude',
    value: function addExclude(src, dist) {
      if (!(src in this.events) || !(dist in this.events)) {
        return;
      }

      this.events[src].excludes[dist] = this.events[dist];
    }
  }, {
    key: 'execute',
    value: function execute(e) {
      if (!(e in this.events)) {
        return;
      }
      this.events[e].execute();
    }
  }, {
    key: 'isAccepting',
    value: function isAccepting() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.values(this.events)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var event = _step2.value;

          if (!event.isAccepting()) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    }
  }]);

  return DCRGraph;
}();

exports.default = DCRGraph;


exports.DCRGraph = DCRGraph;

},{"./Events":2,"./Marking":3,"./dcrparser":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mrk = require('./Marking.js');

var Event = function () {
  function Event(name, label) {
    _classCallCheck(this, Event);

    this.name = name;
    this.label = label;
    this.marking = new mrk.Marking(false, true, false);
    this.conditions = {};
    this.milestones = {};
    this.responses = {};
    this.includes = {};
    this.excludes = {};
  }

  _createClass(Event, [{
    key: 'enabled',
    value: function enabled() {
      if (!this.marking.isIncluded) {
        return false;
      }
      var conds = Object.values(this.conditions);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = conds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var event = _step.value;

          if (event.marking.isIncluded && !event.marking.isExecuted) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var miles = Object.values(this.milestones);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = miles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var event = _step2.value;

          if (event.marking.isIncluded && event.marking.isPending) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    }
  }, {
    key: 'execute',
    value: function execute() {
      if (!this.enabled()) {
        return;
      }
      this.marking.isExecuted = true;
      this.marking.isPending = false;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.values(this.responses)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var event = _step3.value;

          event.marking.isPending = true;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Object.values(this.excludes)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var event = _step4.value;

          event.marking.isIncluded = false;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.values(this.includes)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var event = _step5.value;

          event.marking.isIncluded = true;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return;
    }
  }, {
    key: 'isAccepting',
    value: function isAccepting() {
      return !(this.marking.isPending && this.marking.isIncluded);
    }
  }]);

  return Event;
}();

exports.default = Event;


exports.Event = Event;

},{"./Marking.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Marking = function Marking(isExecuted, isIncluded, isPending) {
  _classCallCheck(this, Marking);

  this.isExecuted = isExecuted;
  this.isIncluded = isIncluded;
  this.isPending = isPending;
};

exports.default = Marking;


exports.Marking = Marking;

},{}],4:[function(require,module,exports){
/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function (expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function literal(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },

    "class": function _class(expectation) {
      var escapedParts = "",
          i;

      for (i = 0; i < expectation.parts.length; i++) {
        escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
      }

      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },

    any: function any(expectation) {
      return "any character";
    },

    end: function end(expectation) {
      return "end of input";
    },

    other: function other(expectation) {
      return expectation.description;
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
      return '\\x0' + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return '\\x' + hex(ch);
    });
  }

  function classEscape(s) {
    return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
      return '\\x0' + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return '\\x' + hex(ch);
    });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i,
        j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},
      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction = peg$parsestart,
      peg$c0 = function peg$c0(g) {
    return g;
  },
      peg$c1 = function peg$c1(e, gs) {
    var g0 = gs[0];
    var g1 = gs[1];
    g0.unshift(e.slice(0, 3));
    g1 = g1.concat(e[3]);
    return [g0, g1];
  },
      peg$c2 = function peg$c2(e) {
    if (e[3].length > 0) {
      return [[e.slice(0, 3)], e[3]];
    } else {
      return [[e.slice(0, 3)], []];
    }
  },
      peg$c3 = function peg$c3(n, l, m, r) {
    return [n, l, m, r];
  },
      peg$c4 = function peg$c4(n, l, m) {
    return [n, l, m, []];
  },
      peg$c5 = function peg$c5(n, m, r) {
    return [n, n, m, r];
  },
      peg$c6 = function peg$c6(n, m) {
    return [n, n, m, []];
  },
      peg$c7 = "(",
      peg$c8 = peg$literalExpectation("(", false),
      peg$c9 = ")",
      peg$c10 = peg$literalExpectation(")", false),
      peg$c11 = function peg$c11() {
    return [false, true, false];
  },
      peg$c12 = function peg$c12(b1, b2, b3) {
    return [b1, b2, b3];
  },
      peg$c13 = "{",
      peg$c14 = peg$literalExpectation("{", false),
      peg$c15 = "}",
      peg$c16 = peg$literalExpectation("}", false),
      peg$c17 = function peg$c17(rs) {
    return rs;
  },
      peg$c18 = function peg$c18(r) {
    return r;
  },
      peg$c19 = "-->*",
      peg$c20 = peg$literalExpectation("-->*", false),
      peg$c21 = function peg$c21(es1, es2) {
    return ['c', es1, es2];
  },
      peg$c22 = "--><>",
      peg$c23 = peg$literalExpectation("--><>", false),
      peg$c24 = function peg$c24(es1, es2) {
    return ['m', es1, es2];
  },
      peg$c25 = "*-->",
      peg$c26 = peg$literalExpectation("*-->", false),
      peg$c27 = function peg$c27(es1, es2) {
    return ['r', es1, es2];
  },
      peg$c28 = "-->+",
      peg$c29 = peg$literalExpectation("-->+", false),
      peg$c30 = function peg$c30(es1, es2) {
    return ['i', es1, es2];
  },
      peg$c31 = "-->%",
      peg$c32 = peg$literalExpectation("-->%", false),
      peg$c33 = function peg$c33(es1, es2) {
    return ['e', es1, es2];
  },
      peg$c34 = function peg$c34(n) {
    return [n];
  },
      peg$c35 = function peg$c35(ns) {
    return ns;
  },
      peg$c36 = function peg$c36(n, ns) {
    ns.push(n);return ns;
  },
      peg$c37 = " ",
      peg$c38 = peg$literalExpectation(" ", false),
      peg$c39 = function peg$c39(t, ws, n) {
    return t.concat(ws.join(''), n);
  },
      peg$c40 = /^[a-z]/,
      peg$c41 = peg$classExpectation([["a", "z"]], false, false),
      peg$c42 = /^[A-Z]/,
      peg$c43 = peg$classExpectation([["A", "Z"]], false, false),
      peg$c44 = /^[0-9]/,
      peg$c45 = peg$classExpectation([["0", "9"]], false, false),
      peg$c46 = "_",
      peg$c47 = peg$literalExpectation("_", false),
      peg$c48 = function peg$c48(str) {
    return str.join('');
  },
      peg$c49 = "<",
      peg$c50 = peg$literalExpectation("<", false),
      peg$c51 = "-",
      peg$c52 = peg$literalExpectation("-", false),
      peg$c53 = ">",
      peg$c54 = peg$literalExpectation(">", false),
      peg$c55 = function peg$c55(lab) {
    return lab.join('');
  },
      peg$c56 = "0",
      peg$c57 = peg$literalExpectation("0", false),
      peg$c58 = function peg$c58() {
    return false;
  },
      peg$c59 = "1",
      peg$c60 = peg$literalExpectation("1", false),
      peg$c61 = function peg$c61() {
    return true;
  },
      peg$c62 = ",",
      peg$c63 = peg$literalExpectation(",", false),
      peg$c64 = "\t",
      peg$c65 = peg$literalExpectation("\t", false),
      peg$c66 = "\r\n",
      peg$c67 = peg$literalExpectation("\r\n", false),
      peg$c68 = "\n",
      peg$c69 = peg$literalExpectation("\n", false),
      peg$currPos = 0,
      peg$savedPos = 0,
      peg$posDetailsCache = [{ line: 1, column: 1 }],
      peg$maxFailPos = 0,
      peg$maxFailExpected = [],
      peg$silentFails = 0,
      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos],
        p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
  }

  function peg$parsestart() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsens();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsegraph();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsens();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsegraph() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseevent();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsens();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsesep();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsens();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsegraph();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseevent();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseevent() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parsename();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = peg$parselabel();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsemarking();
            if (s5 !== peg$FAILED) {
              s6 = peg$parserels();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3(s1, s3, s5, s6);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsename();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parselabel();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsemarking();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c4(s1, s3, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsename();
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            s3 = peg$parsemarking();
            if (s3 !== peg$FAILED) {
              s4 = peg$parserels();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c5(s1, s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsename();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsews();
            if (s2 !== peg$FAILED) {
              s3 = peg$parsemarking();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }
    }

    return s0;
  }

  function peg$parsemarking() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c7;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c8);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c10);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c11();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c8);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsebool();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsesep();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsebool();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsesep();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsebool();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s9 = peg$c9;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c10);
                        }
                      }
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c12(s3, s5, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parserels() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenl();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 123) {
            s4 = peg$c13;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c14);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsens();
            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$parserelations();
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$parserelations();
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsens();
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s8 = peg$c15;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c16);
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c17(s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 123) {
          s2 = peg$c13;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c14);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsens();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parserelations();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parserelations();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsens();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s6 = peg$c15;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c16);
                  }
                }
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c17(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parserelations() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      s2 = peg$parserelation();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsenl();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        s2 = peg$parserelation();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parserelation() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseeventids();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c19) {
          s3 = peg$c19;
          peg$currPos += 4;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c20);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseeventids();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c21(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseeventids();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c22) {
            s3 = peg$c22;
            peg$currPos += 5;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c23);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseeventids();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseeventids();
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c25) {
              s3 = peg$c25;
              peg$currPos += 4;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c26);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseeventids();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c27(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseeventids();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsews();
            if (s2 !== peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c28) {
                s3 = peg$c28;
                peg$currPos += 4;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c29);
                }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parsews();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseeventids();
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c30(s1, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseeventids();
            if (s1 !== peg$FAILED) {
              s2 = peg$parsews();
              if (s2 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c31) {
                  s3 = peg$c31;
                  peg$currPos += 4;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c32);
                  }
                }
                if (s3 !== peg$FAILED) {
                  s4 = peg$parsews();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parseeventids();
                    if (s5 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c33(s1, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseeventids() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsename();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c34(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c8);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsenames();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c9;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c10);
            }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c35(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parsenames() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsename();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsesep();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenames();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c36(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsename();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c34(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsename() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsetext();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (input.charCodeAt(peg$currPos) === 32) {
        s3 = peg$c37;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c38);
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (input.charCodeAt(peg$currPos) === 32) {
            s3 = peg$c37;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c38);
            }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsename();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c39(s1, s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsetext();
    }

    return s0;
  }

  function peg$parsetext() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (peg$c40.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c41);
      }
    }
    if (s2 === peg$FAILED) {
      if (peg$c42.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c43);
        }
      }
      if (s2 === peg$FAILED) {
        if (peg$c44.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 95) {
            s2 = peg$c46;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c47);
            }
          }
        }
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c40.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c41);
          }
        }
        if (s2 === peg$FAILED) {
          if (peg$c42.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c43);
            }
          }
          if (s2 === peg$FAILED) {
            if (peg$c44.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c45);
              }
            }
            if (s2 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 95) {
                s2 = peg$c46;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c47);
                }
              }
            }
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c48(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parselabel() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 60) {
      s1 = peg$c49;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c50);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c40.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c41);
        }
      }
      if (s3 === peg$FAILED) {
        if (peg$c42.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c43);
          }
        }
        if (s3 === peg$FAILED) {
          if (peg$c44.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c45);
            }
          }
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 95) {
              s3 = peg$c46;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c47);
              }
            }
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s3 = peg$c51;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c52);
                }
              }
              if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 32) {
                  s3 = peg$c37;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c38);
                  }
                }
              }
            }
          }
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c40.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c41);
            }
          }
          if (s3 === peg$FAILED) {
            if (peg$c42.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c43);
              }
            }
            if (s3 === peg$FAILED) {
              if (peg$c44.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c45);
                }
              }
              if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 95) {
                  s3 = peg$c46;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c47);
                  }
                }
                if (s3 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 45) {
                    s3 = peg$c51;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c52);
                    }
                  }
                  if (s3 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 32) {
                      s3 = peg$c37;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c38);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 62) {
          s3 = peg$c53;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c54);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c55(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsebool() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 48) {
      s1 = peg$c56;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c57);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c58();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 49) {
        s1 = peg$c59;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c60);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c61();
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsesep() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 44) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c63);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsews1() {
    var s0, s1;

    s0 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s1 = peg$c37;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c38);
      }
    }
    if (s1 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 9) {
        s1 = peg$c64;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c65);
        }
      }
    }
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (input.charCodeAt(peg$currPos) === 32) {
          s1 = peg$c37;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c38);
          }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 9) {
            s1 = peg$c64;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c65);
            }
          }
        }
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsews() {
    var s0, s1;

    s0 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s1 = peg$c37;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c38);
      }
    }
    if (s1 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 9) {
        s1 = peg$c64;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c65);
        }
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (input.charCodeAt(peg$currPos) === 32) {
        s1 = peg$c37;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c38);
        }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 9) {
          s1 = peg$c64;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c65);
          }
        }
      }
    }

    return s0;
  }

  function peg$parsenl() {
    var s0;

    if (input.substr(peg$currPos, 2) === peg$c66) {
      s0 = peg$c66;
      peg$currPos += 2;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c67);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c68;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c69);
        }
      }
    }

    return s0;
  }

  function peg$parsens() {
    var s0, s1;

    s0 = [];
    s1 = peg$parsews1();
    if (s1 === peg$FAILED) {
      s1 = peg$parsenl();
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$parsews1();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenl();
      }
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
};

},{}],5:[function(require,module,exports){
'use strict';

var dcr = require('./DCRGraph.js');

var eventTableHeadings = ['name', 'isPending', 'isIncluded', 'isExecuted'];
var g1 = "";
var actionLogs = "";

var inputFileElement = document.getElementById("file");
inputFileElement.addEventListener("change", handleFiles, false);
var enabledEvents = [];

function handleFiles() {
  var file = document.getElementById("file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var graphInput = event.target.result;
      try {
        g1 = new dcr.DCRGraph(graphInput);
        var d = new Date();
        buildTable();
        addLogs("[" + d.toLocaleTimeString() + "] Successfully loaded DCR graph file " + file.name);
      } catch (err) {
        var _d = new Date();
        addLogs("[" + _d.toLocaleTimeString() + "] Failed to load DCR graph file " + file.name);
        console.log(err);
        alert("Failed to load file:\n" + err.location.start.line + ':' + err.location.start.column + ': ' + err.message);
      }
    };
    reader.readAsText(file);
  } else {
    var d = new Date();
    addLogs("[" + d.toLocaleTimeString() + "] Failed to load DCR graph file");
    alert("Failed to load file");
  }
  document.getElementById("file").value = '';
}

// returns priority for the event
// 0 - event is enabled and pending
// 1 - event is enabled but not pending
// 2 - event is not enabled but pending
// 3 - event is neither enabled nor pending
function eventPriority(event) {
  var eventComp = 3;
  if (enabledEvents.includes(event.label)) {
    if (event.marking.isPending) {
      eventComp = 0;
    } else {
      eventComp = 1;
    }
  } else if (event.enabled()) {
    enabledEvents.push(event.label);
    if (event.marking.isPending) {
      eventComp = 0;
    } else {
      eventComp = 1;
    }
  } else if (event.marking.isPending) {
    eventComp = 2;
  }
  return eventComp;
}

function buildTable() {
  var eventTableBody = document.getElementById('eventsTable').getElementsByTagName('tbody')[0];
  eventTableBody.innerHTML = '';
  enabledEvents = [];
  var eventList = Object.values(g1.events);
  eventList.sort(function (event1, event2) {
    var event1Comp = eventPriority(event1);
    var event2Comp = eventPriority(event2);
    return event1Comp - event2Comp;
  });
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = eventList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var event = _step.value;

      var row = eventTableBody.insertRow();
      row;
      for (var key in eventTableHeadings) {
        var _cell = row.insertCell(key);
        var text = document.createTextNode(" ");
        if (key == 0) {
          text = document.createTextNode(event[eventTableHeadings[key]]);
        } else if (event.marking[eventTableHeadings[key]] == true) {
          text = document.createElement('img');
          text.src = "img/" + eventTableHeadings[key] + ".png";
        }
        _cell.appendChild(text);
      }
      var cell = row.insertCell(-1);
      var executeButton = document.createElement("button");
      executeButton.innerHTML = "Execute";
      executeButton.setAttribute("data-dcr-event", event.name);
      executeButton.addEventListener("click", function () {
        var d = new Date();
        var executedEvent = g1.getEvent(this.dataset.dcrEvent);
        if (executedEvent == false) {
          return;
        }
        executedEvent.execute();
        var log = "[" + d.toLocaleTimeString() + "] Executed Event : Name - " + executedEvent.name + ", Label - " + executedEvent.label;
        addLogs(log);
        buildTable();
      });

      if (!event.enabled()) {
        executeButton.disabled = true;
      }
      cell.appendChild(executeButton);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function addLogs(log) {
  actionLogs = actionLogs + log + "\n";
  var logTableBody = document.getElementById('logTable').getElementsByTagName('tbody')[0];
  var row = logTableBody.insertRow(0);
  var cell = row.insertCell(-1);
  var text = document.createTextNode(log);
  cell.appendChild(text);
}

var a = document.getElementById('save');
a.onclick = function () {
  var a = document.getElementById("save");
  var file = new Blob([actionLogs], { type: 'text/plain' });
  a.href = URL.createObjectURL(file);
  a.download = "actionLogs.txt";
};

},{"./DCRGraph.js":1}]},{},[5]);
