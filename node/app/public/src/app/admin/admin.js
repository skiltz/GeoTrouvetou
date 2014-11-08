/*global angular */
angular.module('GeoTrouvetou.admin', [
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
    $stateProvider.state('admin', {
      url: '/admin',
      views: {
        "main": {
          controller: 'adminCtrl',
          templateUrl: 'admin/admin.tpl.html'
        }
      },
      data: {
        pageTitle: 'Administration'
      }
    });
  }
])

/**
 * And of course we define a controller for our route.
 */
.controller('adminCtrl', ['$scope',
  function adminController($scope) {
    "use strict";
    //console.log("I'm in AcceuilController!"); // To remove ;)
  }
])

;