var Service, Characteristic;
var request = require('sync-request');
var async = require('async');
var FlowerPower = require('./flowerpower');

var temperature = 0;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-flowerpower", "FlowerPowerTemp", FlowerPowerTemp);
	
}

function FlowerPowerTemp(log, config) {
    this.log = log;
    this.name = config["name"];
	this.hasCalibratedData = false;
}

FlowerPowerTemp.prototype = {
	
	getAirTemperature: function (callback) {
		FlowerPower.discover(function(flowerPower) {
			function(callback) {
				console.log('readAirTemperature');
				flowerPower.readAirTemperature(function(error, temperature) {
					console.log('FlowerPower Air Temperature = ' + temperature.toFixed(2) + '°C');
					temperatureService.setCharacteristic(Characteristic.CurrentTemperature, temperature.toFixed(2));
					this.temperature = temperature.toFixed(2);
					callback();
				});
			}
		}
		callback(null, this.temperature)
	},

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "Parrot")
                .setCharacteristic(Characteristic.Model, "Flower Power ")
                .setCharacteristic(Characteristic.SerialNumber, "Serial Number");

        temperatureService = new Service.TemperatureSensor(this.name);
        temperatureService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getAirTemperature.bind(this));

        return [temperatureService];
    }
};