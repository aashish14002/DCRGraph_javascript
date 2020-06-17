const evn = require('./Events');
const mrk = require('./Marking');
const prs = require('./dcrparser');

export default class DCRGraph {
  constructor(rawtext) {
    this.events = {};
    
    if (rawtext != undefined) {
      let data = prs.parse(rawtext);
      let events = data[0];
      let relations = data[1];
      
      let i = 0;
      let j = 0;
      let k = 0;

      // Adds the events first, and sets their marking to the one described
      for (i = 0; i < events.length; i++) {
        let e = events[i];
        let event = this.addEvent(e[0], e[1]);
        event.marking = new mrk.Marking(e[2][0], e[2][1], e[2][2]);
      };

      // Adds the relations between events, they consist of [[type, [src], [dest]]]
      for (i = 0; i < relations.length; i++) {
        let type = relations[i][0];
        let srcs = relations[i][1];
        let dsts = relations[i][2];
        for (j = 0; j < srcs.length; j++) {
          let src = srcs[j];
          for (k = 0; k < dsts.length; k++) {
            let dst = dsts[k];
            if (type == 'c') {this.addCondition(src, dst)}
            else if (type == 'm') {this.addMilestone(src, dst)}
            else if (type == 'r') {this.addResponse(src, dst)}
            else if (type == 'i') {this.addInclude(src, dst)}
            else {this.addExclude(src, dst)}
          }
        }
      }
    }
  }

  addEvent(name, label) {
    if (label == undefined) {
      let event = new evn.Event(name, name);
      this.events[name] = event;
      return event;
    }
    else {
      let event = new evn.Event(name, label);
      this.events[name] = event;
      return event;
    }
  }

  getEvent(name) {
    for (var event of Object.values(this.events)) {
      if (event.name == name) {
        return event;
      }
    }
    return false;
  }

	// src -->* trg
  addCondition(src, dist) {
    if (!(src in this.events) || !(dist in this.events)) {
      return;
    }

    this.events[dist].conditions[src] = this.events[src];
  }

  // src --><> trg
  addMilestone(src, dist) {
    if (!(src in this.events) || !(dist in this.events)) {
      return;
    }

    this.events[dist].milestones[src] = this.events[src];
  }

	// src *--> trg
  addResponse(src, dist) {
    if (!(src in this.events) || !(dist in this.events)) {
      return;
    }

    this.events[src].responses[dist] = this.events[dist];
  }

	// src -->+ trg
  addInclude(src, dist) {
    if (!(src in this.events) || !(dist in this.events)) {
      return;
    }

    this.events[src].includes[dist] = this.events[dist];
  }

	// src -->% trg
  addExclude(src, dist) {
    if (!(src in this.events) || !(dist in this.events)) {
      return;
    }

    this.events[src].excludes[dist] = this.events[dist];
  }

  execute(e) {
    if (!(e in this.events)) {
      return;
    }
    this.events[e].execute();
  }

  isAccepting() {
    for (var event of Object.values(this.events)) {
      if(!event.isAccepting()) {
        return false;
      }
    }
    return true;
  }
}

exports.DCRGraph = DCRGraph;