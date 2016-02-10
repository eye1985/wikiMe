wikiHereApp.factory('GoogleMapsApiFactory',['uiGmapGoogleMapApi',function(googleMapApi){
    return {
        getGoogleMaps : function(fn){
            googleMapApi.then(function(maps){
                fn(maps);
            });
        },

        filterResultsBy : function(results){
            var postalTown = _.filter(results[0].address_components,function(addrComponent){
                return addrComponent.types[0] === 'postal_town'
            });

            var addresse = _.filter(results[0].address_components,function(addrComponent){
                return _.some(addrComponent.types,function(type){
                    return type === 'route';
                });;
            });

            return {
                postalTown : function(){
                    return postalTown[0].long_name;
                },

                addresse:function(){
                    return addresse[0].long_name;
                }
            }
        }
    };
}]);