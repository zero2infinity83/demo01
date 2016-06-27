/*
 * COPYRIGHT (c) ****
 * This software is the proprietary ****
 * 
 * Modeler : 천주현
 *
 * Revision History
 * Author Date       Description
 * ------ ---------- -----------
 * 천주현 2016-06-13 First Draft
 */
(function(angular, mz) {

	// 모듈 초기화
	var cfg = mz.lib.bundle(['']);
	var bc = {
		retrieveLogin 		: "/biz/cm/co/user/login",		// 사용자 로그인
		retrieveLogout 		: "/biz/cm/co/user/logout",		// 사용자 로그인
	};
	mz.init(cfg, bc);

	// 모듈 설정
	mz.config([{
		path: '/',
		name: 'cm_co_login',
		tpl: 'cm/co/login'
	}], '/');

	/**
	 * @method Controller
	 * @param {o} co - 공통컴포넌트
	 * @param {o}  - 스코프
	 */
	mz.controller('cm_co_login', function(co, $scope, $rootScope) {
		var log   = co.get('logger').getLogger('cm_co_login');
		var bc    = co.get('bc');
		var location = co.get('location');
		var userSession = co.get('userSession');
		var path = co.get('path');
		var util     = co.get('util');
		var $timeout = co.get('$timeout');
		var layerPop = co.get('layerPop');
		
		var ssPm = location.getSessionParam();
		
		$scope.map = {};		
		
		/* - init --------------------------------- */
		init();
		
		/* - public ------------------------------- */
		
		/**
		 * @method execLogin - 로그인
		 */
		$scope.map.execLogin = function(){
			if( !validChk() )	return false;
				
			bc_retrieveLogin();	// 로그인 실행
		}
			

		/* - private ------------------------------ */
		
		
		
		/**
		 * @method validChk - 유효성 검사
		 */
		function validChk(){			
			
			var retVal = true;
			
			if( $scope.map.inpId == null || $scope.map.inpId == '' ){
				
				alert("아이디를 입력해주세요");
				retVal = false;
				
			}else if( $scope.map.inpPw == null || $scope.map.inpPw == '' ){
				
				alert("암호를 입력해주세요");
				retVal = false;
				
			}			
			
			return retVal;
			
		}
		
		/**
		 * @method bc_retrieveLogin - 로그인
		 */
		function bc_retrieveLogin(){
			var pm = {
					userId : $scope.map.inpId,	// ID
					userPw : $scope.map.inpPw	// PW
			};
			
			bc.retrieveLogin(pm).then(function(result) {
				
				if( result.resCd == 0 ){
					
					alert("로그인 성공");
					userSession.loginEventOn();	// 로그인 이벤트 알림					
				
				}else if( result.resCd == 1 ){
					
					alert("암호가 틀립니다.");
				
				}else if( result.resCd == 2 ){
					
					alert("아이디가 없습니다.");
				
				}
				
			});
		}
		
		/**
		 * @method init - 초기화
		 */
		function init(){		
			
									
		}
	});
})(angular, mz);