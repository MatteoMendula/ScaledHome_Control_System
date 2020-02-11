const assert = require('chai').assert;
const utility = require('../utils/utility');

describe('Utility functions', function(){
    it('myStringLog should return a well formatted log string', function(){
        let result = utility.myStringLog('mockCaller', 'simple log', 1);
        assert.equal(result, `[LOG - mockCaller - ${new Date()}] type: Warining - message: simple log`);        
    });
});