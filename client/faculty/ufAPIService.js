angular.module('faculty').service('UFAPIService', ['$http', function ($http) {
    const baseURL = "https://one.ufl.edu/apix/soc/schedule/";
    const proxyURL = "http://cors-anywhere.herokuapp.com/";
    function encodeRequestToProxy(queryString) {
        let realUrl = baseURL + '?' + queryString;
        return `http://cors-anywhere.herokuapp.com/${realUrl}`;
    }

/**
   - semester
   - category (what's this)
   - course code
   - course title
   - instructor (does this need to be an exact match?)
*/
    function queryUFCourses(query) {
        let queryString = "";
        function modifyIfNotNull(field) {
            if (query.hasOwnProperty(field)) {
                if (queryString !== "") {
                    queryString = queryString + "&";
                }
                queryString = queryString + `${field}=${query[field]}`;
            }
        }
        modifyIfNotNull("dept");
        modifyIfNotNull("term");
        console.log("UF Courses Query: " + queryString);
        let url = encodeRequestToProxy(queryString);
        return $http.get(url, { headers: {
            'X-Requested-With': 'foobar'
        }}).then(function(response) {
            return response.data[0].COURSES;
        });
    }

    return function() {
        this.queryUFCourses = queryUFCourses;
        return this;
    };
}]);
