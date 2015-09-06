angular.module('moneyJinnApp').service('ReportsService', function ($http, store) {
    var service = this;

    service.getReports = function() {

        return $http.get('http://laladev.org/moneyflow/server/report/listReports/2015/8')
            .success(function (response) {

            });

    }


})