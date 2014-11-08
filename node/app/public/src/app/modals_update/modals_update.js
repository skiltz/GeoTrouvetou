angular.module('GeoTrouvetou.modals_update', ['ui.bootstrap']).controller('modal_updateCtrl', [
  '$scope',
  '$modalInstance',
  'nversion',
  function modal_updateCtrl($scope, $modalInstance, nversion) {
    $scope.nversion = nversion;
    console.log(nversion);
    $scope.ok = function () {
      $modalInstance.close('ok');
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);