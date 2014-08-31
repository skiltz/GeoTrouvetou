/*global angular */
angular.module('GeoTrouvetou', [
    'templates-app',
    'templates-common',
    'GeoTrouvetou.acceuil',
    'GeoTrouvetou.aide',
    'GeoTrouvetou.communes',
    'GeoTrouvetou.departements',
    'GeoTrouvetou.detail',
    'GeoTrouvetou.recherche',
    'GeoTrouvetou.voies',
    'GeoTrouvetou.edit',
    'ui.router',
    'ngCookies',
    'ES'

])

    .config(function myAppConfig($urlRouterProvider) {
        "use strict";
        $urlRouterProvider.otherwise('/acceuil');
    })
    
    /*
    .run(function run () {
    })
    */
    .controller('SearchCtrl', ['$scope', 'es', '$location', '$timeout', function ($scope, es, $location, $timeout) {
        "use strict";
        $scope.submit = function(e) {
            if (e.keyCode == 13) {
                $location.path('/voies/'+$scope.asyncSelected.payload.id);
            }
        };
        $scope.getLocation = function(text) {
            var communes = [];
            return es.suggest(text,'commune',function(data,status){
                console.log(data); 
                angular.forEach(data.suggest[0].options, function(item){
                    communes.push(item);
                    return communes;
                });
            });
            /*
            return $http.get('http://localhost:8080/api/completion/commune/'+val, {
            }).then(function(res){
              var communes = [];
              
              angular.forEach(res.data.suggest[0].options, function(item){
                communes.push(item);
              });
              return communes;
            });
            */
        };
    }])
    .controller('AppCtrl', function AppCtrl($scope, $location,$cookieStore, es) {
        "use strict";
        //$scope.status = 'text-danger';
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | GéoTrouvetou';
            }
        });
        es.isOk(function(status){
            $scope.status = "bg-" + status;
        });
        
        $scope.fav_dept = $cookieStore.get('fav_dept') || '01';
    })
    
    
    ;

