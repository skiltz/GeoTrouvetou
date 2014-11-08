/*global angular */
angular.module('GeoTrouvetou.detail_bano', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices',
  'ES_bano'
])

.config(['$stateProvider',
    function config($stateProvider) {
      $stateProvider.state('detail_bano', {
        url: '/detail_bano/:id',
        views: {
          "main": {
            controller: 'detail_banoCtrl',
            templateUrl: 'detail_bano/detail_bano.tpl.html'
          }
        },
        data: {
          pageTitle: 'Détail'
        }
      });
    }
  ])
  .controller('detail_banoCtrl', ['$scope', '$stateParams', 'leafletData', 'leafletBoundsHelpers', 'geoTrouvetou', 'bano',
    function detail_banoCtrl($scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou, bano) {
      "use strict";
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
          zoomControlPosition: "topright"
        },
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              type: 'xyz'
            },
            osmfr: {
              name: 'OSM France',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'

            },
            osmbw: {
              name: 'OSM N&B',
              type: 'xyz',
              url: 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
            },
            osmbws: {
              name: 'OSM N&B Stamen',
              type: 'xyz',
              url: 'http://a.tile.stamen.com/toner/{z}/{x}/{y}.png'
            },
            osmroads:{
              name: 'OSM Roads',
              type: 'xyz',
              url: 'http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}'
            }
          },
          overlays: {
            qa: {
              name: 'QA',
              type: 'xyz',
              visible: false,
              url: 'http://{s}.tile.openstreetmap.fr/qa/{z}/{x}/{y}.png',
              layerParams: {
                format: 'image/png',
                transparent: true
              }
            },
            bano: {
              name: 'BANO',
              type: 'xyz',
              visible: false,
              url: 'http://{s}.tile.openstreetmap.fr/bano/{z}/{x}/{y}.png',
              layerParams: {
                format: 'image/png',
                transparent: true
              }
            }
          }
        }
      });

      bano.get(id, function(data, status) {
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
            message: $scope.voie.num + " " + $scope.voie.voie,
            focus: true,
            draggable: false
          };
          $scope.osmLink = 'http://www.openstreetmap.org/search?query=' + $scope.voie.voie + ',' + $scope.voie.commune + ',FR';
          $scope.head_subtext = $scope.voie.num + " " + $scope.voie.voie + ", " + $scope.voie.commune;

        }
      });

    }
  ])

;