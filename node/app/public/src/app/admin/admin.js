angular.module('GeoTrouvetou.admin', ['ui.router']).config([
  '$stateProvider',
  function config($stateProvider) {
    'use strict';
    $stateProvider.state('admin', {
      url: '/admin',
      views: {
        'main': {
          controller: 'adminCtrl',
          templateUrl: 'admin/admin.tpl.html'
        }
      },
      data: { pageTitle: 'Administration' }
    });
  }
]).controller('adminCtrl', [
  '$scope',
  function adminController($scope) {
    'use strict';
  }
]);
;