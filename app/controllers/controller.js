var app = angular.module('searchResults', ['ngRoute'])


app.config(['$routeProvider',function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'app/partials/iGoogleCards.html',
			controller: 'ManageCardPageCtrl'
		})
		.when('/search', {
			templateUrl: 'app/partials/searchResults.html',
			controller: 'ListSearchResultsCtrl'
		});
	
	
}]);

app.controller('StockCtrl', function($scope, $http){
	// Is used in select query for API
	var stockCompanies = [
		"GE",
		"MSFT",
		"GOOGL",
		"AAPL",
		"MYL",
		"BAC",
		"VZ",
		"FB",
		"RF"
	];

	$scope.stockValues = [{}];

	// Thanks to YQL console(http://developer.yahoo.com/yql/console/?q=select%20Symbol%2CChange%2COpen%20from%20yahoo.finance.quoteslist%20where%20symbol%20%3D%20%22GOOGL%22&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys)
	var financeAPI = "https://query.yahooapis.com/v1/public/yql?q=select%20Symbol%2CChange%2COpen%20from%20yahoo.finance.quoteslist%20where%20symbol%20in%20(%22"+ encodeURIComponent(stockCompanies.toString()) +"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

	// "https://query.yahooapis.com/v1/public/yql?q=select Symbol,Change,Open from yahoo.finance.quoteslist where symbol in (\""+ stockCompanies.toString() +"\")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	$http.get(financeAPI)
		.then(function(response) {
			$scope.stockValues = response.data.query.results.quote;
			console.log($scope.stockValues);
		});

	$scope.stockChangeColor = function(value){
		value = parseFloat(value);
		if(value < 0){
			return "stock-negative";
		}
		else if(value === 0){
			return "stock-neutral";
		}
		else if(value > 0){
			return "stock-positive";
		}
	}
});
app.controller('BitcoinConversionCtrl', function($scope, $http){
	$scope.currencyValues = '';
	$scope.fromAmount = 1;
	$scope.toAmount = '';


	var currencyAPI = 'https://blockchain.info/sv/ticker?cors=true';

	// Make a GET retuest with $http to the currency exchange API
	$http.get(currencyAPI)
		.then(function(response) {
			$scope.currencyValues = response.data;
			$scope.toAmount = $scope.currencyValues['USD']['15m'] * $scope.fromAmount;
		});

	

});
// This controller handles the currency conversion(uses the conversion rate)
app.controller('CurrencyConversionCtrl', function($scope, $http){
	$scope.fromAmount;
	$scope.toAmount;
	$scope.currentCurrency = 'from';
	// Stores all exchange rates
	$scope.currencyValues = "";

	var exchangeURL = "http://api.fixer.io/latest?symbols=USD,GBP";

	// Make a GET retuest with $http to the currency exchange API
	$http.get(exchangeURL).then(function(response) {
		$scope.currencyValues = response.data;
	});



	/**
	 * Is called when the value of currency input is changed. This revalidates the inputs with the proper exchange rate
	 *
	 * @method calcCurrency
	 * @param {String} amount Is either 'to' or 'from'. It indicates at which input the user is(if on from input, amount will be 'from' and vice versa)
	 */
	$scope.calcCurrency = function(amount){
		// This function is called before the HTTP GET has time to finish loading the data. If it does, then an error is thrown
		if($scope.currencyValues !== ""){
			switch(amount){
				case 'to':
					$scope.fromAmount = $scope.toAmount / $scope.currencyValues.rates.GBP * $scope.currencyValues.rates.USD;
					//$scope.toAmount * 0.5;
					break;
				case 'from':
					$scope.toAmount = $scope.fromAmount / $scope.currencyValues.rates.USD * $scope.currencyValues.rates.GBP;
					break;
			}
		}
		return "";
	};

	$scope.test = function(){
		var test;
		console.log($scope.currencyValues.rates.USD * $scope.currencyValues.rates.GBP);
	};


});
// Controller for handling the clicks on cards/in-card-currency 
app.controller('ManageCardPageCtrl', ['', function($scope){
	
}]);

// Controller for listing search results
app.controller('ListSearchResultsCtrl', function($scope){
	$scope.results = [{
		'search-results': [
			{
				'name': 'Why is the sky blue? :: NASA\'s The Space Place',
				'url': 'spaceplane.nasa.gov/blue-sky',
				'description': 'Blue light is scattered in all directions by the tiny molecules of air in Earth\'s atmosphere. Blue is scattered more than other colors because it travels as shorter, smaller waves. This is why we see a blue sky most of the time.'
			},
			{
				'name': 'Why is the sky blue? :: NASA\'s The Space Place',
				'url': 'spaceplane.nasa.gov/blue-sky',
				'description': 'Blue light is scattered in all directions by the tiny molecules of air in Earth\'s atmosphere. Blue is scattered more than other colors because it travels as shorter, smaller waves. This is why we see a blue sky most of the time.'
			},
			{
				'name': 'Why is the sky blue? :: NASA\'s The Space Place',
				'url': 'spaceplane.nasa.gov/blue-sky',
				'description': 'Blue light is scattered in all directions by the tiny molecules of air in Earth\'s atmosphere. Blue is scattered more than other colors because it travels as shorter, smaller waves. This is why we see a blue sky most of the time.'
			},
			{
				'name': 'Why is the sky blue? :: NASA\'s The Space Place',
				'url': 'spaceplane.nasa.gov/blue-sky',
				'description': 'Blue light is scattered in all directions by the tiny molecules of air in Earth\'s atmosphere. Blue is scattered more than other colors because it travels as shorter, smaller waves. This is why we see a blue sky most of the time.'
			}

		],
		'search-results-images': [
			{
				'src': 'assets/images/search-results/image-results/result-1.png',
				'alt': 'Resultat 1'
			},
			{
				'src': 'assets/images/search-results/image-results/result-2.png',
				'alt': 'Resultat 2'
			},
			{
				'src': 'assets/images/search-results/image-results/result-3.png',
				'alt': 'Resultat 3'
			},
			{
				'src': 'assets/images/search-results/image-results/result-4.png',
				'alt': 'Resultat 4'
			}
		]
	}];
});