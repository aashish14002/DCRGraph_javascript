import Parser from '../dist/dcrparser'
import DCRGraph from '../dist/DCRGraph';
import main from './main';

const fs = require('fs');

export default function parser_tests() {
    let e1 = null;
    let e2 = null;
    let e3 = null;
    let e4 = null;

    let e1_mk = null;
    let e2_mk = null;
    let e3_mk = null;
    let e4_mk = null;

    let e1_as = null;
    let e2_as = null;
    let e3_as = null;
    let e4_as = null;

    main.block("Simple File:");
    let data1 = fs.readFileSync('./testing/test_parser/test_parser_1.dcr', 'ascii');
    
    let g1 = new DCRGraph(data1);
    
    e1 = g1.getEvent('Event1');
    e1_mk = (e1.marking.isExecuted, e1.marking.isIncluded, e1.marking.isPending);
    
    main.test(e1 != false, "Event1 exists");
    main.test(e1_mk == (false, true, false), "Event1 marking correct");
    main.test(e1.label == 'Event1', "Event1 default label");
    
    main.block("Testing Different Event Syntax, and markings");
    let data2 = fs.readFileSync('./testing/test_parser/test_parser_2.dcr', 'ascii');
    
    let g2 = new DCRGraph(data2);
    
    e1 = g2.getEvent('Event1');
    e2 = g2.getEvent('Event2');
    e3 = g2.getEvent('Event3');
    e4 = g2.getEvent('Event4');
    
    e1_mk = (e1.marking.isExecuted, e1.marking.isIncluded, e1.marking.isPending);
    e2_mk = (e2.marking.isExecuted, e2.marking.isIncluded, e2.marking.isPending);
    e3_mk = (e3.marking.isExecuted, e3.marking.isIncluded, e3.marking.isPending);
    e4_mk = (e4.marking.isExecuted, e4.marking.isIncluded, e4.marking.isPending);

    e1_as = (e1 != false) && (e1_mk == (false, true, false)) && (e1.label == 'Event1');
    e2_as = (e2 != false) && (e2_mk == (true, false, false)) && (e2.label == 'label');
    e3_as = (e3 != false) && (e3_mk == (false, true, false)) && (e3.label == 'Event3');
    e4_as = (e4 != false) && (e4_mk == (false, false, true)) && (e4.label == 'label');
    main.test(e1_as, "Event1 exists, Marking Correct, Default label");
    main.test(e2_as, "Event2 exists, Marking Correct, Custom label");
    main.test(e3_as, "Event3 exists, Marking Correct, Default label");
    main.test(e4_as, "Event4 exists, Marking Correct, Custom label");

    main.block("Testing Relations being added correctly");
    let data3 = fs.readFileSync('./testing/test_parser/test_parser_3.dcr', 'ascii');
    
    let g3 = new DCRGraph(data3);
    
    e1 = g3.getEvent('e1');
    e2 = g3.getEvent('e2');
    e3 = g3.getEvent('e3');
    e4 = g3.getEvent('e4');

    let e1_r = (Object.keys(e1.conditions).length, 
                Object.keys(e1.milestones).length, 
                Object.keys(e1.responses).length, 
                Object.keys(e1.includes).length,
                Object.keys(e1.excludes).length);
    let e2_r = (Object.keys(e2.conditions).length, 
                Object.keys(e2.milestones).length, 
                Object.keys(e2.responses).length, 
                Object.keys(e2.includes).length,
                Object.keys(e2.excludes).length);
    let e3_r = (Object.keys(e3.conditions).length, 
                Object.keys(e3.milestones).length, 
                Object.keys(e3.responses).length, 
                Object.keys(e3.includes).length,
                Object.keys(e3.excludes).length);
    let e4_r = (Object.keys(e4.conditions).length, 
                Object.keys(e4.milestones).length, 
                Object.keys(e4.responses).length, 
                Object.keys(e4.includes).length,
                Object.keys(e4.excludes).length);

    e1_as = (e1_r == (0,2,0,0,2)) && e1.conditions["e4"] != undefined && e1.milestones["e2"] != undefined && e1.milestones["e3"] != undefined && e1.excludes["e3"] != undefined && e1.excludes["e4"] != undefined;
    e2_as = (e2_r == (0,0,1,0,2)) && e2.responses["e3"] != undefined && e2.excludes["e3"] != undefined && e2.excludes["e4"] != undefined;
    e3_as = (e3_r == (0,0,2,1,0)) && e3.includes["e4"] != undefined && e3.responses["e1"] != undefined && e3.responses["e4"] != undefined;
    e4_as = (e4_r == (0,0,0,0,0));
    main.test(e1_as, "Event1 correct relations");
    main.test(e2_as, "Event2 correct relations");
    main.test(e3_as, "Event3 correct relations");
    main.test(e4_as, "Event4 correct relations");

    main.block("Testing naming and labeling symbols");
    let data4 = fs.readFileSync('./testing/test_parser/test_parser_4.dcr', 'ascii');
    
    let g4 = new DCRGraph(data4);
    
    e1 = g4.getEvent('Event_1 Example');
    e2 = g4.getEvent('1234567890');
    e3 = g4.getEvent('e___     _');
    e4 = g4.getEvent('e2');
    
    e1_as = (e1 != false);
    e2_as = (e2 != false);
    e3_as = (e3 != false);
    e4_as = (e4 != false) && (e4.label == "This is a valid - _label ");
    main.test(e1_as, "Event1 exists");
    main.test(e2_as, "Event2 exists");
    main.test(e3_as, "Event3 exists");
    main.test(e4_as, "Event4 exists, and label is correct");

    main.block("Testing Parser ignores space after name");
    let data5 = fs.readFileSync('./testing/test_parser/test_parser_5.dcr', 'ascii');

    let g5 = new DCRGraph(data5);

    main.test(g5.getEvent("Event1 ") == false, "\'Event1 \' does not exist");
    main.test(g5.getEvent("Event1") != false, "\'Event1\' does exist");

    let data6 = fs.readFileSync('./testing/test_parser/test_parser_error_1.dcr', 'ascii');
    main.block("Testing Parser discovers error correctly");
    try {
        let g6 = new DCRGraph(data6);

        main.test(false, "Invalid character in event name");
    }
    catch(err) {
        main.test(err.found == '-', "Invalid character in event name")
    }

    let data7 = fs.readFileSync('./testing/test_parser/test_parser_error_2.dcr', 'ascii');
    try {
        let g7 = new DCRGraph(data7);

        main.test(false, "Invalid character in event label");
    }
    catch(err) {
        main.test(err.found == '+', "Invalid character in event label")
    }

    let data8 = fs.readFileSync('./testing/test_parser/test_parser_error_3.dcr', 'ascii');
    try {
        let g8 = new DCRGraph(data8);

        main.test(false, "Parser detects no separator (,)");
    }
    catch(err) {
        main.test(err.found == 'E', "Parser detects no separator (,)")
    }

    let data9 = fs.readFileSync('./testing/test_parser/test_parser_error_4.dcr', 'ascii');
    try {
        let g9 = new DCRGraph(data8);

        main.test(false, "Parser detects two relations on same line");
    }
    catch(err) {
        main.test(err.found == 'E', "Parser detects two relations on same line")
    }
};