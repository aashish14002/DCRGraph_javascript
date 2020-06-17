const dcr = require('./DCRGraph.js');

var eventTableHeadings = ['name', 'isPending', 'isIncluded', 'isExecuted'];
var g1 = "";
var actionLogs = "";

const inputFileElement = document.getElementById("file");
inputFileElement.addEventListener("change", handleFiles, false);
var enabledEvents = [];

function handleFiles() {
  var file = document.getElementById("file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var graphInput = event.target.result;
      try {
        g1 = new dcr.DCRGraph(graphInput);
        let d = new Date();
        buildTable();
        addLogs("[" + d.toLocaleTimeString() + "] Successfully loaded DCR graph file " + file.name);
      } catch (err) {
        let d = new Date();
        addLogs("[" + d.toLocaleTimeString() + "] Failed to load DCR graph file " + file.name)
        console.log(err);
        alert("Failed to load file:\n" + err.location.start.line + ':' + err.location.start.column + ': ' + err.message);
      }
    }
    reader.readAsText(file);
  } 
  else {
    let d = new Date();
    addLogs("[" + d.toLocaleTimeString() + "] Failed to load DCR graph file")
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
  let eventComp = 3;
  if (enabledEvents.includes(event.label)) {
    if (event.marking.isPending) {
      eventComp = 0;
    } else {
      eventComp = 1;
    }
  } else if (event.enabled()) {
    enabledEvents.push(event.label)
    if (event.marking.isPending) {
      eventComp = 0;
    } else {
      eventComp = 1;
    }
  } else if (event.marking.isPending){
    eventComp = 2;
  }
  return eventComp
}

function buildTable() {
  var eventTableBody = document.getElementById('eventsTable').getElementsByTagName('tbody')[0];
  eventTableBody.innerHTML = '';
  enabledEvents = [];
  var eventList = Object.values(g1.events);
  eventList.sort(function(event1, event2) {
    let event1Comp = eventPriority(event1);
    let event2Comp = eventPriority(event2);
    return event1Comp - event2Comp;
  });
  for (var event of eventList) {
      let row = eventTableBody.insertRow();
      row
      for (let key in eventTableHeadings) {
        let cell = row.insertCell(key);
        let text = document.createTextNode(" ");
        if (key == 0){
          text = document.createTextNode(event[eventTableHeadings[key]]);
        } else if (event.marking[eventTableHeadings[key]] == true) {
            text = document.createElement('img');
            text.src = "img/" + eventTableHeadings[key] + ".png";
        }
        cell.appendChild(text);
      }
      let cell = row.insertCell(-1);
      let executeButton = document.createElement("button");
      executeButton.innerHTML = "Execute";
      executeButton.setAttribute("data-dcr-event", event.name);
      executeButton.addEventListener ("click", function() {
        let d = new Date();
        let executedEvent = g1.getEvent(this.dataset.dcrEvent);
        if (executedEvent == false) {
          return;
        }
        executedEvent.execute();
        let log = "[" + d.toLocaleTimeString() + "] Executed Event : Name - " + executedEvent.name +", Label - "+ executedEvent.label;
        addLogs(log);
        buildTable();
      });

      if(!event.enabled()){
        executeButton.disabled = true;
      }
      cell.appendChild(executeButton);
  }
}

function addLogs(log) {
  actionLogs = actionLogs + log +"\n";
  let logTableBody = document.getElementById('logTable').getElementsByTagName('tbody')[0];
  let row = logTableBody.insertRow(0);
  let cell = row.insertCell(-1);
  let text = document.createTextNode(log);
  cell.appendChild(text);
}


var a = document.getElementById('save');
a.onclick=function(){
    var a = document.getElementById("save");
    var file = new Blob([actionLogs], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = "actionLogs.txt";
}
