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

	// 모듈 초기화
	var cfg = mz.lib.bundle(['']);
	var bc = {
		//mainBc : "f.cg.he.cm.mo.o.bc.MainBc.retrieveMainItemList"
		mainBc : "biz/cm/MainBc/retrieveList"			
	};
	mz.init(cfg, bc);

	// 모듈 설정
	mz.config([{
		path: '/',
		name: 'main',
		tpl: 'cm/cc/main/main'
	}], '/');

	//siteoverlay solution module
	//mz.load('', ['common/js/wiselog/siteoverlay.js'], true);	

	/**
	 * @method Controller
	 * @param {o} co - 공통컴포넌트
	 * @param {o}  - 스코프
	 */
	mz.controller('main', function(co, $scope) {
		var log   = co.get('logger').getLogger('main');
		var bc    = co.get('bc');
		var location = co.get('location');
		var path = co.get('path');
		var util     = co.get('util');
		var $timeout = co.get('$timeout');
		var layerPop = co.get('layerPop');
		
		/* - init --------------------------------- */
		init();
		
		/* - public ------------------------------- */

		

		/* - private ------------------------------ */

		/**
		 * @method init - 초기화
		 */
		function init() {			
			
			var pm = {cmSysDivCd :'02'   // CM시스템구분코드 ==> 대표 : 01(대표홈페이지),06(대표모바일앱), 직판: 02(직판홈페이지), 07(직판모바일앱)   
					, cmBnnrTpCd :'6222' // CM배너유형코드 
					, startIndex :'1' 	 // 메인 베너  	
					, endIndex   :'2'	 // 메인 베너
					};
			
			bc.mainBc(pm).then(function(result) {
				if(result) {
					$scope.testData = JSON.stringify( result );
				}
			});
			
		}
	});
})(angular, mz);