/*global angular */
angular.module('GeoTrouvetou.departements', [
    'ui.router',
    'placeholders',
    'ui.bootstrap',
    'GeoTrouvetouServices',
    'ngCookies'

])

    .config(function config($stateProvider) {
        "use strict";
        $stateProvider.state('departements', {
            url: '/departements',
            views: {
                "main": {
                    controller: 'DepartementsCtrl',
                    templateUrl: 'departements/departements.tpl.html'
                }
            },
            data: {pageTitle: 'Liste des départements'}
        });
    })
    .controller('DepartementsCtrl', function DepartementsCtrl($scope, $state, $http, $cookieStore, geoTrouvetou) {
        "use strict";
        var counter, i, wait;
        $scope.items = [];
        counter = 0;
        wait = true;
        $scope.click = function(dept) {
            $cookieStore.put("fav_dept",dept);
            $scope.$parent.fav_dept = dept;
            $state.go('communes',{departement:dept});
        };
        $scope.loadMore = function () {
            if (wait) {
                wait = false;
                geoTrouvetou.getDepartements(function(data,status){
                    if (counter < data.hits.total) {
                        for (i = 0; i < data.hits.hits.length; i += 1) {
                            var doc = data.hits.hits[i]._source;
                            doc.beautifullName = geoTrouvetou.beautifull(doc);
                            $scope.items.push(doc);
                            counter += 1;
                        }
                        wait = true;
                    }
                },{
                    size : 20,
                    from : counter
                });
            }
        };
        
        $scope.loadMore();
    })
;
