const mrk = require('./Marking.js');

export default class Event {
  constructor(name, label) {
    this.name = name;
    this.label = label;
    this.marking = new mrk.Marking(false, true, false);
    this.conditions = {};
    this.milestones = {};
    this.responses = {};
    this.includes = {};
    this.excludes = {};
  }

  enabled() {
    if (!this.marking.isIncluded) {
      return false;
    }
    var conds = Object.values(this.conditions);
    for (var event of conds) {
      if (event.marking.isIncluded && !event.marking.isExecuted)
      {
        return false;
      }
    }
    var miles = Object.values(this.milestones);
    for (var event of miles) {
      if (event.marking.isIncluded && event.marking.isPending)
      {
        return false;
      }
    }
    return true;
  }

  execute() {
    if (!this.enabled()){
      return;
    }
    this.marking.isExecuted = true;
    this.marking.isPending = false;

    for (var event of Object.values(this.responses)) {
      event.marking.isPending = true;
    }

    for (var event of Object.values(this.excludes)) {
      event.marking.isIncluded = false;
    }

    for (var event of Object.values(this.includes)) {
      event.marking.isIncluded = true;
    }
    return;
  }

  isAccepting() {
    return (!(this.marking.isPending && this.marking.isIncluded));
  }
}

exports.Event = Event;