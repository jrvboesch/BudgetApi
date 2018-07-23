'use strict';

module.exports = function(Budget) {
	Budget.getBudgetInfo = function(id, next) {

		Budget.findOne({
			where: {
				"id": id
			},
			include: ["budgetHistories"]
		}, function(err, budget) {
			if (err) {
				next(err);
			} else {
				var balance = 0;
				var history = budget.budgetHistories();
				history.map(function(history){
					balance+= history.balance
				});

				var response = {
					budget: {
						id: budget.id,
						name: budget.name,
						description: budget.description,
						budget: budget.budget,
						balance: balance
					},
					history: budget.budgetHistories()
				};
				next(err, response);
			}
		});

	}

	Budget.remoteMethod('getBudgetInfo', {
		accepts: [{
			arg: 'id',
			type: 'number'
		}],
		http: {
			path: '/:id/info',
			verb: 'get'
		},
		returns: {
			type: 'Object',
			'root': true
		},
	});

	Budget.getBudgetReport = function(next) {

		Budget.find({
			include: ["budgetHistories"]
		}, function(err, budgets) {
			if (err) {
				next(err);
			} else {
				var response = budgets.map(function(budget){
					var income = 0;
					var outcome = 0;
					var history = budget.budgetHistories();
					history.map(function(history){
						if(history.balance >= 0)
							income += history.balance;
						else
							outcome += history.balance;
					});

					return {
							id: budget.id,
							name: budget.name,
							description: budget.description,
							budget: budget.budget,
							income: income,
							outcome: outcome
					};

				});
				next(err, response);
			}
		});

	}

	Budget.remoteMethod('getBudgetReport', {
		accepts: [],
		http: {
			path: '/report',
			verb: 'get'
		},
		returns: {
			type: 'Array',
			'root': true
		},
	});
};