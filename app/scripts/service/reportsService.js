angular.module('moneyJinnApp').service('ReportsService', function ($http) {
    var service = this;

    service.getReportList = function(year, month) {

        var url = 'http://laladev.org/moneyflow/server/report/listReports/{year}/{month}';

        url = url.replace('{year}', year);
        url = url.replace('{month}', month);


        return $http.get(url)
            .success(function () {

            });

    };
});