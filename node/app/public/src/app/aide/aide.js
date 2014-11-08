angular.module('GeoTrouvetou.aide', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(['$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('aide', {
      url: '/aide',
      views: {
        "main": {
          controller: 'AideCtrl',
          templateUrl: 'aide/aide.tpl.html'
        }
      },
      data: {
        pageTitle: 'Aide - Manuel'
      }
    });
  }
])

.controller('AideCtrl', ['$scope',
  function AideCtrl($scope) {

  }
])

;