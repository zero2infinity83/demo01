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
		retrieveList : "/biz/dp/mb/retrieveList"			
	};
	mz.init(cfg, bc);

	// 모듈 설정
	mz.config([{
		path: '/',
		name: 'dp_mb_list',
		tpl: 'dp/mb/list'
	}], '/');	

	/**
	 * @method Controller
	 * @param {o} co - 공통컴포넌트
	 * @param {o}  - 스코프
	 */
	mz.controller('dp_mb_list', function(co, $scope) {
		var log   = co.get('logger').getLogger('dp_mb_list');
		var bc    = co.get('bc');
		var location = co.get('location');
		var path = co.get('path');
		var util     = co.get('util');
		var $timeout = co.get('$timeout');
		var layerPop = co.get('layerPop');
		
		var ssPm = location.getSessionParam();		
		
		$scope.map = {};
		
		$scope.map.srcOptArr = [ {val : "01", 	txt : "Emp No"},
		                         {val : "02", 	txt : "First Name"},
		                         {val : "03", 	txt : "Last Name"} ];		
		
		$scope.map.memberList = [];
		
		
		/* - init --------------------------------- */
		init();
		
		/* - public ------------------------------- */
		
		/**
		 * @method goDetail - 상세 조회
		 */
		$scope.map.goDetail = function( empNo ){
			
			var pm = {
					empNo 		: empNo,
					pageNum 	: $scope.map.paging.pageNum,
					searchOpt	: $scope.map.srchOpt,
					searchTxt	: $scope.map.srchTxt
			}
			
			location.go( "/member/modify.do", "", pm );						
		}
		
		/**
		 * @method search - Member 목록 조회
		 */
		$scope.map.search = function(){
			
			$scope.map.paging.pageNum = 1;
			
			bc_retrieveList();
						
		}
		
		/**
		 * @method chgPage - Change Paging (Member 목록 조회)
		 */
		$scope.map.paging.chgPage = function( targetPage ){
			
			if( targetPage == "prev" ){
				
				$scope.map.paging.pageNum = $scope.map.paging.pageNum - 10;
				$scope.map.paging.pageNum = ( $scope.map.paging.pageNum > 1 ) ? $scope.map.paging.pageNum : 1;
				
			} else if( targetPage == "next" ){
				
				$scope.map.paging.pageNum = $scope.map.paging.pageNum + 10;
				$scope.map.paging.pageNum = ( $scope.map.paging.pageNum > $scope.map.paging.totPageNum ) ? $scope.map.paging.totPageNum : $scope.map.paging.pageNum;
								
			} else{
				$scope.map.paging.pageNum = targetPage;
			}
			
			$scope.map.paging.pageStartNum =  parseInt( ( $scope.map.paging.pageNum - 1 ) / $scope.map.paging.pageShowLength ) * 10 + 1;
			
			bc_retrieveList();
			
		}
		

		/* - private ------------------------------ */
		
		/**
		 * @method bc_retrieveList - Member 목록 조회
		 */
		function bc_retrieveList(){
			var pm = {
					pageNum 	: $scope.map.paging.pageNum,
					startNum 	: ( $scope.map.paging.pageNum - 1 ) * $scope.map.paging.pagePerNum,
					pagePerNum 	: $scope.map.paging.pagePerNum,
					searchOpt	: $scope.map.srchOpt,
					searchTxt	: $scope.map.srchTxt
			};
			
			bc.retrieveList(pm).then(function(result) {				
				
				$scope.map.paging.totNum = result.totNum;		// 조회결과 전체수				 
									
				$scope.map.memberList = result.memberList;
				
				// Set Row-Number
				_.each( $scope.map.memberList, function( obj, idx ){
					obj.no = result.startNum + idx + 1;
				});				
				
				setPageArr();
			});
		}
		
		/**
		 * @method setPageArr - Paging 초기화
		 */
		function setPageArr(){
			
			$scope.map.paging.totPageNum = parseInt( $scope.map.paging.totNum / $scope.map.paging.pagePerNum ) + ( ($scope.map.paging.totNum % $scope.map.paging.pagePerNum) > 0 ? 1: 0 );
			
			$scope.map.paging.pageArr = [];
			
			for( var i=0; i<$scope.map.paging.pageShowLength; i++ ){
				if( $scope.map.paging.pageStartNum + i <= $scope.map.paging.totPageNum ){
					$scope.map.paging.pageArr.push( $scope.map.paging.pageStartNum + i );
				}									
			}
			
		}
		
		/**
		 * @method initValue - Variable Value 초기화
		 */
		function initValue(){			
			$scope.map.srchOpt = ssPm.searchOpt || "emp_no";
			$scope.map.srchTxt = ssPm.searchTxt || "";		
			
			$scope.map.paging = {};
			$scope.map.paging.pageShowLength = 10;
			$scope.map.paging.pagePerNum = 10;
			$scope.map.paging.pageNum = ssPm.pageNum || 1;
			$scope.map.paging.pageStartNum = parseInt( ( $scope.map.paging.pageNum - 1 ) / $scope.map.paging.pageShowLength ) * 10 + 1;		
			$scope.map.paging.pageArr = [];
			$scope.map.paging.totNum = 10;
		}
		
		
		/**
		 * @method init - 초기화
		 */
		function init(){
			
			initValue();	// 값 초기화
			
			setPageArr(); 	// Pagination 초기화
			
			bc_retrieveList();	// 최초 목록조회
		}
	});
})(angular, mz);