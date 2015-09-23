/*Config - start*/
	// Wait time until cards are updated. Must be in ms(default = 10min)
	var updateTime = 600000;
	// This has to bee larger because import.io takes longer time to respond
	var newsUpdateTime = 1800000;




var app = angular.module('searchResults', ['ngRoute']);


app.config(function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'app/partials/iGoogleCards.html',
			controller: 'ManageCardPageCtrl'
		}).
		when('/about', {
			templateUrl: 'app/partials/about.html',
			controller: 'ManageCardPageCtrl'
		}).
		when('/thanks', {
			templateUrl: 'app/partials/thanks.html',
			controller: 'ManageCardPageCtrl'
		}).
		otherwise('/');
});


app.controller('SearchCtrl', function($scope, $window){
	$scope.onFormSubmit = function(){
		// console.log(searchInput)
		$window.location.href = "https://duckduckgo.com/" + document.querySelector("input#searchTerm").value;
	};
});

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
		'conversion',
		'news',
	];
	// Initializes localstorage-values for the different parts of card-up
	localStorageValues.forEach(function(currentValue, index, array){
		if(localStorage.getItem(currentValue) === null){
			localStorage.setItem(currentValue, "");
		}
	});

});

app.controller('WeatherCtrl', function($scope, $http){
	// If this is set to false show the error message to allow GEOlocation API
	$scope.GeoApiAccess = true;

	$scope.GeoApiLoading = true;

	$scope.locationCity = "";
	$scope.temperature = "";
	$scope.codeWeather = "";
	$scope.condition = "";
	$scope.unit = "";
	$scope.lastUpdateTime = "";

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
	if (localStorage.getItem("weather") === "") {
		state = false;
	}
	else {
		localStorageWeather = JSON.parse(localStorage.getItem("weather"));
	}


	// If there is a weather[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageWeather['lastUpdateTime'] && localStorageWeather['lastUpdateTime'] + updateTime > Date.now()){
		$scope.GeoApiAccess = false;
		console.log("Reading weather data from localStorage");
		$scope.locationCity = localStorageWeather['locationCity'];
		$scope.temperature = localStorageWeather['temperature'];
		$scope.codeWeather = localStorageWeather['codeWeather'];
		$scope.condition = localStorageWeather['condition'];
		$scope.unit = localStorageWeather['unit'];
		$scope.lastUpdateTime = timeConverter(parseInt(localStorageWeather['lastUpdateTime']));
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
		$scope.GeoApiAccess = false;
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
						var date = timeConverter(parseInt(Date.now()));
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
						$scope.lastUpdateTime = date;


						console.log(response2);
					});
			});

		console.log("success");
		console.log(response);
		/*getWeatherData(response.coords)*/
	}

	function error(response){
		$scope.GeoApiLoading = false;
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
	if (localStorage.getItem("stock") === "") {
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
	$scope.newsLoading = true;

	$scope.imageURL = "assets/images/news/news-sample-image.png";
	$scope.imageAlt = "";
	$scope.newsTitle = "";
	$scope.newsTitleUrl = "";
	$scope.author = "";
	$scope.date = "";

	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageNews = {};
	if (localStorage.getItem("news") === "") {
		state = false;
	}
	else {
		localStorageNews = JSON.parse(localStorage.getItem("news"));
	}

	// If there is a news[lastupdatetime] value and if the cards should not be updated yet, get the data from localStorage
	if(state && localStorageNews['lastUpdateTime'] && localStorageNews['lastUpdateTime'] + newsUpdateTime > Date.now()){
		$scope.newsLoading = false;
		console.log("Reading news data from localStorage");
		console.log(localStorageNews);
		$scope.newsTitle = localStorageNews.newsTitle;
		$scope.currencyValues = localStorageNews['currencyValues'];
		$scope.imageURL = localStorageNews['imageURL'];
		$scope.date = localStorageNews['article_date'];
		$scope.author = localStorageNews['author'];
		$scope.date = localStorageNews['date'];
		$scope.newsTitleUrl = localStorageNews['newsTitleUrl'];
		return;
	}


	// var newsAPI = "http://www.svd.se/search.do?q=&timerange=1day&svd_section1_text=Nyheter&output=json&callback=JSON_CALLBACK";
	var newsAPI = "https://api.import.io/store/data/24c2c0b1-2f90-4b8f-8853-9928d79d168a/_query?input/webpage/url=http%3A%2F%2Fuk.businessinsider.com%2Ffinance&_user=b7d849d5-dbf3-4d04-8d41-a6433065a501&_apikey=b7d849d5dbf34d048d41a6433065a5014514909043ee2d0a173e949fbc9c70415da13456beb1af509f0c6f861e7611797af63e2e3b87299293d0631583aa85e86412259aad554f6ae132cc5623dc920d";
	// Make a GET retuest with $http to the news API
	$http.get(newsAPI)
		.then(function(response) {
			$scope.newsLoading = false;
			console.log(response);

			// var responseData = response.data.SvDSearch.results.articles[0];
			var responseData = response.data.results[0];
			$scope.imageURL = responseData.article_image;
			$scope.imageAlt = $scope.newsTitle = responseData.article_header;
			$scope.author = responseData.article_author;
			$scope.date = responseData.article_date;
			$scope.newsTitleUrl = responseData.article_header_link;


			var localStorageNews = {};
			for (var i = 0; i < response.data.results.length; i++) {
				var responseDataArray = response.data.results[i]
				localStorageNews[i] = {
					'imageURL': responseDataArray.article_image,
					'imageAlt': responseDataArray.article_header,
					'newsTitle': responseDataArray.article_header,
					'newsTitleUrl': responseDataArray.article_header_link,
					'author': responseDataArray.article_author,
					'date': responseDataArray.article_date,
					'lastUpdateTime': Date.now()
				}
			}
			// var localStorageNews = {
			// 	'imageURL': responseData.article_image,
			// 	'imageAlt': responseData.article_header,
			// 	'newsTitle': responseData.article_header,
			// 	'lastUpdateTime': Date.now()
			// };
			localStorage.setItem('news', JSON.stringify(localStorageNews));

		});

});

app.controller('BitcoinConversionCtrl', function($scope, $http){
	$scope.currencyValues = '';
	$scope.fromAmount = 1;
	$scope.toAmount = '';
	$scope.lastUpdateTime = "";


	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageBTC = {};
	if (localStorage.getItem("btc") === "") {
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
		$scope.lastUpdateTime = timeConverter(parseInt(localStorageBTC['lastUpdateTime']));
		return;
	}




	var currencyAPI = 'https://blockchain.info/sv/ticker?cors=true';

	// Make a GET retuest with $http to the currency exchange API
	$http.get(currencyAPI)
		.then(function(response) {
			$scope.currencyValues = response.data;
			$scope.toAmount = $scope.currencyValues['USD']['15m'] * $scope.fromAmount;
			$scope.lastUpdateTime = timeConverter(parseInt(Date.now()));
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
					$scope.fromAmount = Math.round(($scope.toAmount / $scope.currencyValues.rates.GBP * $scope.currencyValues.rates.USD)*100)/100;
					//$scope.toAmount * 0.5;
					break;
				case 'from':
					$scope.toAmount = Math.round(($scope.fromAmount / $scope.currencyValues.rates.USD * $scope.currencyValues.rates.GBP) * 100 )/100;
					break;
			}
		}
		return "";
	};

	$scope.test = function(){
		var test;
		console.log($scope.currencyValues.rates.USD * $scope.currencyValues.rates.GBP);
	};

	$scope.fromAmount = 1;
	$scope.toAmount;
	$scope.currentCurrency = 'from';
	// Stores all exchange rates
	$scope.currencyValues = "";


	// If the localstorage json can't be parsed, set state to false, which does not run the if statement below
	var state = true;
	var localStorageConversion = {};
	if (localStorage.getItem("conversion") === "") {
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

function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = month + ". " + date + ',' + year + ' ' + hour + ':' + min;
	return time;
}
