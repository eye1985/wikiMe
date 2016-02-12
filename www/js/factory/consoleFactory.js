wikiHereApp.factory('Console', function () {
    var steps = [];
    var callbackFn = undefined;

    return {
        addListener:function(fn){
            callbackFn=fn;
        },
        addStep : function(step){
            steps.push(step);
            if(_.isFunction(callbackFn)){
                callbackFn()
            }
        },

        clearConsole : function(){
            steps = [];
        },

        getSteps : function(){
            return steps;
        }
    };
});