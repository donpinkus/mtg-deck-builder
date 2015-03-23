myApp.controller('decksShow', ['$scope', '$http', '$routeParams', '$location', 'localStorageService', 'DeckService', function($scope, $http, $routeParams, $location, localStorageService, DeckService){
	// Deck.get($routeParams.id).then(function(deck){
	// 	$scope.deck = deck;
	// });


  // Set Deck. If ID param is set, get the deck, if not create a blank deck.
  if ($routeParams["id"]) {
    $scope.deck = DeckService.show(parseInt($routeParams["id"], 10));
  } else {
    $scope.deck = { id: null, name: "Untitled Deck", cards: [] };
  }

	$scope.uniqueCountedDeckCards = [];
  updateUniqueCountedDeckCards();

	// Used in search
	$scope.cardName = "";
	$scope.foundCards = [];
	
	/* Search */
	var debounceSearch = _.debounce(function() {
			blockspring.runParsed("magic-the-gathering-card-api", { "card_name": $scope.cardName, "min_mana_cost": 0, "max_mana_cost": 15, "color": null, "primary_type": null, "sub_type": null, "min_power": 0, "max_power": 15, "min_toughness": 0, "max_toughness": 15, "rarity": null, "multiverse_id": null}, function(response){
		    console.log(response);
		    
		    $('.cardsLoading').addClass('hidden');
		    progressBarWidth = 0;
		    $('.cardsLoading .progress-bar').css('width', progressBarWidth + '%');
				$('.cardResults').removeClass('hidden');

		    $scope.foundCards = response.params.cards;
		    $scope.$apply();
		  });
		},
		300);

	$scope.$watch('cardName', function(){
		// Get all cards with this name
		if ($scope.cardName.length > 2) {
			var progressBarWidth = 0;
			$('.cardsLoading').removeClass('hidden');
			$('.cardsLoading .progress-bar').css('width', progressBarWidth + '%');
			$('.cardResults').addClass('hidden');
			setInterval(function(){
				progressBarWidth = progressBarWidth + 10;
				$('.cardsLoading .progress-bar').css('width', progressBarWidth + '%');
			}, 160);
			debounceSearch();
		}
	});

	$scope.addToDeck = function(card){
		try { 
			card.colors = JSON.parse(card.colors);
		} catch(e) { console.log('colors already parsed'); }

		$scope.deck.cards.push(card);

		$scope.deck.cards = _.sortBy($scope.deck.cards, 'converted_mana_cost');

    updateUniqueCountedDeckCards();
	}


	/* Deck cards */
	function updateUniqueCountedDeckCards() {
		// Get the unique cards
		var uniqueDeckCards = _.uniq($scope.deck.cards, false, function(card){
			return card.id;
		});

		// Get the card counts
		var cardCounts = _.countBy($scope.deck.cards, function(card){
			return card.id;
		});

		// Merge
		$scope.uniqueCountedDeckCards = _.map(uniqueDeckCards, function(card){
			card.count = cardCounts[card.id];
			return card;
		});
	}

	$scope.removeCardFromDeck = function(cardToRemove){
		// Find card in deck.
		for (i = 0; i < $scope.deck.cards.length; i++) {
			if ($scope.deck.cards[i].id == cardToRemove.id) {
				$scope.deck.cards.splice(i, 1);
				break;
			}
		}

		updateUniqueCountedDeckCards();
	}

	$scope.saveDeck = function(){
		DeckService.save($scope.deck);
    $location.path('/deck_editor');
	}
}]);




