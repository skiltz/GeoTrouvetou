/*global angular */
angular.module( 'GeoTrouvetou.edit', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices',
  'xeditable'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'edit', {
    url: '/edit/:id',
    views: {
      "main": {
        controller: 'EditCtrl',
        templateUrl: 'edit/edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Edition' }
  });
})
.controller( 'EditCtrl', function EditCtrl( $scope, $stateParams, leafletData, leafletBoundsHelpers, geoTrouvetou ) {
  "use strict";
  $scope.head_subtext = '';
  $scope.havePlan = false;
  $scope.voie = {};
  $scope.typeVoies = [
    "Abbaye " ,
    "Aérodrome " ,
    "Aérogare ",
    "Agglomération ",
    "Aire ",
    "Allée ",
    "Ancien chemin ",
    "Ancienne route ",
    "Angle ",
    "Arcade ",
    "Autoroute  ",
    "Avenue ",
    "Barrière ",
    "Bas chemin ",
    "Bastide ",
    "Bastion ",
    "Bassin ",
    "Berge ",
    "Bois ",
    "Boucle ",
    "Boulevard ",
    "Bourg ",
    "Bretelle ",
    "Butte ",
    "Cale ",
    "Camin ",
    "Camp ",
    "Camping ",
    "Canal ",
    "Carre ",
    "Carrefour ",
    "Carriera ",
    "Carrière ",
    "Caserne ",
    "Centre ",
    "Champ ",
    "Chasse ",
    "Château ",
    "Chaussée ",
    "Chemin ",
    "Cheminement ",
    "Chemin communal ",
    "Chemin départemental ",
    "Chemin rural ",
    "Chemin forestier ",
    "Chemin vicinal ",
    "Cité ",
    "Clos ",
    "Contour ",
    "Corniche ",
    "Coron ",
    "Couloir ",
    "Cours ",
    "Coursive ",
    "Côte ",
    "Croix ",
    "Darse ",
    "Descente ",
    "Déviation ",
    "Digue ",
    "Domaine ",
    "Draille ",
    "Écart ",
    "Écluse ",
    "Embranchement ",
    "Emplacement ",
    "Enclave ",
    "Enclos ",
    "Escalier ",
    "Espace ",
    "Esplanade ",
    "Étang ",
    "Faubourg ",
    "Ferme ",
    "Fond ",
    "Fontaine ",
    "Forêt ",
    "Fosse ",
    "Galerie ",
    "Grand boulevard ",
    "Grand place ",
    "Grande rue ",
    "Gréve ",
    "Habitation ",
    "Halage ",
    "Halle ",
    "Hameau ",
    "Hauteur ",
    "Hippodrome ",
    "Impasse ",
    "Jardin ",
    "Jetée ",
    "Levée ",
    "Ligne ",
    "Lotissement ",
    "Maison ",
    "Marché ",
    "Marina ",
    "Montée ",
    "Morne ",
    "Nouvelle route ",
    "Parc ",
    "Parking ",
    "Parvis ",
    "Passage ",
    "Passerelle ",
    "Petit chemin ",
    "Petite allée ",
    "Petite avenue ",
    "Petite route ",
    "Petite rue ",
    "Phare ",
    "Piste ",
    "Placa ",
    "Place ",
    "Placette ",
    "Placis ",
    "Plage ",
    "Plaine ",
    "Plateau ",
    "Pointe ",
    "Porche ",
    "Porte ",
    "Poste ",
    "Poterne ",
    "Promenade ",
    "Quai ",
    "Quartier ",
    "Raccourci ",
    "Rampe ",
    "Ravine ",
    "Rempart ",
    "Résidence ",
    "Rocade ",
    "Rond-point ",
    "Rotonde ",
    "Route ",
    "Route départementale ",
    "Route nationale ",
    "Rue ",
    "Ruelle ",
    "Ruellette ",
    "Ruette ",
    "Ruisseau ",
    "Sentier ",
    "Square ",
    "Stade ",
    "Terrain ",
    "Terrasse ",
    "Terre ",
    "Terre-plein ",
    "Tertre ",
    "Traboule ",
    "Traverse ",
    "Tunnel ",
    "Vallée ",
    "Venelle ",
    "Viaduc ",
    "Vieille route ",
    "Vieux chemin ",
    "Villa ",
    "Village ",
    "Ville ",
    "Voie communale ",
    "Voirie ",
    "Voûte ",
    "Voyeul ",
    "Zone artisanale ",
    "Zone d'aménagement concertée ",
    "Zone industrielle "
  ] ;

  $scope.update = function(update){
    console.log(update);
    geoTrouvetou.update($scope.voie,update,function(isOK){
      $scope.updated = isOk;
    });
  };  
  $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray([
        [ 51.508742458803326, -0.087890625 ],
        [ 51.508742458803326, -0.087890625 ]
    ]);
  angular.extend($scope, {
    maxbounds: $scope.maxbounds,

                defaults: {
                  tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  maxZoom: 18,
                  zoomControlPosition:"topright"
                },
                center: {
                  lat: 1,
                  lon: 1,
                  zoom: 1
                }
              });

  geoTrouvetou.getVoie({'id':$stateParams.id},function (data,found) {
    $scope.found = found;
    if (found) {
      $scope.voie = data._source;
      $scope.voie.beautifullName = geoTrouvetou.beautifull(data._source);
      $scope.voie.fullClean = $scope.voie.fullClean || $scope.voie.beautifullName;
      $scope.head_subtext = 'de '+ $scope.voie.beautifullName;
      geoTrouvetou.getCommune(data._source,function (data,found) {
        if (found) {
          $scope.voie.commune = data._source;
          $scope.voie.commune.beautifullName = geoTrouvetou.beautifull(data._source);
          geoTrouvetou.getFull($scope.voie,function(doc){
            $scope.cadastre = geoTrouvetou.getCadastre($scope.voie);
            geoTrouvetou.getOpenStreetMap(doc,function(osm){
              console.log(osm);
              if(osm.length !== 0){
                $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray([
                  [ parseFloat(osm.boundingbox[1]), parseFloat(osm.boundingbox[3]) ],
                  [ parseFloat(osm.boundingbox[0]), parseFloat(osm.boundingbox[2]) ]
                  ]);
                $scope.havePlan = true;

              }
            });
          });
          
        }
      });
    }
  });
  
})
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
;