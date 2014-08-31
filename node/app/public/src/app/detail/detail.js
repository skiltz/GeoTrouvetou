/*global angular */
angular.module( 'GeoTrouvetou.detail', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'detail', {
    url: '/detail/:id',
    views: {
      "main": {
        controller: 'DetailCtrl',
        templateUrl: 'detail/detail.tpl.html'
      }
    },
    data:{ pageTitle: 'Détail' }
  });
})
.controller( 'DetailCtrl', function DetailCtrl( $scope,$http, $stateParams, $timeout, leafletData, leafletBoundsHelpers, geoTrouvetou ) {
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
  
  $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
        [ 51.508742458803326, -0.087890625 ],
        [ 51.508742458803326, -0.087890625 ]
    ]);
  angular.extend($scope, {
    bounds: $scope.bounds,
    center: {},
    defaults: {
      tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      maxZoom: 18,
      zoomControlPosition:"topright"
    }
  });
  var scale = function (lat,zoom){
    var dpi = 300; // printer :) or 600?
    return Math.ceil(Math.abs(156543.034 * dpi *39.37* Math.cos(lat)) / (Math.pow(2,zoom+1)));
  };


  geoTrouvetou.getVoie({'id':$stateParams.id},function (data,status) {
    if (status == 200) {
      $scope.found = true;

      $scope.voie = data._source;
      $scope.voie.beautifullName = geoTrouvetou.beautifull(data._source);
      $scope.head_subtext = 'de '+ $scope.voie.beautifullName;
      geoTrouvetou.getCommune(data._source,function (data,status) {
        if (status==200) {
          $scope.voie.commune = data._source;
          $scope.voie.commune.beautifullName = geoTrouvetou.beautifull(data._source);
          geoTrouvetou.getFull($scope.voie,function(doc){
            $scope.cadastre = geoTrouvetou.getCadastre($scope.voie);
            geoTrouvetou.getOpenStreetMap(doc,function(osm){
              console.log(osm);
              if(osm.length !== 0){
                $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
                  [ parseFloat(osm.boundingbox[1]), parseFloat(osm.boundingbox[3]) ],
                  [ parseFloat(osm.boundingbox[0]), parseFloat(osm.boundingbox[2]) ]
                  ]);
                $scope.havePlan = true;
              }
            });
            $scope.osmLink='http://www.openstreetmap.org/search?query='+geoTrouvetou.beautifull(doc) + ',' + geoTrouvetou.beautifull(doc.commune)+','+geoTrouvetou.beautifull(doc.commune.dept)+',FR';
          });
          
        }
      });
    }
  });
  
})

;