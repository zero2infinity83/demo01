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
		retrieveDetail 		: "/biz/dp/mb/retrieveDetail",		// 직원 상세조회
		retrieveDeptList 	: "/biz/dp/co/retrieveDeptList",	// 부서 전체조회
		updateEmployeeInfo 	: "/biz/dp/mb/updateEmployeeInfo"	// 직원 정보수정
	};
	mz.init(cfg, bc);

	// 모듈 설정
	mz.config([{
		path: '/',
		name: 'dp_mb_modify',
		tpl: 'dp/mb/modify'
	}], '/');	

	/**
	 * @method Controller
	 * @param {o} co - 공통컴포넌트
	 * @param {o}  - 스코프
	 */
	mz.controller('dp_mb_modify', function(co, $scope) {
		var log   = co.get('logger').getLogger('dp_mb_modify');
		var bc    = co.get('bc');
		var location = co.get('location');
		var path = co.get('path');
		var util     = co.get('util');
		var $timeout = co.get('$timeout');
		var layerPop = co.get('layerPop');
		
		var ssPm = location.getSessionParam();
		
		$scope.map = {};
		$scope.map.empInfoArr = [];
		$scope.map.resEmpInfo = {};
		
		$scope.map.inpDeptNo = 0;
		
		
		/* - init --------------------------------- */
		init();
		
		/* - public ------------------------------- */
		
		/**
		 * @method goList - 목록화면으로 이동
		 */
		$scope.map.goList = function(){
			var pm = {
				pageNum 	: ssPm.pageNum,
				searchOpt	: ssPm.searchOpt,
				searchTxt	: ssPm.searchTxt
			}
			
			location.go("/member/list.do", "", pm );
		}
		
		/**
		 * @method modify - 회원정보수정
		 */
		$scope.map.modify = function(){
			
			bc_updateEmployeeInfo();
			
		}
		
			

		/* - private ------------------------------ */
		
		/**
		 * @method bc_retrieveDetail - Member 상세 조회
		 */
		function bc_retrieveDetail( empNo ){
			var pm = {
					empNo : empNo 
			};
			
			bc.retrieveDetail(pm).then(function(result) {				
				
				$scope.map.empInfoArr = result.empDetailInfo;				
				
				$scope.map.resEmpInfo = $scope.map.empInfoArr[ $scope.map.empInfoArr.length - 1 ];
				
				var resEmpInfo = angular.copy( $scope.map.resEmpInfo );				
				
				$scope.map.inpEmpNo 	= resEmpInfo.emp_no;	// Emp No
				$scope.map.inpFirstName = resEmpInfo.first_name;// First Name
				$scope.map.inpLastName 	= resEmpInfo.last_name;	// Last Name
				$scope.map.inpDeptNo 	= resEmpInfo.dept_no || 0;	// Dept No
				$scope.map.inpDeptName 	= resEmpInfo.dept_name;	// Dept Name
				$scope.map.inpTitle 	= resEmpInfo.title;		// Title
				$scope.map.inpGender 	= resEmpInfo.gender;	// Gender
				$scope.map.inpBirthDate = resEmpInfo.birth_date;// Birth Date
				$scope.map.inpHireDate 	= resEmpInfo.hire_date;	// Hire Date				
				
			});
		}
		
		
		
		/**
		 * @method bc_updateEmployeeInfo - Member 정보 수정
		 */
		function bc_updateEmployeeInfo(){
			var pm = {
					empNo 		: $scope.map.inpEmpNo,
					firstName 	: $scope.map.inpFirstName,
					lastName 	: $scope.map.inpLastName,
					gender 		: $scope.map.inpGender,
					birthDate 	: $scope.map.inpBirthDate,
					hireDate 	: $scope.map.inpHireDate,
					
					title 		: $scope.map.inpTitle,
					deptNo 		: $scope.map.inpDeptNo,
					deptName 	: $scope.map.inpDeptName,
			};
			
			bc.updateEmployeeInfo(pm).then(function(result) {				
				
				if( result.res  != 0 ){
					alert("Error while Updating");
					return false;
				}
				
				alert("Success");
				
			});
		}
		
		/**
		 * @method bc_retrieveDeptList - 부서(Department) 조회
		 */
		function bc_retrieveDeptList( empNo ){
			var pm = {};
			
			bc.retrieveDeptList(pm).then(function(result) {
				
				$scope.map.deptListArr = result.deptList;
				
			});
		}
		
		/**
		 * @method init - 초기화
		 */
		function init(){
			$scope.map.empNo = ssPm.empNo;
			
			bc_retrieveDeptList();
			
			$timeout(function(){ bc_retrieveDetail( $scope.map.empNo ); }, 500);
						
		}
	});
})(angular, mz);