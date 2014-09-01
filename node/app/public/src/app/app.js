angular.module('GeoTrouvetou', [
  'templates-app',
  'templates-common',
  'GeoTrouvetou.acceuil',
  'GeoTrouvetou.aide',
  'GeoTrouvetou.communes',
  'GeoTrouvetou.departements',
  'GeoTrouvetou.detail',
  'GeoTrouvetou.recherche',
  'GeoTrouvetou.voies',
  'GeoTrouvetou.edit',
  'GeoTrouvetou.recherche_bano',
  'GeoTrouvetou.detail_bano',
  'GeoTrouvetou.admin',
  'GeoTrouvetou.maj',
  'GeoTrouvetou.stats',
  'ui.router',
  'ui.bootstrap',
  'ngCookies',
  'ES'
]).config([
  '$urlRouterProvider',
  function myAppConfig($urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/acceuil');
  }
]).controller('SearchCtrl', [
  '$scope',
  'es',
  '$location',
  '$timeout',
  function ($scope, es, $location, $timeout) {
    'use strict';
    $scope.submit = function (e) {
      if (e.keyCode == 13) {
        $location.path('/voies/' + $scope.asyncSelected.payload.id);
      }
    };
    $scope.getLocation = function (text) {
      return es.suggest(text, 'commune').then(function (data, status) {
        var communes = [];
        angular.forEach(data.suggest[0].options, function (item) {
          communes.push(item);
        });
        return communes;
      });
    };
  }
]).controller('AppCtrl', [
  '$scope',
  '$location',
  '$cookieStore',
  'es',
  function AppCtrl($scope, $location, $cookieStore, es) {
    'use strict';
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = toState.data.pageTitle + ' | G\xe9oTrouvetou';
      }
    });
    es.isOk(function (status) {
      $scope.status = 'bg-' + status;
    });
    $scope.fav_dept = '01';
    if (window.localStorage) {
      $scope.fav_dept = window.localStorage.getItem('fav_dept') || '01';
    }
  }
]);
;