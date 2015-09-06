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

        reports.errorMessage = null;
        reports.moneyFlows = null;

        ReportsService.getReports().then(function (response) {
            if (response.data.listReportsResponse){
                reports.moneyFlows = response.data.listReportsResponse.moneyflowTransport;
            }
        });

        reports.getTotalFlow = function(){
            var total = 0;
            for(var i = 0; i < $scope.moneyFlows.length; i++){
                total += parseFloat($scope.moneyFlows[i].amount);
            }
            return total;
        }


    })