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