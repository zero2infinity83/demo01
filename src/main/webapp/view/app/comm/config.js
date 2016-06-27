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
(function(angular,mz){

	mz.core.config(mz.mold(function(blockUIConfig) {
		blockUIConfig.templateUrl = mz.path('/app/views/comm/loading.tpl', true);
	}));
	
	mz.comm.config(mz.mold(function(routeProvider){
		routeProvider.resolve({
			/*
			analysis : mz.mold(function($q, $timeout, analysis){
				var p = $q.defer();
				$timeout(function() {
					analysis.gAnalytics();
					analysis.gTagMgr();
					analysis.fbPCodeComm();
				});
				p.resolve();
				return p.promise;
			}),
			clear: mz.mold(function($timeout, layerPop, $window) {
				$timeout(function() {
					//layer_popup_container clear...
					$("#layer_popup_container").html("").css('display', '');
					if($window.tk && $window.tk.now) {
						$window.tk.close();
					}
					layerPop.clear();
				});
				return true;
			}),
			session: mz.mold(function(session) {
				return session.test();
			}),*/
			paramInit: mz.mold(function(location) {
				return location.init();
			})
		});
	}));

})(angular,mz);