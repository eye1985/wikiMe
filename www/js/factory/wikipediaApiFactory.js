wikiHereApp.factory('WikipediaApiFactory',['$http',function(http){
    var wikipediaAPIs = {
        en: "https://en.wikipedia.org/w/api.php?action=query&format=json&callback=JSON_CALLBACK",
        no: "https://no.wikipedia.org/w/api.php?action=query&format=json&callback=JSON_CALLBACK"
    };

    return {
        queryWiki : function(query,locale,fn){
            var encodedQuery = encodeURI(query);
            var props = '&list=search&srsearch=';

            http.jsonp(wikipediaAPIs[locale] + props + encodedQuery).success(function (data, status, headers, config) {
                var resultTitles = _.map(data.query.search,function(obj){
                    return obj.title;
                });

                fn(resultTitles);
            }).error(function (data, status, headers, config) {

            });
        },

        queryExtracts : function(query,locale,fn){
            var encodedQuery = encodeURI(query);

            //Add explaintext for plain text
            //Add exintro for ??

            var props = '&prop=extracts&exintro=&titles=';

            http.jsonp(wikipediaAPIs[locale] + props + encodedQuery).success(function (data, status, headers, config) {
                fn(_.values(data.query.pages)[0].extract);
            }).error(function (data, status, headers, config) {
                return data;
            });
        }
    };
}]);