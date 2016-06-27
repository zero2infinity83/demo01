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

	mz.core.config(mz.mold(function($logProvider, $locationProvider){
		// 로깅설정
		$logProvider.debugEnabled(!!mz.MODE.LOG);
		// 해쉬뱅
		$locationProvider.html5Mode(false).hashPrefix('!');
	}));

})(angular, mz);