/*global angular */
angular.module('GeoTrouvetou.map', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices'
])

.config(['$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('map', {
      url: '/map/:id',
      views: {
        "main": {
          controller: 'MapCtrl',
          templateUrl: 'map/map.tpl.html'
        }
      },
      data: {
        pageTitle: 'Détail'
      }
    });
  }
])
  .controller('MapCtrl', ['$scope', '$stateParams', 'leafletData', 'leafletBoundsHelpers', 'geoTrouvetou',
    function MapCtrl($scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou) {
      "use strict";
      $scope.head_subtext = '';
      $scope.havePlan = false;
      $scope.voie = {};
      /*
form(role="cadastre", method="POST", action="http://www.cadastre.gouv.fr/scpc/rechercherPlan.do")
    .form-group
      fieldset
        input(type="hidden", name='numeroVoie', value = '')
        input(type="hidden", name='nomVoie', value = docs.natureVoie == "Lieu dit" ? '' : docs.name)
        input(type="hidden", name='lieuDit', value = docs.natureVoie == "Lieu dit" ? docs.name : '')
        input(type="hidden", name='ville', value = objects.commune.name)
        input(type="hidden", name='codePostal', value = '')
        input(type="hidden", name='codeDepartement', value = '0'+docs.departement)
        input(type="hidden", name='nbResultatParPage', value = 10)
        input(type="hidden", name='x', value = '')
        input(type="hidden", name='y', value = '')
    button(type="submit").btn.btn-default Chercher sur le cadastre
  */


      $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray([
        [51.508742458803326, -0.087890625],
        [51.508742458803326, -0.087890625]
      ]);
      angular.extend($scope, {
        maxbounds: $scope.maxbounds,

        defaults: {
          tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          maxZoom: 19,
          zoomControlPosition: "topright"
        },
        legend: {
          position: 'bottomleft',
          colors: ['#ff0000', '#28c9ff', '#0000ff', '#ecf386'],
          labels: ['National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway']
        },
        center: {
          lat: 1,
          lon: 1,
          zoom: 1
        }
      });

      geoTrouvetou.getVoie({
        'id': $stateParams.id
      }, function (data, found) {
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
                      [parseFloat(osm.boundingbox[1]), parseFloat(osm.boundingbox[3])],
                      [parseFloat(osm.boundingbox[0]), parseFloat(osm.boundingbox[2])]
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
  ])

;