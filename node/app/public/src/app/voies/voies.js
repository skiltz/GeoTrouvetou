angular.module('GeoTrouvetou.voies', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'GeoTrouvetouServices'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    'use strict';
    $stateProvider.state('voies', {
      url: '/voies/:insee',
      views: {
        'main': {
          controller: 'voiesCtrl',
          templateUrl: 'voies/voies.tpl.html'
        }
      },
      data: { pageTitle: 'Liste des voies' }
    });
  }
]).controller('voiesCtrl', [
  '$scope',
  '$stateParams',
  '$http',
  'geoTrouvetou',
  function voiesCtrl($scope, $stateParams, $http, geoTrouvetou) {
    'use strict';
    var counter = 0, wait = true;
    $scope.head_subtext = '';
    $scope.items = [];
    $scope.commune = { 'insee': $stateParams.insee };
    if ($stateParams.insee) {
      geoTrouvetou.getCommune($scope.commune, function (data, status) {
        if (status == 200) {
          $scope.commune = data._source;
          $scope.head_subtext = 'de ' + geoTrouvetou.beautifull(data._source);
        }
      });
    }
    $scope.loadMore = function () {
      if (wait) {
        wait = false;
        geoTrouvetou.getVoies($scope.commune, function (data, status) {
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
          sort: $scope.sort || 'id'
        }, {}, $scope.filters);
      }
    };
    $scope.loadMore();
  }
]);
;