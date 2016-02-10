wikiHereApp.controller('MainController',
    function ($scope, $ionicLoading, uiGmapIsReady, Settings, WikipediaApiFactory, GeolocationFactory,GoogleMapsApiFactory) {
        /**
         * Disabled for now
         * **
        function showNearbyPlaces(maps, curLocation, title) {
            if (Settings.showNearbyPlaces) {
                uiGmapIsReady.promise()
                    .then(function (mapInstances) {

                        if ($scope.markers.length > 0 && $scope.circles.length > 0) {
                            $scope.markers[0].setMap(null);
                            $scope.circles[0].setMap(null);
                            $scope.markers = [];
                            $scope.circles = [];
                        }

                        var places = new maps.places.PlacesService(mapInstances[0].map);
                        var request = {
                            location: curLocation,
                            radius: '500'
                        };

                        var circle = new maps.Circle({
                            map: mapInstances[0].map,
                            radius: 500,    // 500 meters
                            fillColor: '#33ccff',
                            strokeWeight: 1
                        });

                        var marker = new google.maps.Marker({
                            position: curLocation,
                            map: mapInstances[0].map,
                            title: title
                        });

                        $scope.markers.push(marker);
                        $scope.circles.push(circle);

                        circle.bindTo('center', marker, 'position');

                        places.nearbySearch(request, function (res, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {

                                $scope.$apply(function () {
                                    for (var i = 0, l = res.length; i < l; i++) {
                                        $scope.data.searchResults.places.push(res[i]);
                                    }
                                });
                            }
                        });
                    });
            }
        }

        $scope.markers = [];
        $scope.circles = [];
        $scope.googleNearbyPlaces = {
            places: [],
            isVisible: false
        };

         **/

        var posOptions = {timeout: 5000, enableHighAccuracy: Settings.highAccuracy};

        $scope.Settings = Settings;
        $scope.data = {
            extracts:'',
            listSearch:[]
        };

        $scope.getInfo = function () {
            //$ionicLoading.show({
            //    template: 'Loading...'
            //});

            ionic.Platform.ready(function () {
                GoogleMapsApiFactory.getGoogleMaps(function(maps){
                    GeolocationFactory.getCurrentLocation(posOptions,function (lat, long) {
                        var geocoder = new maps.Geocoder();
                        var curLocation = new maps.LatLng(lat, long);

                        geocoder.geocode({'location': curLocation}, function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {

                                var resultsByGoogle = GoogleMapsApiFactory.filterResultsBy(results);
                                var queryString = resultsByGoogle.addresse() + ' ' + '('+ resultsByGoogle.postalTown() + ')';

                                WikipediaApiFactory.queryExtracts(queryString,Settings.wikiLocale,function(result){
                                    if(_.isUndefined(result)){
                                        var wikiQueryString = resultsByGoogle.addresse();
                                        WikipediaApiFactory.queryWiki(wikiQueryString,Settings.wikiLocale,function(result){
                                            $scope.data.listSearch = result;
                                            $scope.data.extracts = '';
                                        });
                                    }else{
                                        $scope.data.extracts = result;
                                    }
                                });

                            } else {
                                console.log('Geocoder failed due to: ' + status);
                            }
                        });
                    });
                });
            });
        };

        $scope.getWikiExtracts = function(query){
            WikipediaApiFactory.queryExtracts(query,Settings.wikiLocale,function(result){
                $scope.data.extracts = result;
                $scope.data.listSearch = [];
            });
        };
    });