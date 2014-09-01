angular.module('GeoTrouvetou.detail', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('detail', {
      url: '/detail/:id',
      views: {
        'main': {
          controller: 'DetailCtrl',
          templateUrl: 'detail/detail.tpl.html'
        }
      },
      data: { pageTitle: 'D\xe9tail' }
    });
  }
]).controller('DetailCtrl', [
  '$scope',
  '$stateParams',
  'leafletData',
  'leafletBoundsHelpers',
  'geoTrouvetou',
  function DetailCtrl($scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou) {
    'use strict';
    $scope.head_subtext = '';
    $scope.havePlan = false;
    $scope.voie = {};
    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
      [
        51.508742458803326,
        -0.087890625
      ],
      [
        51.508742458803326,
        -0.087890625
      ]
    ]);
    angular.extend($scope, {
      bounds: $scope.bounds,
      center: {},
      defaults: {
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        zoomControlPosition: 'topright'
      }
    });
    var scale = function (lat, zoom) {
      var dpi = 300;
      return Math.ceil(Math.abs(156543.034 * dpi * 39.37 * Math.cos(lat)) / Math.pow(2, zoom + 1));
    };
    geoTrouvetou.getFull({ 'id': $stateParams.id }, function (doc, status) {
      if (status == 200) {
        $scope.voie = doc;
        $scope.voie.beautifullName = geoTrouvetou.beautifull(doc);
        $scope.head_subtext = 'de ' + $scope.voie.beautifullName;
        $scope.voie.commune.beautifullName = geoTrouvetou.beautifull(doc.commune);
        $scope.voie.commune.dept.beautifullName = geoTrouvetou.beautifull(doc.commune.dept);
        $scope.cadastre = geoTrouvetou.getCadastre($scope.voie);
        $scope.found = true;
        $scope.osmLink = 'http://www.openstreetmap.org/search?query=' + $scope.voie.beautifullName + ',' + $scope.voie.commune.beautifullName + ',' + $scope.voie.commune.dept.beautifullName + ',FR';
        geoTrouvetou.getOpenStreetMap(doc, function (osm) {
          if (osm.length !== 0) {
            $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
              [
                parseFloat(osm.boundingbox[1]),
                parseFloat(osm.boundingbox[3])
              ],
              [
                parseFloat(osm.boundingbox[0]),
                parseFloat(osm.boundingbox[2])
              ]
            ]);
            $scope.havePlan = true;
          }
        });
      }
    });
  }
]);
;