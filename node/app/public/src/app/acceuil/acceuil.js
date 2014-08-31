/*global angular */
angular.module('GeoTrouvetou.acceuil', [
    'ui.router',
    'plusOne'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
    .config(function config($stateProvider) {
        "use strict";
        $stateProvider.state('acceuil', {
            url: '/acceuil',
            views: {
                "main": {
                    controller: 'AcceuilCtrl',
                    templateUrl: 'acceuil/acceuil.tpl.html'
                }
            },
            data: { pageTitle: 'Acceuil' }
        });
    })

    /**
     * And of course we define a controller for our route.
     */
    .controller('AcceuilCtrl', function AcceuilController($scope) {
        "use strict";
        console.log("I'm in AcceuilController!"); // To remove ;)
    });

