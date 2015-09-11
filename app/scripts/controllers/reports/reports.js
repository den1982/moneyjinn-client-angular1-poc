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

        reports.allYears = null;
        reports.allMonth = null;

        reports.errorMessage = null;
        reports.moneyFlows = null;
        reports.select = {
            year: null,
            month: null
        };

        var current_year = new Date().getFullYear();
        var current_month = new Date().getMonth() + 1; //january ==1


        ReportsService.getReportList("", "").then(function (response) {
            if (response.data.listReportsResponse != null && response.data.listReportsResponse.allYears != null) {
                reports.allYears = response.data.listReportsResponse.allYears;

                //pre select current year in select box if there are reports of current year
                for (var i = 0; i < reports.allYears.length; i++) {
                    if (current_year == reports.allYears[i]) {
                        reports.select.year = current_year;
                    }
                }
                reports.onYearSelect();
            }
        });

        reports.onYearSelect = function () {
            reports.moneyFlows = null;
            reports.select.month = null

            if (reports.select.year != null) {

                ReportsService.getReportList(reports.select.year, "").then(function (response) {

                        if (response.data.listReportsResponse != null && response.data.listReportsResponse.allMonth != null) {
                            reports.allMonth = response.data.listReportsResponse.allMonth;

                            //pre select current month in select box, if there is a report of this month and if selected year is current year
                            if (current_year == reports.select.year) {
                                for (var i = 0; i < reports.allMonth.length; i++) {
                                    if (current_month == reports.allMonth[i]) {
                                        reports.select.month = reports.allMonth[i];
                                    }
                                }
                                reports.updateReportsView();
                            } else {
                                reports.select.month = null;
                            }
                        }

                    }
                )

                reports.updateReportsView();
            }
        }

        reports.updateReportsView = function () {

            if (reports.select.year != null && reports.select.month != null) {
                ReportsService.getReportList(reports.select.year, reports.select.month).then(function (response) {

                    var flows_size = Object.keys(response.data.listReportsResponse.moneyflowTransport).length;
                    if (response.data.listReportsResponse && flows_size > 0) {
                        reports.moneyFlows = response.data.listReportsResponse.moneyflowTransport;
                    } else {
                        reports.moneyFlows = null;
                    }
                });

            }
        }

        reports.getTotalFlow = function () {
            var total = 0;
            if ($scope.moneyFlows != null) {
                for (var i = 0; i < $scope.moneyFlows.length; i++) {
                    total += parseFloat($scope.moneyFlows[i].amount);
                }
            }
            return total;
        }


    })
;