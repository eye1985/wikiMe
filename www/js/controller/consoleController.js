wikiHereApp.controller('ConsoleController', ['$scope','Console',function ($scope,Console) {
    $scope.logs = Console.getSteps();
}]);
