wikiHereApp.controller('ConsoleController', ['$scope','Console',function ($scope,Console) {
    Console.addListener(function(){
        $scope.logs = Console.getSteps();
    });
}]);
