angular.module('GeoTrouvetou.departements', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'GeoTrouvetouServices',
  'ngCookies'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    'use strict';
    $stateProvider.state('departements', {
      url: '/departements',
      views: {
        'main': {
          controller: 'DepartementsCtrl',
          templateUrl: 'departements/departements.tpl.html'
        }
      },
      data: { pageTitle: 'Liste des d\xe9partements' }
    });
  }
]).controller('DepartementsCtrl', [
  '$scope',
  '$state',
  '$cookieStore',
  'geoTrouvetou',
  function DepartementsCtrl($scope, $state, $cookieStore, geoTrouvetou) {
    'use strict';
    var counter, i, wait;
    $scope.items = [];
    counter = 0;
    wait = true;
    $scope.click = function (dept) {
      if (window.localStorage) {
        window.localStorage.setItem('fav_dept', dept);
      }
      $scope.$parent.fav_dept = dept;
      $state.go('communes', { departement: dept });
    };
    $scope.loadMore = function () {
      if (wait) {
        wait = false;
        geoTrouvetou.getDepartements(function (data, status) {
          $scope.scroll_id = data._scroll_id;
          console.log(data);
          angular.forEach(data.hits.hits, function (data) {
            var doc = data._source;
            doc.beautifullName = geoTrouvetou.beautifull(doc);
            $scope.items.push(doc);
            counter += 1;
          });
          wait = true;
        }, {
          size: 20,
          from: counter,
          sort: 'departement'
        });
      }
    };
    $scope.loadMore();
  }
]);
;