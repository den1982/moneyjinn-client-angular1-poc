angular.module('moneyJinnApp')
    .service('AuthInterceptor', function ($rootScope, $injector, md5) {
        var service = this;

        service.request = function (config) {

            var UserService = $injector.get('UserService');
            var user = UserService.getCurrentUser();

            var dateNow = new Date().toGMTString();

            var url_without_domain = config.url.replace(/^.*\/\/[^\/]+/, '');
            var contentType = config.headers['Content-Type'];
            if (user) {
                var authCode = service.getRESTAuthorization(user.password, config.method, contentType, url_without_domain, dateNow, config.data, user.username);
                config.headers['Authentication'] = authCode;
                config.headers['Requestdate'] = dateNow;
            }
            return config;
        };

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        };

        service.getRESTAuthorization = function (secret, httpVerb, contentType, url, date, body, ident) {

            httpVerb = service.convertToStringObject(httpVerb);
            contentType = service.convertToStringObject(contentType);
            url = service.convertToStringObject(url);
            body = service.convertToStringObject(body);
            ident = service.convertToStringObject(ident);

            if (body.length > 0) {
                var body_md5 = md5.createHash(body);
            } else {
                body_md5 = "";
            }
            stringToSign = httpVerb + "\n" + body_md5 + "\n" + contentType + "\n" + date + "\n\n" + url;

            var secret_bits = sjcl.codec.utf8String.toBits(secret);
            var hmac_bits = (new sjcl.misc.hmac(secret_bits, sjcl.hash.sha1)).mac(stringToSign);
            var hmac = sjcl.codec.hex.fromBits(hmac_bits)

            var base64bits = sjcl.codec.utf8String.toBits(hmac);
            var base64 = sjcl.codec.base64.fromBits(base64bits);
            return "MNF" + ident + ":" + base64;
        };

        service.convertToStringObject = function (string) {

            if (typeof string === 'string' || string instanceof String) {
                return string;
            }
            else {
                return new String();
            }
        }

    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])
