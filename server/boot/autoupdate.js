'use strict';

module.exports = function(app) {
	var path = require('path');

	var models = require(path.resolve(__dirname, '../model-config.json'));
	var datasources = require(path.resolve(__dirname, '../datasources.json'));

	function autoUpdateAll() {
		return new Promise(function(resolve, reject){
			var modelList = Object.keys(models);
			var datasourceList = Object.keys(datasources);
			var indexOfUser = modelList.indexOf('User');
			modelList.splice(indexOfUser,1);
			var promiseFunctions = [];

			datasourceList.forEach( function(i) {
				datasources[i].models = [];
			});

			modelList.forEach( function(model) {
				// datasources[models[model].dataSource].models.push(model);
				var ds = models[model].dataSource;
				if(ds != undefined)

				if (typeof ds != 'undefined') 
					if (typeof datasources[ds] != 'undefined') 
						datasources[ds].models.push(model);
			});

			datasourceList.forEach( function(i) {
				promiseFunctions.push(fncDatasourceUpdate(i, datasources[i].models));
			});

			Promise.all(
				promiseFunctions
				).then(function(){
				console.log("Migration success!!");
				resolve(true);
			}).catch(function(err){
				reject(err);
			});
		});
	};

	function autoMigrateAll() {
		return new Promise(function(resolve, reject){
			var modelList = Object.keys(models);
			var datasourceList = Object.keys(datasources);
			var indexOfUser = modelList.indexOf('User');
			modelList.splice(indexOfUser,1);
			var promiseFunctions = [];

			datasourceList.forEach( function(i) {
				datasources[i].models = [];
			});

			modelList.forEach( function(model) {
				// datasources[models[model].dataSource].models.push(model);
				var ds = models[model].dataSource;
				if(ds != undefined)

				if (typeof ds != 'undefined') 
					if (typeof datasources[ds] != 'undefined') 
						datasources[ds].models.push(model);
			});

			datasourceList.forEach( function(i) {
				promiseFunctions.push(fncDatasourceMigrate(i, datasources[i].models));
			});

			Promise.all(
				promiseFunctions
				).then(function(){
				console.log("Migration success!!");
				resolve(true);
			}).catch(function(err){
				reject(err);
			});
		});
	};

	var fncDatasourceMigrate = function(ds, model){
		return new Promise(function(resolve, reject){
			app
				.dataSources[ds]
				.automigrate(model, function(err) {
					if (err)
						reject(err);
					console.log('Model ' + model + ' migrated.');
					resolve(true);
				});
		});
	};

	var fncDatasourceUpdate = function(ds, model){
		return new Promise(function(resolve, reject){
			app
				.dataSources[ds]
				.autoupdate(model, function(err) {
					if (err)
						reject(err);
					console.log('Model ' + model + ' Updated.');
					resolve(true);
				});
		});
	};

	// autoMigrateAll();

};