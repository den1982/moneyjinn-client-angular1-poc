'use strict';
/**
 * @ngdoc function
 * @name moneyJinnApp.controller:LoginController
 * @description
 * # MainCtrl
 * Controller of the moneyJinnApp
 */
angular.module('moneyJinnApp')
    .controller('LoginController', function ($state, $rootScope, $scope, UserService) {

        var login = $scope;

        login.user = {
            username: "",
            password: ""
        };

        login.error = "";

        if(UserService.isUserCheckedIn()) {
            $rootScope.$broadcast('authorized');
            $state.go('page.home');
        }

        login.login = function () {

            UserService.login(login.user).then(function (response) {

                if (response.data.getUserSettingsForStartupResponse){
                    var userSettings =  JSON.stringify(response.data.getUserSettingsForStartupResponse);
                    UserService.setCurrentUserSettings(userSettings);
                    $rootScope.$broadcast('authorized');
                    $state.go('page.home');

                } else if (response.data.error) {
                    login.error = response.data.error.message;
                }
            });

            var storedUser = UserService.getCurrentUser();
        };
    })