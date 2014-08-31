/*global angular */
angular.module( 'GeoTrouvetou.recherche', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'GeoTrouvetouServices',
  'ES'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'recherche', {
    url: '/recherche',
    views: {
      "main": {
        controller: 'RechercheCtrl',
        templateUrl: 'recherche/recherche.tpl.html'
      }
    },
    data:{ pageTitle: 'Recherche' }
  });
})

.controller( 'RechercheCtrl', function RechercheCtrl( $scope, $http , geoTrouvetou, es) {
  $scope.communes = [];
  $scope.list = [];
  $scope.resultat = false;
  $scope.wait = false;

  $scope.changeCommune = function(c) {
    console.log(c);
    $scope.communes = [];
    $scope.commune = c;
  };

  $scope.getCommune = function() {

    geoTrouvetou.getCP({'codePostal':$scope.cp},function (data,status) {
      $scope.communes = [];
      angular.forEach(data.hits.hits, function(doc) {
        $scope.communes.push(geoTrouvetou.beautifull(doc._source));
      });
    });
  };
  
  $scope.cherche = function () {
    $scope.list = [];
    $scope.wait = true;
    $scope.resultat = true;
    var cp = $scope.recherche.cp.$modelValue;
    var voie = $scope.recherche.voie.$modelValue;
    var commune = $scope.recherche.commune.$modelValue;
    params={};
    data = {
      "query": {
        "bool": {
          "must": [],
          "must_not": [],
          "should": []
        }
      }
    };
    if (commune) {
      data.query.bool.should.push({
        "has_parent": {
          "parent_type": "commune",
          "score_mode": "score",
          "query": {
            "fuzzy_like_this_field": {
              "commune.name": {
                "like_text": commune,
                "fuzziness": 2
              }
            }
          }
        }
      });
    }
    if (cp) {
      data.query.bool.should.push({
        "has_parent": {
          "parent_type": "commune",
          "score_mode": "score",
          "query": {
            "term": {
              "commune.codePostal": cp
            }
          }
        }
      });
    }
    if (voie) {
      data.query.bool.should.push({
        "fuzzy_like_this_field": {
          "voie.name": {
            "like_text": voie,
            "fuzziness": 2
          }
        }
      });
    }
    es.search(data,function(data,status){
      if (status == 200) {
        angular.forEach(data.hits.hits, function(doc) {
          geoTrouvetou.getFull(doc._source,function(voie,status){
            voie.beautifullName = geoTrouvetou.beautifull(voie);
            voie.commune.beautifullName = geoTrouvetou.beautifull(voie.commune);
            $scope.list.push(voie);
          });
        });
      }

    },params);
  };
})

;
