angular.module('GeoTrouvetou.detail_bano', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices',
  'ES_bano'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('detail_bano', {
      url: '/detail_bano/:id',
      views: {
        'main': {
          controller: 'detail_banoCtrl',
          templateUrl: 'detail_bano/detail_bano.tpl.html'
        }
      },
      data: { pageTitle: 'D\xe9tail' }
    });
  }
]).controller('detail_banoCtrl', [
  '$scope',
  '$stateParams',
  'leafletData',
  'leafletBoundsHelpers',
  'geoTrouvetou',
  'bano',
  function detail_banoCtrl($scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou, bano) {
    'use strict';
    $scope.head_subtext = '';
    $scope.havePlan = true;
    $scope.voie = {};
    var id = $stateParams.id;
    angular.extend($scope, {
      center: {
        lat: 46,
        lng: 2,
        zoom: 5
      },
      markers: {},
      defaults: {
        maxZoom: 19,
        zoomControlPosition: 'topright'
      }
    });
    bano.get(id, function (data, status) {
      if (status == 200) {
        $scope.found = true;
        $scope.id = data._id;
        $scope.voie = data._source;
        $scope.havePlan = true;
        $scope.center = {
          lat: parseFloat($scope.voie.geo.lat),
          lng: parseFloat($scope.voie.geo.lon),
          zoom: 17
        };
        $scope.markers.voie = {
          lat: parseFloat($scope.voie.geo.lat),
          lng: parseFloat($scope.voie.geo.lon),
          message: $scope.voie.num + ' ' + $scope.voie.voie,
          focus: true,
          draggable: false
        };
        $scope.osmLink = 'http://www.openstreetmap.org/search?query=' + $scope.voie.voie + ',' + $scope.voie.commune + ',FR';
        $scope.head_subtext = $scope.voie.num + ' ' + $scope.voie.voie + ', ' + $scope.voie.commune;
      }
    });
  }
]);
;