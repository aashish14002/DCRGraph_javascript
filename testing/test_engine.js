import DCRGraph from '../dist/DCRGraph';
import main from './main';

export default function engine_tests() {
    main.block("Original Engine Test Scenario 1");

    let g1 = new DCRGraph();
	let e1 = g1.addEvent("e1");
    let e2 = g1.addEvent("e2");
    let e3 = g1.addEvent("e3");		
    let e4 = g1.addEvent("e4");

    g1.addCondition("e1", "e2");
    g1.addCondition("e2", "e3");		
    g1.addResponse("e1", "e3");
    g1.addMilestone("e3", "e4");
    
    let step1 = e1.enabled() && !e2.enabled() && !e3.enabled() && e4.enabled() && g1.isAccepting();

    main.test(step1, "1st Before e1 execute");

    e1.execute();
    
    let step2 = e1.enabled() && e2.enabled() && !e3.enabled() && !e4.enabled() && !g1.isAccepting();

    main.test(step2, "2nd Before e2 execute");

    g1.execute("e2");
    
    let step3 = e1.enabled() && e2.enabled() && e3.enabled() && !e4.enabled() && !g1.isAccepting();

    main.test(step3, "3nd Before e3 execute");
    
    g1.execute("e3");		
    
    let step4 = e1.enabled() && e2.enabled() && e3.enabled() && e4.enabled() && g1.isAccepting();

    main.test(step4, "4th After e3 execute");
    
    let step5 = (e1.marking.isExecuted == true &&
                 e2.marking.isExecuted == true &&
                 e3.marking.isExecuted == true &&
                 e4.marking.isExecuted != true);

    main.test(step5, "5th e1, e2, e3 executed, not e4");	
    
    let step6 = (e1.marking.isPending != true &&
                 e2.marking.isPending != true &&
                 e3.marking.isPending != true &&
                 e4.marking.isPending != true);

    main.test(step6, "6th None are pending");

    main.block("Original Engine Test Scenario 2");

    let g2 = new DCRGraph();
    e1 = g2.addEvent("e1");
    e2 = g2.addEvent("e2");
    e3 = g2.addEvent("e3");
    
    e2.marking.isIncluded = false;
    e2.marking.isPending = true;

    g2.addInclude("e1", "e2");
    g2.addExclude("e2", "e2");
    g2.addCondition("e2", "e3");
    g2.addInclude("e3", "e1");
    g2.addExclude("e3", "e1");		
    
    step1 = e1.enabled() && !e2.enabled() && e3.enabled() && g2.isAccepting();

    main.test(step1, "1st Before e1 execute");
    
    e1.execute();
    
    step2 = e1.enabled() && e2.enabled() && !e3.enabled() && !g2.isAccepting();

    main.test(step2, "2nd Before e2 execute");
    
    g2.execute("e2");
    
    step3 = e1.enabled() && !e2.enabled() && e3.enabled() && g2.isAccepting();

    main.test(step3, "3nd Before e3 execute");
    
    g2.execute("e3");		
    
    step4 = e1.enabled() && !e2.enabled() && e3.enabled() && g2.isAccepting();

    main.test(step4, "4th After e3 execute");

    step5 = (e1.marking.isExecuted == true &&
             e2.marking.isExecuted == true &&
             e3.marking.isExecuted == true);

    main.test(step5, "5th All executed");

    step6 = (e1.marking.isPending != true &&
             e2.marking.isPending != true &&
             e3.marking.isPending != true);
    
    main.test(step6, "6th None pending");
    
    let step7 = (e1.marking.isIncluded == true &&
                 e2.marking.isIncluded != true &&
                 e3.marking.isIncluded == true);

    main.test(step7, "7th Only e1 e3 included");
}