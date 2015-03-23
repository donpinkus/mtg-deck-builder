myApp.directive('playerBoard', function(){
  return {
    scope: {
      player: "="
    },
    replace: true,
    templateUrl: "player-board.html"
  }
});

myApp.directive('playerInfo', function(){
  return {
    scope: false,
    replace: true,
    templateUrl: "player-info.html"
  }
});

myApp.directive('hand', function(){
  return {
    scope: false,
    replace: true,
    templateUrl: "hand.html"
  }
});

myApp.directive('handCard', function(){
  return {
    scope: false,
    replace: true,
    link: function(scope, elem, attrs){
      scope.play = function(){
        // Remove this card from hand.
        scope.player.hand = _.without(scope.player.hand, scope.card);

        // Add this card to battlefield,tapped.
        var battleFieldCard = scope.card;
        battleFieldCard.isTapped = false;

        scope.player.battlefield.push(battleFieldCard);
        scope.$apply();
      }

      elem.bind('click', function(e){
        scope.play();
      });
    },
    templateUrl: "hand-card.html"
  }
});

myApp.directive('battleFieldCard', function(){
  return {
    scope: {
      card: "="
    },
    replace: true,
    link: function(scope, elem, attrs) {
      scope.tap = function(){
        scope.card.isTapped = !scope.card.isTapped;
        scope.$apply();
      };

      // Tap & untap on click.
      elem.bind('click', function(e){
        scope.tap();
      });
    },
    templateUrl: "battle-field-card.html"
  }
})
