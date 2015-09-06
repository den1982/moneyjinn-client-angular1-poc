'use strict';
/**
 * @ngdoc function
 * @name moneyJinnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moneyJinnApp
 */
angular.module('moneyJinnApp')
    .controller('MainCtrl', function ($rootScope, $scope,$state, $position, UserService, TranslationService) {
        var service = $scope;

        //service.lang = TranslationService.getTranslation($scope, 'de');


        if(!UserService.isUserCheckedIn()) {
            $rootScope.$broadcast('unauthorized');
        }
        else {
            service.main = {
                currentUser: UserService.getCurrentUser(),
                currentUserSettings: UserService.getCurrentUserSettings()
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
