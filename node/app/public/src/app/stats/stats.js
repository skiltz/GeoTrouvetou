angular.module('GeoTrouvetou.stats', ['ui.router']).config([
  '$stateProvider',
  function config($stateProvider) {
    'use strict';
    $stateProvider.state('stats', {
      url: '/stats',
      views: {
        'main': {
          controller: 'statsCtrl',
          templateUrl: 'stats/stats.tpl.html'
        }
      },
      data: { pageTitle: 'Statistiques' }
    });
  }
]).controller('statsCtrl', [
  '$scope',
  function statsController($scope) {
    'use strict';
  }
]);
;