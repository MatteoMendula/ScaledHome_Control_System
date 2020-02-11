const assert = require('chai').assert;
const state = require('../model/state');

var ShState = new state();

describe('ScaledHome state', function(){
    // a check on the json file is needed in order to acces its properties
    it('getLastStateAsJsonString should return a parsable JSON string into obj', function(){
        let result = ShState.getLastStateAsJsonString();
        assert.typeOf(JSON.parse(result), 'object');        
    });
    // this test is important too, because the result of this function will
    // be saved to file so it should be a string
    it('getStateAsString_with_header should return a String', function(){
        let result = ShState.getStateAsString_with_header();
        assert.typeOf(result, 'string');
    });
});