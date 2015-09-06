angular.module('moneyJinnApp').service('TranslationService', function($resource) {
    this.getTranslation = function($scope, language) {
        var languageFilePath = '/js/i18n/lang_' + language + '.json';
        $resource(languageFilePath).get(function (data) {
            $scope.translation = data;
        });
    };
});


