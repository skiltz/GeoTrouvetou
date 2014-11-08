angular.module('GeoTrouvetou.recherche', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'GeoTrouvetouServices',
  'ES'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('recherche', {
      url: '/recherche',
      views: {
        'main': {
          controller: 'RechercheCtrl',
          templateUrl: 'recherche/recherche.tpl.html'
        }
      },
      data: { pageTitle: 'Recherche' }
    });
  }
]).controller('RechercheCtrl', [
  '$scope',
  '$http',
  'geoTrouvetou',
  'es',
  function RechercheCtrl($scope, $http, geoTrouvetou, es) {
    $scope.list = [];
    $scope.resultat = false;
    $scope.wait = false;
    var wait = false;
    $scope.filters = {
      dateDel: 'oui',
      lieuxDits: true
    };
    $scope.optionsFilters = [
      'oui',
      'aucun',
      'uniquement'
    ];
    $scope.typeVoies = geoTrouvetou.typeVoies;
    $scope.counter = 0;
    $scope.changeCommune = function (c) {
      $scope.communes = [];
      $scope.commune = c;
    };
    $scope.getCommune = function () {
      geoTrouvetou.getCP({ 'codePostal': $scope.cp }, function (data, status) {
        $scope.communes = [];
        angular.forEach(data.hits.hits, function (doc) {
          $scope.communes.push(geoTrouvetou.beautifull(doc._source));
        });
      });
    };
    $scope.cherche = function () {
      $scope.wait = true;
      $scope.resultat = true;
      var cp = $scope.recherche.cp.$modelValue;
      var voie = $scope.recherche.voie.$modelValue;
      var commune = $scope.recherche.commune.$modelValue;
      var filters = {};
      var params = {};
      data = {
        'query': {
          'bool': {
            'must': [],
            'must_not': [],
            'should': []
          }
        },
        'sort': { '_score': { 'order': 'desc' } },
        'track_scores': 'true',
        'from': $scope.counter,
        'size': 20
      };
      if (commune) {
        data.query.bool.should.push({
          'has_parent': {
            'parent_type': 'commune',
            'score_mode': 'none',
            'query': {
              'fuzzy_like_this_field': {
                'commune.name': {
                  'like_text': commune,
                  'fuzziness': 2
                }
              }
            }
          }
        });
      }
      if (cp) {
        data.query.bool.should.push({
          'has_parent': {
            'parent_type': 'commune',
            'score_mode': 'none',
            'query': { 'term': { 'commune.codePostal': cp } }
          }
        });
      }
      if (voie) {
        data.query.bool.should.push({
          'fuzzy_like_this_field': {
            'voie.name': {
              'like_text': voie,
              'fuzziness': 2,
              'boost': 10
            }
          }
        });
      }
      es.search(data, function (data, status) {
        $scope.wait = false;
        $scope.scroll_id = data._scroll_id;
        if (status == 200) {
          angular.forEach(data.hits.hits, function (doc) {
            geoTrouvetou.getFull(doc._source, function (voie, status) {
              voie.beautifullName = geoTrouvetou.beautifull(voie);
              voie.score = doc._score;
              voie.commune.beautifullName = geoTrouvetou.beautifull(voie.commune);
              $scope.list.push(voie);
              $scope.counter += 1;
            });
          });
        }
      }, params, filters);
    };
  }
]);
;