angular.module('GeoTrouvetou.edit', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices',
  'xeditable'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('edit', {
      url: '/edit/:id',
      views: {
        'main': {
          controller: 'EditCtrl',
          templateUrl: 'edit/edit.tpl.html'
        }
      },
      data: { pageTitle: 'Edition' }
    });
  }
]).controller('EditCtrl', [
  '$scope',
  '$stateParams',
  'leafletData',
  'leafletBoundsHelpers',
  'geoTrouvetou',
  function EditCtrl($scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou) {
    'use strict';
    $scope.head_subtext = '';
    $scope.havePlan = false;
    $scope.voie = {};
    $scope.typeVoies = geoTrouvetou.typeVoies;
    $scope.update = function (update) {
      switch ($scope.type) {
      case 'voie':
        geoTrouvetou.update($scope.voie, update).then(function () {
          console.log('OK');
          $scope.updated = true;
        });
        break;
      case 'commune':
        geoTrouvetou.update($scope.commune, update, {
          'type': 'commune',
          'parent': $scope.commune.departement,
          'routing': $scope.commune.departement,
          refresh: true
        }).then(function () {
          console.log('OK');
          $scope.updated = true;
        });
      }
    };
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
    if ($stateParams.id.length == 5) {
      $scope.type = 'commune';
    } else {
      $scope.type = 'voie';
    }
    switch ($scope.type) {
    case 'voie':
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
      break;
    case 'commune':
      geoTrouvetou.getFull({ 'insee': $stateParams.id }, function (doc, status) {
        if (status == 200) {
          $scope.commune = doc;
          $scope.commune.codePostal = doc.codePostal || '';
          $scope.commune.beautifullName = geoTrouvetou.beautifull(doc);
          $scope.head_subtext = 'de ' + $scope.commune.beautifullName + '(' + $scope.commune.departement + ')';
          $scope.commune.dept.beautifullName = geoTrouvetou.beautifull(doc.dept);
          $scope.found = true;
          $scope.osmLink = 'http://www.openstreetmap.org/search?query=' + $scope.commune.beautifullName + ',' + $scope.commune.dept.beautifullName + ',FR';
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
      }, { type: 'commune' });
      break;
    }
  }
]).run([
  'editableOptions',
  function (editableOptions) {
    editableOptions.theme = 'bs3';
  }
]);
;