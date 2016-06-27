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
	
	// session
	mz.comm.factory('menuService', mz.mold(function(co) {
		var log       = co.get('logger').getLogger('menuService');
		var util      = co.get('util');
		var $window   = co.get('$window');
		var layerPop  = co.get('layerPop');
		var location  = co.get('location');
		var http      = co.get('http');
		var path      = co.get('path');
		var o         = {};
		
		var gnb    = mz.menu;
		var curGnb = {};
		
		o.setGnb = function(id) {
			curGnb = {};
			
			_.each(gnb, function(v, k) {
				if(v.menuIdn == id) {
					curGnb = v;
					return false;
				}
			});
		};

		o.getGnb = function() {
			return curGnb;
		};
		
		o.getGnbId = function() {
			return curGnb.menuIdn;
		};
		
		o.realMenuCheck = function(info, pageId) {
			return info.linkUrl == pageId && info.srcePthNm != '';
		};
		
		o.goMenu = function(menu) {
			if(!menu.linkUrl) {
				return;
			}
			
			if(menu.cmNewWdwTpCd == '1') {
				var linkWindow = $window.open('about:blank');
                linkWindow.location.href = menu.linkUrl;
			} else if(menu.cmNewWdwTpCd == '2') {
				var pageId = menu.linkUrl;
				http.post('f.cg.he.co.cc.o.bc.SessionRouteBc.getSessionUserInfo', {}, false).then(function(result) {
					if (result && result.body) {
						var userInfo = result.body.userInfo;
						var authCd   = '';
						var menu = _.filter(mz.menu, function(info) { return o.realMenuCheck(info, pageId);})[0];
						var cmCnnAthTpCds  = [];
						
						if(!_.isUndefined(menu)) {
							cmCnnAthTpCds = menu.cmCnnAthTpCd.split(",");
						}
						
						if (userInfo) {
							authCd = userInfo.authCd;
						}
						
						if(0 < cmCnnAthTpCds.length
						&& -1 == _.indexOf(cmCnnAthTpCds, '5')
						&& -1 == _.indexOf(cmCnnAthTpCds, authCd)) {
							if('Y' == menu.menuAthoYn) {
								$window.location.replace(path.targetUrl(pageId, '/desc'));
							} else {
								$window.location.replace("/certification-center/user-authentication.do");
							}
						} else {
							$window.location.href = pageId;
						}
					}
				});	
			} else if(menu.cmNewWdwTpCd == '3') {
				layerPop.open('layerCommon', menu.linkUrl).then(function(result) {
					log.out(result);
				});
			}
		};
		
		return o;
	}));
})(angular, mz);