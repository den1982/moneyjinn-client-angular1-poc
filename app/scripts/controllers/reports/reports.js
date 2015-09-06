'use strict';
/**
 * @ngdoc function
 * @name moneyJinnApp.controller:ReportsController
 * @description
 * # MainCtrl
 * Controller of the moneyJinnApp
 */
angular.module('moneyJinnApp')
    .controller('ReportsController', function ($state, $rootScope, $scope, ReportsService) {

        var reports = $scope;

        reports.errorMessage = "hallo";
        reports.responseData = null;

        ReportsService.getReports().then(function (response) {
            if (response.data.listReportsResponse){
                reports.responseData = response.data.listReportsResponse;
            }
        });


    })