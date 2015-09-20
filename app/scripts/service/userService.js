angular.module('moneyJinnApp').service('UserService', function ($http, store) {
    var service = this,
        currentUser = null,
        currentUserSettings = null;

    service.getCurrentUser = function () {
        if (!currentUser) {
            currentUser = store.get('user');
        }
        return currentUser;
    };

    service.setCurrentUser = function (user) {

        if (user == null) {
            currentUser = null;
        } else {

            var shaObj = new jsSHA("SHA-1", "TEXT");
            shaObj.update(user.password);
            var password_hash = shaObj.getHash("HEX");

            currentUser = {
                username: user.username,
                password: password_hash
            };

            store.set('user', currentUser);
        }
        return currentUser;
    };

    service.getCurrentUserSettings = function () {
        if (!currentUserSettings) {
            currentUserSettings = store.get('userSettings');
        }
        return currentUserSettings;
    };

    service.setCurrentUserSettings = function (settings) {
        currentUserSettings = settings;

        if (settings != null) {
            var dataBaseFormat = currentUserSettings.settingDateFormat;
            var jsDateFormat = '';

            if (dataBaseFormat) {
                jsDateFormat = dataBaseFormat.replace('YYYY', 'yyyy');
                jsDateFormat = jsDateFormat.replace('DD', 'dd');
            }
            if (jsDateFormat === '') {
                jsDateFormat = 'yyyy-mm-dd'
            }
            currentUserSettings.settingDateFormat = jsDateFormat;
        }
        store.set('userSettings', settings);
        return settings;
    };


    service.isUserCheckedIn =function () {
        var user = service.getCurrentUserSettings();
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    service.login = function (user) {

        service.setCurrentUser(user);

        return $http.get('http://laladev.org/moneyflow/server/user/getUserSettingsForStartup/' + user.username)
            .success(function (response) {
                return response;
            });

    }

})