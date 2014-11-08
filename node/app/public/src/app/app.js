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
  'ES',
  'GeoTrouvetou.modals_update'
]).config([
  '$urlRouterProvider',
  function myAppConfig($urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/acceuil');
  }
]).config([
  '$tooltipProvider',
  function ($tooltipProvider) {
    $tooltipProvider.setTriggers({
      'mouseenter': 'mouseleave',
      'click': 'click',
      'focus': 'blur',
      'never': 'mouseleave',
      'show': 'hide'
    });
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
  '$modal',
  '$http',
  'es',
  '$timeout',
  '$q',
  '$interval',
  function AppCtrl($scope, $location, $modal, $http, es, $timeout, $q, $interval) {
    'use strict';
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = toState.data.pageTitle + ' | G\xe9oTrouvetou';
      }
    });
    $scope.nversion = {};
    function dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }
    var openModalUpdate = function (size) {
      var modalInstance = $modal.open({
          templateUrl: 'modals_update/modals_update.tpl.html',
          controller: 'modal_updateCtrl',
          resolve: {
            nversion: function () {
              return $scope.nversion;
            }
          }
        });
      modalInstance.result.then(function () {
      }, function () {
      });
    };
    $http.jsonp('https://bitbucket.org/api/1.0/repositories/skiltz/geotrouvetou/tags?callback=JSON_CALLBACK').success(function (data) {
      var versions = [];
      angular.forEach(data, function (v, k) {
        if (k.slice(-4) != '_jre') {
          v.version = k;
          versions.push(v);
        }
      });
      versions.sort(dynamicSort('timestamp')).reverse();
      $scope.nversion.version = versions[0].version;
      $scope.nversion.url = 'https://bitbucket.org/skiltz/geotrouvetou/get/' + $scope.nversion.version + '.zip';
      $scope.nversion.version_jre = $scope.nversion.version + ' avec Java int\xe9gr\xe9';
      $scope.nversion.url_jre = 'https://bitbucket.org/skiltz/geotrouvetou/get/' + $scope.nversion.version + '_jre.zip';
      if ($scope.nversion.version == $scope.version) {
        console.log('version a jour :)');
      } else {
        console.log('merci de faire une maj!\nVersion install\xe9e : ' + $scope.version + '\nVersion en cours: ' + $scope.nversion.version);
        openModalUpdate();
      }
    });
    $scope.status = '';
    $scope.databasePopMessage = '';
    $scope.databaseIsOn = false;
    var databaseIsOK;
    databaseIsOK = function () {
      return es.isOk().then(function (status, message) {
        $scope.status = 'bg-' + status;
        $scope.databaseIsOn = true;
        $scope.databasePopMessage = message;
        $timeout(databaseIsOK, 3000);
      }, function (status, message) {
        $scope.databaseIsOn = false;
        $scope.databasePopMessage = message;
        $scope.status = 'bg-' + status;
        $timeout(databaseIsOK, 250);
      });
    };
    databaseIsOK();
    $scope.fav_dept = '01';
    if (window.localStorage) {
      $scope.fav_dept = window.localStorage.getItem('fav_dept') || '01';
    }
  }
]);
;