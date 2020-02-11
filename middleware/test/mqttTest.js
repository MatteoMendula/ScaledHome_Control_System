const assert = require('chai').assert;

var mqttSettings = require('../mqtt/mqttSettings');

describe('Mqtt', function(){
    describe('Mqtt settings', function(){
        it('Connection port should be equal to 11110', function(){
            var result = mqttSettings.port;
            assert.equal(result, 11110);        
        });
    });
});