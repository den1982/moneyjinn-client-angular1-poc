'use strict';
/**
 * @ngdoc function
 * @name moneyJinnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moneyJinnApp
 */
angular.module('moneyJinnApp')
    .controller('MainCtrl', function ($rootScope, $scope,$state, $position, UserService, $translate) {
        var service = $scope;


        if(!UserService.isUserCheckedIn()) {
            $rootScope.$broadcast('unauthorized');
        }
        else {
            service.main = {
                currentUser: UserService.getCurrentUser(),
                currentUserSettings: UserService.getCurrentUserSettings()
            }

            if (service.main.currentUserSettings.settingDisplayedLanguage != null) {
                $translate.use(service.main.currentUserSettings.settingDisplayedLanguage);
            } else {
                $translate.use('1');
            }
        }

        service.$on('authorized', function () {
            service.main.currentUser = UserService.getCurrentUser();
            service.main.currentUserSettings = UserService.getCurrentUserSettings();
        });

        service.$on('unauthorized', function () {
            service.main.currentUser = UserService.setCurrentUser(null);
            service.main.getCurrentUserSettings = UserService.setCurrentUserSettings(null);
            $state.go('login');
        });

        service.logout = function () {
            $rootScope.$broadcast('unauthorized');
        };


    });
