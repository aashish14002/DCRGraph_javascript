import parser_tests from './test_parser.js'
import engine_tests from './test_engine.js'
import assert from 'assert'

export default { 
    block (msg) {
        console.log("  " + msg);
    },
    test(bool, msg) {
        let fl = Array(50-msg.length).fill('.').join('')
        try{
            assert(bool);
            console.log("    " + msg + fl + "Success");
        }
        catch(err){
            console.log("    " + msg + fl + "Failure");
        }
    }
};

console.log("[Testing]");
console.log("Parser:");
parser_tests();
console.log("Engine:");
engine_tests();