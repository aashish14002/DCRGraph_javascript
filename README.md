# DCRGraph_javaScript
A browser compatible JavaScript version of the Java DCR Engine (can be found here: https://github.com/tslaats/OODCREngine).

Dynamic Condition Response graphs (DCR graphs) is a business process model tool, which focus oncapturing the business and compliance rules constraining the order of activities and events. Compared toa flow diagram the DCR Graphs only maps possible events and the rules constraining their order. Events can be executed which allows one to use DCR graphs for analyzing such models.(dcrgraphs.https://wiki.dcrgraphs.net/dcr/)

Open the index.html which can be found in the release directory (compiled version of the code) to run the engine. 

![alt text](https://github.com/aashish14002/DCRGraph_javascript/blob/master/DCR-Graph-Engine-UI.png?raw=true)


### My Contribution: 
Bulding UI and Front-end solution for the application.

Refer this tutorial for setting up the project first time:
https://www.codementor.io/@iykyvic/writing-your-nodejs-apps-using-es6-6dh0edw2o
The json-file also needs to be in the directory.

### Installation:

1. Install npm if not installed already.
2. Then, go to the project directory and install all the dependencies by 
```sh
$ cd DCRGraph_javaScript
$ npm install
```

### Build and Run the Engine
1. Build the js files 
```sh
$ npm run compile
```
2. Run the ./release/index.html on the browser

### Development
Make a change in the file, and instantaneously see the updates in the browser
```sh
$ npm run watch
```

### Testing
To run tests, simply input the following:
```sh
$ npm run test
```
