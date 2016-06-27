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
	mz.core.config(mz.mold(function($httpProvider, blockUIConfig) {
		blockUIConfig.autoBlock = false;
		blockUIConfig.delay = 0;
		$httpProvider.interceptors.push('loadingIntercepter');
	}));

	mz.core.factory('loading', mz.mold(function($rootScope, blockUI) {
		return {
			on: function() {
				!blockUI.isBlocking && blockUI.start();
			},
			off: function() {				
				blockUI.stop();
				if(mz.browser[0] == 'I' && blockUI.state().blockCount == 0) {
					$("body").css("cursor", "default").removeAttr("style");
				}
			}
		};
	}));

	mz.core.factory('loadingIntercepter', mz.mold(function($q, loading) {
		var o = {};
		o.request = function(c) { return (c && c.url && c.url.indexOf('.tpl') < 0 && loading.on()), c; };
		o.requestError = function(r) { return $q.reject(r); };
		o.response = function(r) { return (r && r.config && r.config.url && r.config.url.indexOf('.tpl') < 0 && loading.off()), (r || $q.when(r)); };
		o.responseError = function(r) { return (r && r.config && r.config.url && r.config.url.indexOf('.tpl') < 0 && loading.off()), $q.reject(r); };
		return o;
	}));
})(angular, mz);