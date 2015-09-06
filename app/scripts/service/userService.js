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
            var sha1_byte = sjcl.hash.sha1.hash(user.password);
            var password_hash = sjcl.codec.hex.fromBits(sha1_byte);

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
                service.response = JSON.stringify(response);
            });

    }

})