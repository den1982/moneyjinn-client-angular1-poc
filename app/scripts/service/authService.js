angular.module('moneyJinnApp')
    .service('AuthInterceptor', function ($rootScope, $injector, md5) {
        var service = this;
        var Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (e) {
                var t = "";
                var n, r, i, s, o, u, a;
                var f = 0;
                e = Base64._utf8_encode(e);
                while (f < e.length) {
                    n = e.charCodeAt(f++);
                    r = e.charCodeAt(f++);
                    i = e.charCodeAt(f++);
                    s = n >> 2;
                    o = (n & 3) << 4 | r >> 4;
                    u = (r & 15) << 2 | i >> 6;
                    a = i & 63;
                    if (isNaN(r)) {
                        u = a = 64
                    } else if (isNaN(i)) {
                        a = 64
                    }
                    t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                }
                return t
            },
            decode: function (e) {
                var t = "";
                var n, r, i;
                var s, o, u, a;
                var f = 0;
                e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (f < e.length) {
                    s = this._keyStr.indexOf(e.charAt(f++));
                    o = this._keyStr.indexOf(e.charAt(f++));
                    u = this._keyStr.indexOf(e.charAt(f++));
                    a = this._keyStr.indexOf(e.charAt(f++));
                    n = s << 2 | o >> 4;
                    r = (o & 15) << 4 | u >> 2;
                    i = (u & 3) << 6 | a;
                    t = t + String.fromCharCode(n);
                    if (u != 64) {
                        t = t + String.fromCharCode(r)
                    }
                    if (a != 64) {
                        t = t + String.fromCharCode(i)
                    }
                }
                t = Base64._utf8_decode(t);
                return t
            },
            _utf8_encode: function (e) {
                e = e.replace(/\r\n/g, "\n");
                var t = "";
                for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r)
                    } else if (r > 127 && r < 2048) {
                        t += String.fromCharCode(r >> 6 | 192);
                        t += String.fromCharCode(r & 63 | 128)
                    } else {
                        t += String.fromCharCode(r >> 12 | 224);
                        t += String.fromCharCode(r >> 6 & 63 | 128);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                }
                return t
            },
            _utf8_decode: function (e) {
                var t = "";
                var n = 0;
                var r = c1 = c2 = 0;
                while (n < e.length) {
                    r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r);
                        n++
                    } else if (r > 191 && r < 224) {
                        c2 = e.charCodeAt(n + 1);
                        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                        n += 2
                    } else {
                        c2 = e.charCodeAt(n + 1);
                        var c3 = e.charCodeAt(n + 2);
                        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        n += 3
                    }
                }
                return t
            }
        }
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
            var stringToSign = httpVerb + "\n" + body_md5 + "\n" + contentType + "\n" + date + "\n\n" + url;

            var shaObj = new jsSHA("SHA-1", "TEXT");
            shaObj.setHMACKey(secret, "TEXT");
            shaObj.update(stringToSign);
            var hmac = shaObj.getHMAC("HEX");

            var base64 = Base64.encode(hmac);

            return "MNF" + ident + ":" + base64;
        };

        service.convertToStringObject = function (string) {

            if (typeof string === 'string' || string instanceof String) {
                return string;
            }
            else {
                return "";
            }
        }

    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])
