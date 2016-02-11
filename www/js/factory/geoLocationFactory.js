wikiHereApp.factory('GeolocationFactory',['$cordovaGeolocation',function(cordovaGeolocation){
    return {
        getCurrentLocation : function(posOptions,fn){
            cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;

                    fn(lat,long);

                }, function (err) {
                    return err;
                });
        }
    };
}]);