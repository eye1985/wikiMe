wikiHereApp.controller('ConsoleController', ['$scope','Console',function ($scope,Console) {
    $scope.clearConsole = function(){
        Console.clearConsole();
        $scope.logs = Console.getSteps();
    };

    ionic.Platform.ready(function () {
        Console.addListener(function(){
            $scope.logs = Console.getSteps();
        });
    });
}]);
