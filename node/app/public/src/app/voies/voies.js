/*global angular */
angular.module('GeoTrouvetou.voies', [
    'ui.router',
    'placeholders',
    'ui.bootstrap',
    'GeoTrouvetouServices'
])

    .config(function config($stateProvider) {
        "use strict";
        $stateProvider.state('voies', {
            url: '/voies/:insee',
            views: {
                "main": {
                    controller: 'voiesCtrl',
                    templateUrl: 'voies/voies.tpl.html'
                }
            },
            data: {pageTitle: 'Liste des voies'}
        });
    })
    .controller('voiesCtrl', function voiesCtrl($scope,$stateParams, $http, geoTrouvetou) {
        "use strict";
        $scope.head_subtext = '';
        $scope.commune = {'insee':$stateParams.insee};
        if ($stateParams.insee) {
            geoTrouvetou.getCommune($scope.commune,function (data,status) {
                if (status == 200) {
                    $scope.commune = data._source;
                    $scope.head_subtext = 'de ' + geoTrouvetou.beautifull(data._source);
                }
            });
        }
        $scope.items = [];
        var counter = 0;
        var wait = true;

        $scope.loadMore = function() {
            if (wait) {
                wait = false;
                geoTrouvetou.getVoies($scope.commune, function(data,status){
                    console.log(data);
                    if (counter < data.hits.total) {
                        for (var i = 0; i < data.hits.hits.length; i += 1) {
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
