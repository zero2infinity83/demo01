/*
 * COPYRIGHT (c) MERITZ Fire Insurance 2015
 * This software is the proprietary information of MERITZ Fire Insurance.
 * 
 * Modeler : 강환기
 *
 * Revision History
 * Author Date       Description
 * ------ ---------- -----------
 * 강환기 2015-08-12 First Draft
 */
(function(angular, mz) {

	// co
	mz.core.factory('co', mz.mold(function($injector) {
		return {
			get: function(name) {
				return $injector.get(name);
			}
		};
	}));

	// ajax
	mz.core.factory('ajax', mz.mold(function($q, $http) {
		return {
			get: function(url){
				var defered = $q.defer();
				if (url) {
					$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
					$http.get(url).then(defered.resolve, defered.resolve);
				} else {
					defered.resolve(null);
				}
				return defered.promise;
			},
			post: function(url, param) {
				var defered = $q.defer();
				if (url && param) {
					$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
					$http.post(url + "?v=" + mz.v(), param).then(defered.resolve, defered.resolve);
				} else {
					defered.resolve(null);
				}
				return defered.promise;
			},
			tpl: function(url) {
				var defered = $q.defer();
				if (url) {
					$http.post(url, {}).then(defered.resolve, defered.resolve);
				} else {
					defered.resolve(null);
				}
				return defered.promise;
			},
			form: function(url, param) {
				var defered = $q.defer();
				if (url && param) {
					$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
					$http.post(url, serialize(param)).then(defered.resolve, defered.resolve);
				} else {
					defered.resolve(null);
				}
				return defered.promise;
			}
		};

		function serialize(param) {
			return _.map(param, function(v,k){ 
				return [k,'=',v].join('');
			}).join('&');
		}
	}));

	// logger
	mz.core.factory('logger', mz.mold(function($log) {
		return {
			getLogger: function(logNm) {
				return {
					logNm: logNm,
					out: function() {
						mz.MODE.LOG && $log.debug.apply($log, _.flatten(['%c [' + logNm + '] ', 'background: #e00; color: #fff', _.toArray(arguments)]));
					},
					trace: function() {
						mz.MODE.LOG && $log.info.apply($log, _.flatten(['%c [' + logNm + '] ', 'background: #000; color: #fff', _.toArray(arguments)]));
					},
					info: function(){
						mz.MODE.LOG && $log.warn.apply($log, _.flatten(['%c [' + logNm + '] ', 'background: #00e; color: #fff', _.toArray(arguments)]));
					}
				};
			}
		};
	}));

	// promise
	mz.core.factory('promise', mz.mold(function($q) {
		return $q;
	}));

	// path 제어
	mz.core.factory('path', mz.mold(function() {
		return {
			getPageId: function() {
				var locPathNmArr = location.pathname.split('#!');
				return locPathNmArr[0];
			},
			getViewId: function() {
				var locHashArr = location.hash.split('#!');
				return locHashArr[1];
			},
			targetUrl: function(pageId, viewId) {
				var url = mz.WEBROOT + '/' + pageId + '#!' + (viewId || '/');
				return url.replace(/\/\//gi, '/');
			}
		};
	}));
})(angular, mz);