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

        reports.exists = {
            monthleySettlement: false
        }

        reports.sum = {
            amountCurrent: 0
        }

        reports.errorMessage = null;
        reports.moneyFlows = null;
        reports.reportTurnoverCapitalsource = null;
        reports.reportList = null;

        reports.calculatedMonthTurnover = 0;

        reports.select = {
            year: null,
            month: null
        };

        reports.dept = {
            data: [],
            sum: {
                amountBeginOfMonthFixed: 0,
                amountEndOfMonthFixed: 0,
                amountCurrent: 0,
                amountDifference: 0,
                amountEndOfMonthCalculated: 0
            }
        }

        reports.equity = {
            data: [],
            sum: {
                amountBeginOfMonthFixed: 0,
                amountEndOfMonthFixed: 0,
                amountCurrent: 0,
                amountDifference: 0,
                amountEndOfMonthCalculated: 0
            }
        }


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

        reports.clearDataStructures = function () {
            reports.moneyFlows = null;
            reports.reportList = null;
            reports.calculatedMonthTurnover = 0;


            reports.dept = {
                data: [],
                sum: {
                    amountBeginOfMonthFixed: 0,
                    amountEndOfMonthFixed: 0,
                    amountCurrent: 0,
                    amountDifference: 0,
                    amountEndOfMonthCalculated: 0
                }
            }

            reports.equity = {
                data: [],
                sum: {
                    amountBeginOfMonthFixed: 0,
                    amountEndOfMonthFixed: 0,
                    amountCurrent: 0,
                    amountDifference: 0,
                    amountEndOfMonthCalculated: 0
                }
            }

            reports.exists.monthleySettlement = false;
        }


        reports.onYearSelect = function () {
            reports.clearDataStructures();
            reports.select.month = null
            reports.calculatedMonthTurnover = 0;


            if (reports.select.year != null) {

                ReportsService.getReportList(reports.select.year, "").then(function (response) {

                        if (response.data.listReportsResponse != null && response.data.listReportsResponse.allMonth != null) {
                            reports.allMonth = response.data.listReportsResponse.allMonth;

                            //pre select current month in select box, if there is a report of this month and if selected year is current year
                            if (current_year == reports.select.year) {
                                angular.forEach(reports.allMonth, function (month) {
                                    if (current_month == month) {
                                        reports.select.month = month;
                                    }
                                });
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
            reports.clearDataStructures();

            if (reports.select.year != null && reports.select.month != null) {
                ReportsService.getReportList(reports.select.year, reports.select.month).then(function (response) {

                    reports.reportList = response.data.listReportsResponse;
                    var flows_size = Object.keys(reports.reportList.moneyflowTransport).length;

                    if (reports.reportList && flows_size > 0) {
                        angular.forEach(reports.reportList.moneyflowTransport, function (item) {
                            item.amount = parseFloat(item.amount);
                        });
                        reports.moneyFlows = reports.reportList.moneyflowTransport;
                    } else {
                        reports.moneyFlows = null;
                    }

                    var flows_size = Object.keys(reports.reportList.reportTurnoverCapitalsourceTransport).length;
                    if (reports.reportList.reportTurnoverCapitalsourceTransport && flows_size > 0) {

                        var reportTurnoverCapitalsource = reports.reportList.reportTurnoverCapitalsourceTransport;
                        angular.forEach(reportTurnoverCapitalsource, function (reportTurnoverCapitalsourceItem) {
                            switch (reportTurnoverCapitalsourceItem.capitalsourceType) {

                                case 1:
                                case 2:
                                    reports.equity.data.push(reportTurnoverCapitalsourceItem);
                                    if (reportTurnoverCapitalsourceItem.amountCurrent) {
                                        reports.equity.sum.amountCurrent += parseFloat(reportTurnoverCapitalsourceItem.amountCurrent);
                                    }
                                    if (reportTurnoverCapitalsourceItem.amountEndOfMonthFixed) {
                                        reports.equity.sum.amountEndOfMonthFixed += parseFloat(reportTurnoverCapitalsourceItem.amountEndOfMonthFixed);
                                        reports.equity.sum.amountDifference += (reportTurnoverCapitalsourceItem.amountEndOfMonthFixed - reportTurnoverCapitalsourceItem.amountEndOfMonthCalculated);

                                        reports.exists.monthleySettlement = true;

                                    }
                                    reports.equity.sum.amountBeginOfMonthFixed += parseFloat(reportTurnoverCapitalsourceItem.amountBeginOfMonthFixed);
                                    reports.equity.sum.amountEndOfMonthCalculated += parseFloat(reportTurnoverCapitalsourceItem.amountEndOfMonthCalculated);

                                    reports.calculatedMonthTurnover += parseFloat(reportTurnoverCapitalsourceItem.amountEndOfMonthCalculated) - parseFloat(reportTurnoverCapitalsourceItem.amountBeginOfMonthFixed);

                                    break;
                                case 3:
                                case 4:
                                    reports.dept.data.push(reportTurnoverCapitalsourceItem);
                                    if (reportTurnoverCapitalsourceItem.amountCurrent) {
                                        reports.dept.sum.amountCurrent += parseFloat(reportTurnoverCapitalsourceItem.amountCurrent);
                                    }
                                    if (reportTurnoverCapitalsourceItem.amountEndOfMonthFixed) {
                                        reports.dept.sum.amountEndOfMonthFixed += parseFloat(reportTurnoverCapitalsourceItem.amountEndOfMonthFixed);
                                        reports.dept.sum.amountDifference += (reportTurnoverCapitalsourceItem.amountEndOfMonthFixed - reportTurnoverCapitalsourceItem.amountEndOfMonthCalculated);

                                        reports.exists.monthleySettlement = true;

                                    }
                                    reports.dept.sum.amountBeginOfMonthFixed += parseFloat(reportTurnoverCapitalsourceItem.amountBeginOfMonthFixed);
                                    reports.dept.sum.amountEndOfMonthCalculated += parseFloat(reportTurnoverCapitalsourceItem.amountEndOfMonthCalculated);
                                    break;

                            }
                        })

                    } else {
                        reports.reportTurnoverCapitalsource = null;
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
    }).filter('capitalSourceType', function () {
        return function (input) {

            var label = 'TEXT_'

            switch (input) {
                case 1:
                    return label + '173';
                    break;
                case 2:
                    return label + '174';
                    break;
                case 3:
                    return label + '278';
                    break;
                case 4:
                    return label + '279';
                    break;

            }
        }
    }).filter('capitalSourceState', function () {
        return function (input) {

            var label = 'TEXT_'

            switch (input) {
                case 1:
                    return label + '175';
                    break;
                case 2:
                    return label + '176';
                    break;
            }
        }
    }).directive('currencyRow', function () {
        return {
            scope: {
                value: '=',
                inverse: '='
            },
            restrict: 'A',
            replace: true,
            template: '<td ng-class=\'{"text-danger": value  < 0 || (inverse && value > 0) }\' style="text-align: right">{{value | number : 2 }} {{"CURRENCY" | translate}}</td>'
        };
    });