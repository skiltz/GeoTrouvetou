angular.module('GeoTrouvetou.communes', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'GeoTrouvetouServices'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    'use strict';
    $stateProvider.state('communes', {
      url: '/communes/:departement',
      views: {
        'main': {
          controller: 'communesCtrl',
          templateUrl: 'communes/communes.tpl.html'
        }
      },
      data: { pageTitle: 'Liste des communes' }
    });
  }
]).controller('communesCtrl', [
  '$scope',
  '$stateParams',
  'geoTrouvetou',
  function communesCtrl($scope, $stateParams, geoTrouvetou) {
    'use strict';
    var counter, i, wait;
    $scope.head_subtext = '';
    $scope.departement = { departement: $stateParams.departement };
    if ($stateParams.departement) {
      geoTrouvetou.getDepartement($scope.departement, function (data, status) {
        if (status == 200) {
          $scope.departement = data._source;
          $scope.head_subtext = 'de ' + data._source.name;
        }
      });
    }
    $scope.items = [];
    counter = 0;
    wait = true;
    $scope.loadMore = function () {
      if (wait) {
        wait = false;
        geoTrouvetou.getCommunes($scope.departement, function (data, status) {
          $scope.scroll_id = data._scroll_id;
          if (counter < data.hits.total) {
            angular.forEach(data.hits.hits, function (data) {
              var doc = data._source;
              doc.beautifullName = geoTrouvetou.beautifull(doc);
              $scope.items.push(doc);
              counter += 1;
            });
            wait = true;
          }
        }, {
          size: 20,
          from: counter,
          sort: 'insee'
        });
      }
    };
    $scope.loadMore();
  }
]);
;