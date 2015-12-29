wikiHereApp.controller('MainController', function ($scope,$ionicLoading, $http, $cordovaGeolocation, uiGmapIsReady,uiGmapGoogleMapApi,Settings) {
    // Test
    function wikiQuerySearch(attrs) {
        var wikipediaAPIs = {
            en: "https://en.wikipedia.org/w/api.php?action=query&format=json&callback=JSON_CALLBACK",
            no: "https://no.wikipedia.org/w/api.php?action=query&format=json&callback=JSON_CALLBACK"
        };

        var encodedQuery = encodeURI(attrs.query);
        var props = (attrs.searchType === 'extract')?
            '&prop=extracts&exintro=&explaintext=&titles=':
            '&list=search&srsearch=';

        $http.jsonp(wikipediaAPIs[attrs.wikiLocale] + props + encodedQuery).success(function (data, status, headers, config) {
            var queryData = (data.query.search)?
                data.query.search:
                data.query.pages;

            if(Object.prototype.toString.call(queryData) === '[object Object]'){
                for(var page in queryData){
                    $scope.data.resultText.text = queryData[page].extract;
                }
                $scope.data.resultText.isVisible = true;
            }else if(Object.prototype.toString.call(queryData) === '[object Array]'){
                var loopLength = (queryData.length > 3)?3:queryData.length;
                if(loopLength > 0){
                    for(var i= 0;i<loopLength;i++){
                        $scope.data.searchResults.results.push(queryData[i]);
                    }
                    $scope.data.searchResults.isVisible = true;
                }else{
                    $scope.data.noResult = true;
                }
            }
        }).error(function (data, status, headers, config) {
            $scope.debug = data + ' ' + status +' '+ headers;
            $scope.error = true;
        });
    }

    function getCleanData(){
        return {
            resultText:{
                text:'',
                isVisible:false
            },
            searchResults:{
                results:[],
                places:[],
                isVisible:false
            },
            noResult:false
        };
    }

    function showNearbyPlaces(maps,curLocation){
        if(Settings.showNearbyPlaces){
            uiGmapIsReady.promise()
                .then(function(mapInstances){
                    var places = new maps.places.PlacesService(mapInstances[0].map);
                    var request = {
                        location: curLocation,
                        radius: '500'
                    };
                    places.nearbySearch(request,function(res,status){
                        if (status == google.maps.places.PlacesServiceStatus.OK) {

                            $scope.$apply(function(){
                                for(var i= 0,l=res.length;i<l;i++){
                                    $scope.data.searchResults.places.push(res[i]);
                                }
                            });
                        }
                    });
                });
        }
    }

    $scope.data = getCleanData();
    $scope.Settings = Settings;
    $scope.debug = '';
    $scope.googleNearbyPlaces={
        places:[],
        isVisible:false
    };

    $scope.getInfoFromResult = function(itemTitle){
        $scope.data = getCleanData();
        wikiQuerySearch({
            query:itemTitle,
            searchType:'extract',
            wikiLocale:'no'
        });
    };

    $scope.getInfo = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.debug = '';
        $scope.data = getCleanData();

        ionic.Platform.ready(function () {
            uiGmapGoogleMapApi.then(function (maps) {

                var posOptions = {timeout: 5000, enableHighAccuracy: true};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        var geocoder = new maps.Geocoder();
                        var curLocation = new maps.LatLng(lat, long);

                        $scope.map = {center: {latitude: lat, longitude: long }, zoom: 14 , control: {}};
                        $scope.marker = {
                            id: 0,
                            coords: {
                                latitude: lat,
                                longitude: long
                            }
                        };

                        showNearbyPlaces(maps,curLocation);

                        $scope.debug += 'lat: '+lat + '<br />';
                        $scope.debug += 'long: '+long + '<br />';

                        geocoder.geocode({'location': curLocation}, function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                for(var i= 0,l=results.length;i<l;i++){
                                    $scope.debug += i + ': ' + results[i].formatted_address + '<br />'
                                }

                                if (results[0]) {
                                    var addr = results[0].formatted_address.split(',');
                                    wikiQuerySearch({
                                        query:addr[0],
                                        searchType:'',
                                        wikiLocale:'no'
                                    });

                                    $scope.debug += 'Wiki search string: ' + addr[0] + '<br />';
                                } else {
                                    $scope.debug = 'No addr';
                                }

                            } else {
                                $scope.debug = 'Geocoder failed due to: ' + status;
                            }

                            $ionicLoading.hide();
                        });
                    }, function (err) {
                        // error
                        $scope.debug = err;
                    });
            });
        });
    };
});
