/*Config - start*/
	// Wait time until cards are updated. Must be in ms
	var updateTime = 20000;




var app = angular.module('searchResults', ['ngRoute']);


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

// Main controller that stores all variables used by the childcontrollers
app.controller('MainCtrl', function($scope){
	/*
	weather -> array with weather information(e.g. city, temperature, weather type)
	stock 	-> array with stock information(last update time, it's data)
	btc 	-> array with lastupdatetime and value
	conversion -> array with conversionrates(from API)
	 */
	var localStorageValues = [
		'weather',
		'stock',
		'btc',
		'conversion'
	];
	// Initializes localstorage-values for the different parts of card-up
	localStorageValues.forEach(function(currentValue, index, array){
		if(localStorage.getItem(currentValue) === null){
			localStorage.setItem(currentValue, "");
		}
	});



	// The search keyword that the user enters
	$scope.searchInput = "";


});

app.controller('WeatherCtrl', function($scope, $http){
	$scope.locationCity = "";
	$scope.temperature = "";
	$scope.codeWeather = "";
	$scope.condition = "";
	$scope.unit = "";

	// https://developer.yahoo.com/weather/documentation.html
	$scope.weatherCodes = [{
		// tornado
		0: "F",
		// tropical storm
		1 :"F",
		// hurricane
		2 :"F",
		// severe thunderstorms
		3 :"O",
		// thunderstorms
		4 :"P",
		// mixed rain and snow
		5 :"X",
		// mixed rain and sleet
		6 :"X",
		// mixed snow and sleet
		7 :"X",
		// freezing drizzle
		8 :"X",
		// drizzle
		9 :"Q",
		// freezing rain
		10 :"X",
		// showers
		11 :"R",
		// showers
		12 :"R",
		// snow flurries
		13 :"U",
		// light snow showers
		14 :"U",
		// blowing snow
		15 :"U",
		// snow
		16 :"W",
		// hail
		17 :"X",
		// sleet
		18 :"X",
		// dust
		19 :"J",
		// foggy
		20 :"M",
		// haze
		21 :"J",
		// smoky
		22 :"M",
		// blustery
		23 :"F",
		// windy
		24 :"F",
		// cold
		25 :"G",
		// cloudy
		26 :"Y",
		// mostly cloudy (night)
		27 :"I",
		// mostly cloudy (day)
		28 :"H",
		// partly cloudy (night)
		29 :"E",
		// partly cloudy (day)
		30 :"H",
		// clear (night)
		31 :"C",
		// sunny
		32 :"B",
		// fair (night)
		33 :"C",
		// fair (day)
		34 :"B",
		// mixed rain and hail
		35 :"X",
		// hot
		36 :"B",
		// isolated thunderstorms
		37 :"O",
		// scattered thunderstorms
		38 :"O",
		// scattered thunderstorms
		39 :"O",
		// scattered showers
		40: "R",
		// heavy snow
		41 :"W",
		// scattered snow showers
		42 :"U",
		// heavy snow
		43 :"W",
		// partly cloudy
		44 :"H",
		// thundershowers
		45 :"O",
		// snow showers
		46 :"W",
		// isolated thundershowers
		47 :"O",
		// not available
		3200: ")",

	}];


	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageWeather = {};
	if (localStorage.getItem("weather") === null) {
		state = false;
	}
	else {
		localStorageWeather = JSON.parse(localStorage.getItem("weather"));
	}


	// If there is a weather[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageWeather['lastUpdateTime'] && localStorageWeather['lastUpdateTime'] + updateTime > Date.now()){
		console.log("Reading weather data from localStorage");
		$scope.locationCity = localStorageWeather['locationCity'];
		$scope.temperature = localStorageWeather['temperature'];
		$scope.codeWeather = localStorageWeather['codeWeather'];
		$scope.condition = localStorageWeather['condition'];
		$scope.unit = localStorageWeather['unit'];
		return;
	}
	/*
	weather => locationCity
				temperature
				codeWeather
				condition
				unit
				lastUpdateTime
	*/





	// Here we get the position from the built in feature of the browser
	navigator.geolocation.getCurrentPosition(success, error);

	function success(response){
		var coordinates = response.coords.latitude + "," + response.coords.longitude;
		var woeidAPI = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent('SELECT*FROM geo.placefinder WHERE text="'+coordinates+'" AND gflags="R"') + "&format=json";

		console.log(woeidAPI);
		// Make a GET retuest with $http to the location API to get the woeid(it is required by the weather API)
		$http.get(woeidAPI)
			.then(function(response) {
				$scope.locationCity = response.data.query.results.Result.city;
				console.log(response);
				var weatherAPI = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid=" + response.data.query.results.Result.woeid + ' and u="c"' + "&format=json";

				// Make another GET request to get the weather data
				$http.get(weatherAPI)
					.then(function(response2) {
						var localStorageData = {
							"locationCity": response.data.query.results.Result.city,
							"temperature": response2.data.query.results.channel.item.condition.temp,
							"codeWeather": response2.data.query.results.channel.item.condition.code,
							"condition": response2.data.query.results.channel.item.condition.text,
							"unit": response2.data.query.results.channel.units.temperature,
							"lastUpdateTime": Date.now()
						};
						localStorage.setItem('weather', JSON.stringify(localStorageData));

						$scope.temperature = response2.data.query.results.channel.item.condition.temp;
						$scope.codeWeather = response2.data.query.results.channel.item.condition.code;
						$scope.condition = response2.data.query.results.channel.item.condition.text;
						$scope.unit =  response2.data.query.results.channel.units.temperature;

						console.log(response2);
					});
			});

		console.log("success");
		console.log(response);
		/*getWeatherData(response.coords)*/
	}

	function error(response){
		alert("error" + response);
	}


});


app.controller('StockCtrl', function($scope, $http){
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
	};

	$scope.stockValues = [{}];

	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageStock = {};
	if (localStorage.getItem("stock") === null) {
		state = false;
	}
	else {
		localStorageStock = JSON.parse(localStorage.getItem("stock"));
	}


	// If there is a weather[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageStock['lastUpdateTime'] && localStorageStock['lastUpdateTime'] + updateTime > Date.now()){
		console.log("Reading stock data from localStorage");
		$scope.stockValues = localStorageStock['stockValues'];

		return;
	}



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



	// Thanks to YQL console(http://developer.yahoo.com/yql/console/?q=select%20Symbol%2CChange%2COpen%20from%20yahoo.finance.quoteslist%20where%20symbol%20%3D%20%22GOOGL%22&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys)
	var financeAPI = "https://query.yahooapis.com/v1/public/yql?q=select%20Symbol%2CChange%2CLastTradePriceOnly%20from%20yahoo.finance.quoteslist%20where%20symbol%20in%20(%22"+ encodeURIComponent(stockCompanies.toString()) +"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

	// "https://query.yahooapis.com/v1/public/yql?q=select Symbol,Change,Open from yahoo.finance.quoteslist where symbol in (\""+ stockCompanies.toString() +"\")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	$http.get(financeAPI)
		.then(function(response) {
			var localStorageValues = {
				'stockValues': response.data.query.results.quote,
				'lastUpdateTime': Date.now()
			};
			localStorage.setItem('stock', JSON.stringify(localStorageValues));
			$scope.stockValues = response.data.query.results.quote;
			console.log($scope.stockValues);
		});



});
app.controller('NewsCtrl',  function($scope, $http){


	$scope.imageURL = "assets/images/news/news-sample-image.png";
	$scope.imageAlt = "";
	$scope.newsTitle = "";
	$scope.newsDescription = "";

	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageNews = {};
	if (localStorage.getItem("news") === null) {
		state = false;
	}
	else {
		localStorageNews = JSON.parse(localStorage.getItem("news"));
	}

	// If there is a weather[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageNews['lastUpdateTime'] && localStorageNews['lastUpdateTime'] + updateTime > Date.now()){
		console.log("Reading news data from localStorage");
		$scope.newsTitle = localStorageNews.newsTitle;
		$scope.newsDescription = localStorageNews.newsDescription;
		$scope.currencyValues = localStorageNews['currencyValues'];
		$scope.imageURL = localStorageNews['imageURL'];
		return;
	}


	var newsAPI = "http://www.svd.se/search.do?q=&timerange=1day&svd_section1_text=Nyheter&output=json&callback=JSON_CALLBACK";
	// Make a GET retuest with $http to the news API
	$http.jsonp(newsAPI)
		.then(function(response) {
			console.log(response);

			var responseData = response.data.SvDSearch.results.articles[0];
			// Choose the first article that has an image
			for (var i = 0; i <= response.data.SvDSearch.results.articles.length -1 ; i++) {
				if (typeof response.data.SvDSearch.results.articles[i].imageUrl != "undefined") {
					responseData = response.data.SvDSearch.results.articles[i];
					$scope.imageURL = responseData.imageUrl;
					break;
				};
			};


			
			var tempDescription = "";
			// Limits the description to 150 characters(only approx 150 W:s can fit in the description div). The first 3 characters are cut out because they are useless
			for (var i = 3; i < 150; i++) {
				tempDescription += responseData.description[i];
			};
			tempDescription += "...";

			$scope.newsDescription = tempDescription;
			$scope.imageAlt = $scope.newsTitle = responseData.title;
			
			

			var localStorageNews = {
				'imageURL': responseData.imageUrl,
				'imageAlt': responseData.title,
				'newsTitle': responseData.title,
				'newsDescription': tempDescription,
				'lastUpdateTime': Date.now()
			};
			localStorage.setItem('news', JSON.stringify(localStorageNews));

		});

});
app.controller('BitcoinConversionCtrl', function($scope, $http){
	$scope.currencyValues = '';
	$scope.fromAmount = 1;
	$scope.toAmount = '';


	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageBTC = {};
	if (localStorage.getItem("btc") === null) {
		state = false;
	}
	else {
		localStorageBTC = JSON.parse(localStorage.getItem("btc"));
	}

	// If there is a weather[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageBTC['lastUpdateTime'] && localStorageBTC['lastUpdateTime'] + updateTime > Date.now()){
		console.log("Reading BTC data from localStorage");
		$scope.currencyValues = localStorageBTC['currencyValues'];
		$scope.toAmount = $scope.currencyValues['USD']['15m'] * $scope.fromAmount;
		return;
	}




	var currencyAPI = 'https://blockchain.info/sv/ticker?cors=true';

	// Make a GET retuest with $http to the currency exchange API
	$http.get(currencyAPI)
		.then(function(response) {
			$scope.currencyValues = response.data;
			$scope.toAmount = $scope.currencyValues['USD']['15m'] * $scope.fromAmount;

			var localStorageBTCValues = {
				'currencyValues': response.data,
				'toAmount': $scope.toAmount,
				'lastUpdateTime': Date.now()
			};
			localStorage.setItem('btc', JSON.stringify(localStorageBTCValues));

		});



});

// This controller handles the currency conversion(uses the conversion rate)
app.controller('CurrencyConversionCtrl', function($scope, $http){
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

	$scope.fromAmount = "";
	$scope.toAmount = "";
	$scope.currentCurrency = 'from';
	// Stores all exchange rates
	$scope.currencyValues = "";


	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageConversion = {};
	if (localStorage.getItem("conversion") === null) {
		state = false;
	}
	else {
		localStorageConversion = JSON.parse(localStorage.getItem("conversion"));
	}


	// If there is a weather[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageConversion['lastUpdateTime'] && localStorageConversion['lastUpdateTime'] + updateTime > Date.now()){
		console.log("Reading currency data from localStorage");
		$scope.currencyValues = localStorageConversion['currencyValues'];
		return;
	}



	var exchangeURL = "http://api.fixer.io/latest?symbols=USD,GBP";

	// Make a GET retuest with $http to the currency exchange API
	$http.get(exchangeURL).then(function(response) {
		var localStorageCurrencyValues = {
			'currencyValues': response.data,
			'lastUpdateTime': Date.now()
		};
		localStorage.setItem('conversion', JSON.stringify(localStorageCurrencyValues));
		$scope.currencyValues = response.data;
	});
});
// Controller for handling the clicks on cards/in-card-currency
app.controller('ManageCardPageCtrl', function($scope){

});

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