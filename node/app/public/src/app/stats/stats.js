/*global angular */
angular.module('GeoTrouvetou.stats', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(['$stateProvider',
  function config($stateProvider) {
    "use strict";
    $stateProvider.state('stats', {
      url: '/stats',
      views: {
        "main": {
          controller: 'statsCtrl',
          templateUrl: 'stats/stats.tpl.html'
        }
      },
      data: {
        pageTitle: 'Statistiques'
      }
    });
  }
])

/**
 * And of course we define a controller for our route.
 */
.controller('statsCtrl', ['$scope',
  function statsController($scope) {
    "use strict";
    //console.log("I'm in AcceuilController!"); // To remove ;)
  }
])

;