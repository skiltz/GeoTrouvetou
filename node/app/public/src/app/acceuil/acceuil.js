angular.module('GeoTrouvetou.acceuil', ['ui.router']).config([
  '$stateProvider',
  function config($stateProvider) {
    'use strict';
    $stateProvider.state('acceuil', {
      url: '/acceuil',
      views: {
        'main': {
          controller: 'AcceuilCtrl',
          templateUrl: 'acceuil/acceuil.tpl.html'
        }
      },
      data: { pageTitle: 'Acceuil' }
    });
  }
]).controller('AcceuilCtrl', [
  '$scope',
  function AcceuilCtrl($scope) {
    'use strict';
  }
]);
;