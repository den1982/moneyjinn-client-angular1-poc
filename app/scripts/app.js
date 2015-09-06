'use strict';
/**
 * @ngdoc overview
 * @name moneyJinnApp
 * @description
 * # moneyJinnApp
 *
 * Main module of the application.
 */
angular
    .module('moneyJinnApp', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'angular-storage',
        'angular-md5'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {




        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
        });

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('page', {
                url: '/page',
                controller: 'MainCtrl',
                templateUrl: '../views/pages/main.html',
                resolve: {
                    loadMyDirectives: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'moneyJinnApp',
                                files: [
                                    'scripts/directives/header/header.js',
                                    'scripts/directives/header/header-notification/header-notification.js',
                                    'scripts/directives/sidebar/sidebar.js',
                                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                                    'scripts/controllers/main.js'
                                ]
                            })
                            ,
                            $ocLazyLoad.load(
                                {
                                    name: 'ngResource',
                                    files: ['bower_components/angular-resource/angular-resource.js']
                                }),
                            $ocLazyLoad.load(
                                {
                                    name: 'angular-storage',
                                    files: ['bower_components/a0-angular-storage/dist/angular-storage.min.js']
                                })
                    }
                }
            })
            .state('page.home', {
                url: '/home',
                templateUrl: '../views/pages/home.html',

            })
            .state('login', {
                templateUrl: 'views/pages/login.html',
                url: '/login',
                resolve: {
                    loadMyFile: function ($ocLazyLoad) {

                        return $ocLazyLoad.load({
                            name: 'moneyJinnApp',
                            files: [
                                'scripts/controllers/login/login.js'
                            ]
                        })
                    }
                }
            })
            .state('page.addMoneyFlow', {
                templateUrl: 'views/pages/addMoneyFlow.html',
                url: '/addMoneyFlow'
            })
            .state('page.reports', {
                templateUrl: 'views/pages/reports.html',
                url: '/reports',
                resolve: {
                    loadMyFile: function ($ocLazyLoad) {

                        return $ocLazyLoad.load({
                            name: 'moneyJinnApp',
                            files: [
                                'scripts/service/reportsService.js',
                                'scripts/controllers/reports/reports.js'
                            ]
                        })
                    }
                }
            })

    }])
