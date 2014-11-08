angular.module('GeoTrouvetou.map', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('map', {
      url: '/map/:id',
      views: {
        'main': {
          controller: 'MapCtrl',
          templateUrl: 'map/map.tpl.html'
        }
      },
      data: { pageTitle: 'D\xe9tail' }
    });
  }
]).controller('MapCtrl', [
  '$scope',
  '$stateParams',
  'leafletData',
  'leafletBoundsHelpers',
  'geoTrouvetou',
  function MapCtrl($scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou) {
    'use strict';
    $scope.head_subtext = '';
    $scope.havePlan = false;
    $scope.voie = {};
    $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray([
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
      maxbounds: $scope.maxbounds,
      defaults: {
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        zoomControlPosition: 'topright'
      },
      legend: {
        position: 'bottomleft',
        colors: [
          '#ff0000',
          '#28c9ff',
          '#0000ff',
          '#ecf386'
        ],
        labels: [
          'National Cycle Route',
          'Regional Cycle Route',
          'Local Cycle Network',
          'Cycleway'
        ]
      },
      center: {
        lat: 1,
        lon: 1,
        zoom: 1
      }
    });
    geoTrouvetou.getVoie({ 'id': $stateParams.id }, function (data, found) {
      $scope.found = found;
      if (found) {
        $scope.voie = data._source;
        $scope.voie.beautifullName = geoTrouvetou.beautifull(data._source);
        $scope.head_subtext = 'de ' + $scope.voie.beautifullName;
        geoTrouvetou.getCommune(data._source, function (data, found) {
          if (found) {
            $scope.voie.commune = data._source;
            $scope.voie.commune.beautifullName = geoTrouvetou.beautifull(data._source);
            geoTrouvetou.getFull($scope.voie, function (doc) {
              $scope.cadastre = geoTrouvetou.getCadastre($scope.voie);
              geoTrouvetou.getOpenStreetMap(doc, function (osm) {
                console.log(osm);
                if (osm.length !== 0) {
                  $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray([
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
            });
          }
        });
      }
    });
  }
]);
;