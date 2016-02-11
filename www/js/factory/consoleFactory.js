wikiHereApp.factory('Console', function () {
    var steps = [];

    return {
        addStep : function(step){
            steps.push(step);
        },

        clearConsole : function(){
            steps = [];
        },

        getSteps : function(){
            return steps;
        }
    };
});