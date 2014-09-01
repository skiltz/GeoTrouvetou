angular.module('GeoTrouvetou.recherche_bano', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'GeoTrouvetouServices',
  'ES_bano',
  'ES'
]).config([
  '$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('recherche_bano', {
      url: '/recherche_bano',
      views: {
        'main': {
          controller: 'recherche_banoCtrl',
          templateUrl: 'recherche_bano/recherche_bano.tpl.html'
        }
      },
      data: { pageTitle: 'recherche_bano' }
    });
  }
]).controller('recherche_banoCtrl', [
  '$scope',
  '$http',
  'geoTrouvetou',
  'es',
  'bano',
  function recherche_banoCtrl($scope, $http, geoTrouvetou, es, bano) {
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
      var num = $scope.recherche.num.$modelValue;
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
          'fuzzy_like_this_field': {
            'commune': {
              'like_text': commune,
              'fuzziness': 2
            }
          }
        });
      }
      if (cp) {
        data.query.bool.should.push({ 'term': { 'codePostal': cp } });
      }
      if (num) {
        data.query.bool.should.push({
          'term': {
            'num': {
              'value': num,
              'boost': 5
            }
          }
        });
      }
      if (voie) {
        data.query.bool.should.push({
          'fuzzy_like_this_field': {
            'voie': {
              'like_text': voie,
              'fuzziness': 2,
              'boost': 10
            }
          }
        });
      }
      bano.search(data, function (data, status) {
        $scope.wait = false;
        $scope.scroll_id = data._scroll_id;
        if (status == 200) {
          angular.forEach(data.hits.hits, function (doc) {
            doc._source.id = doc._id;
            doc._source.score = doc._score;
            doc._source.voie = doc._source.voie;
            doc._source.commune = doc._source.commune;
            $scope.list.push(doc._source);
            $scope.counter += 1;
          });
        }
      }, params, filters);
    };
  }
]);
;