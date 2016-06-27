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

	/**
	 * @method commController - 공통 컨트롤러
	 * @param {o} co - 공통컴포넌트
	 * @param {o} $scope - 스코프
	 */
	mz.comm.controller('commController', mz.mold(function(co, $scope, logger, location, layerPop, menuService, popup, util) {
		var log = logger.getLogger('commController');
		var $window = co.get('$window');
		$window.ozPopup = co.get('ozPopup');
		
		$scope.WEBROOT = mz.WEBROOT;
		$scope.DOWNLOADURL = mz.DOWNLOADURL;

		/* - init --------------------------------- */

		init();

		/* - public -------------------------------- */

		$scope.home = function() {
			location.go('/main.do', '/');
		};

		$scope.mobileService = function() {
			location.go('/certification-center/mobile/mobile-web.do', '/');
		};
		
		$scope.counsel = function() {
			location.go('/customer-center/online-counsel.do', '/');
		};
		
		$scope.showDirect = function(menuId) {
			if(util.isNull(menuId) || menuId == 0) {
				location.go("/main.do");
				return;

			}
			// $('.btn_reckoning').trigger('click');
			$scope.onOff = 'off';
			$('#ly_direct_cc').css('display','none');
			menuService.setGnb(menuId);
			var gnb = menuService.getGnb();
			popup.contract(gnb.linkUrl);
		};


		/*
		$scope.alert = function(message, option) {
			return layerPop.alert({
				message: message,
				option: option,
				tpl: 'comm/alert',
				id: 'layer_alert',
				controller: 'layerAlertController'
			});
		};

		$scope.confirm = function(message, title, option) {
			return layerPop.confirm({
				message: message,
				title: title,
				option: option,
				tpl: 'comm/confirm',
				id: 'layer_confirm',
				controller: 'layerConfirmController'
			});
		};
		*/

		/* - event -------------------------------- */
		/*
		$scope.$on('event-comm-session', function(event, userInfo) {
			log.trace(userInfo);
			if (userInfo) {
				$scope.userNm = userInfo.userNm;
				//로그인이 되어 세션에 사용자가 있다면 sessionIdleService start()
				var sessionIdleService = co.get('sessionIdleService');
				sessionIdleService.start();
			}
		});
		*/

		$scope.activeClass = function(val) {
			if (_.isUndefined(val) || _.isNull(val) || 0 == $.trim(val).length) {
				return '';
			}
			return 'active';
		};
		
		$scope.setTitle = function(val) {
			if (_.isUndefined(val) || _.isNull(val) || 0 == $.trim(val).length) {
				return false;
			}
			
			document.title = val + " | 메리츠화재";
			return true;
		};
		
		//계약상태 class 처리
		$scope.insStatCdNmClass = function(val) {
			var classNm = "link";
			
			if(val == '유예') {
				classNm = "link02";
			} else if(val == '미납') {
				classNm = "link04";
			} else if(val == '실효') {
				classNm = "link03";
			}
 			
			return classNm;
		};
		
		//공통 은행 팝업 호출
		$scope.openLayerBank = function(bankList, id) {
			var param = {
				bankList: _.clone(bankList)	
			};
			
			return layerPop.open("layerBank", "comm/bank", param).then(function(result) {
				log.out("result #######", result);
				//id값에 text 변경 
				if(result && result.data) {
					var data = result.data;
					$("#" + id)
					.text(data.efctValNm)
					.data("value", data.efctVal);
				}
				return result;
			});
		};

		/* - private ------------------------------ */

		/**
		 * @method init - 초기화
		 */
		function init() {}
	}));
	
	mz.comm.controller('layerBankController', mz.mold(function(co, $scope) {
		var log       = co.get('logger').getLogger('layerBankController');
		var layerPop  = co.get('layerPop');
		var util      = co.get('util');
		var $timeout  = co.get('$timeout');
		
		init();
		
		$scope.close = function() {
			layerPop.close($scope, $scope.result);
		};
		
		$scope.clickBank = function(info) {
			$scope.result = {
				data: info	
			};
			$scope.close();
		};
		
		function init() {
			var param = layerPop.getParam($scope);
			
			$scope.param  = {}; //넘어온 정보.
			$scope.result = {}; //부모에게 넘길 정보.
			
			if(!_.isUndefined(param)) {
				$scope.param = param;
			}
			
			$timeout(function() {
				var len = $(".layer_content .select_bank li").size();
				var n   = 5 - (len % 5);
				var s   = "";
				for(var i = 0; i < n; i++) {
					s += "<li class=\"ui_last\"></li>";
				}
				$(".layer_content .select_bank li").last().after(s);
			});
		}
	}));

	/**
	 * @method 
	 * @param {[type]} co [description]
	 * @param {[type]} $scope) {		var log [description]
	 * @return {[type]} [description]
	 */
	mz.comm.controller('layerAlertController', mz.mold(function(co, $scope) {
		var log         = co.get('logger').getLogger('layerAlertController');
		var $sce        = co.get('$sce');
		var $rootScope  = co.get('$rootScope');

		var id = "layer_alert";
		/* - init --------------------------------- */

		init();

		/* - private ------------------------------ */
		$scope.confirm = function() {
			$rootScope[id] = {open: false};
			closeLayerPopup(id);
			$scope.promise.resolve(true);
		};


		/**
		 * @method init - 초기화
		 */
		function init() {
			$scope.message = $sce.trustAsHtml($scope.message);

			var option = $scope.option;
			$scope.width = option.width || '440';
		}
	}));

	/**
	 * @method 
	 * @param {[type]} co [description]
	 * @param {[type]} $scope) {		var log [description]
	 * @return {[type]} [description]
	 */
	mz.comm.controller('layerConfirmController', mz.mold(function(co, $scope) {
		var log 	    = co.get('logger').getLogger('layerConfirmController');
		var $sce 	    = co.get('$sce');
		var id 			= "layer_confirm";
		var $rootScope  = co.get('$rootScope');

		/* - init --------------------------------- */

		init();


		/* - private ------------------------------ */
		$scope.confirm = function() {
			$rootScope[id] = {open: false};
			closeLayerPopup(id);
			$scope.promise.resolve(true);
		};


		$scope.cancel = function() {
			$rootScope[id] = {open: false};
			closeLayerPopup(id);
			$scope.promise.resolve(false);
		};

		$scope.callFn = function(name) {
			$scope[name]();
		};

		/**
		 * @method init - 초기화
		 */
		function init() {
			$scope.message = $sce.trustAsHtml($scope.message);

			var option = $scope.option;
			$scope.width = option.width || '440';
			$scope.btn = option.btn || [{
				name: '취소',
				css: 'btn_w01',
				fnName: 'cancel'
			}, {
				name: '확인',
				css: 'btn_n02',
				fnName: 'confirm'
			}];
		}
	}));

	/**
	 * @method 
	 * @param {[type]} co [description]
	 * @param {[type]} $scope) {		var log [description]
	 * @return {[type]} [description]
	 */
	mz.comm.controller('layerCommonController', mz.mold(function(co, $scope) {
		var log = co.get('logger').getLogger('layerCommonController');
		var id = "layerCommon";
		var layerPop = co.get('layerPop');
		var $timeout  = co.get('$timeout');
		
		/* - init --------------------------------- */

		init();

		/* - public ------------------------------ */
		$scope.close = function() {
			log.out('common layer popup close!!!');
			/*
			closeLayerPopup(id);
			$scope.promise.resolve(true);
			*/
			layerPop.close($scope, {
				result: true
			});
		};

		/* - private ------------------------------ */

		/**
		 * @method init - 초기화
		 */
		function init() {
			$timeout(function(){
				window.telecomSltSub.init();
			}, 500);
		}
	}));


	/**
	 * 휴대폰인증 레이어 팝업.
	 */
	mz.comm.controller('layerMobileCertController', mz.mold(function(co, $scope) {
		var log = co.get('logger').getLogger('layerMobileCertController');
		var id = "layerMobileCert";
		var http = co.get('http');
		var layerPop = co.get('layerPop');
		var util = co.get('util');

		init();

		/* - public ------------------------------ */
		$scope.close = function() {
			layerPop.close($scope, $scope.retData);
		};

		//인증번호받기
		$scope.rqeCellAthNo = function() {
			//인증번호 받기 validation 체크..
			requestCheck();

			if ($scope.valid.telNo.error ) {
				return false;
			}

			var type = $('#i_mphone_type option:selected').val();
			var cellNo = util.replaceAll($scope.data.telNo, '-', '');
			var param = {
				"ccoDiv": type,
				"cellNo": cellNo
			};

			log.out("인증번호 PARAM ########", param);

			http.post('f.cg.he.co.cc.o.bc.CertMobileBc.rqeCellAthNo', param).then(function(result) {
				if (!util.resultMsg(result)) {
					return false;
				}

				if (result.body.athRsl == '0000') {
					$scope.isRqeSmsAthNo = true;
				}
			});
		};


		//본인인증
		$scope.verifyCellAthNo = function() {
			//본인인증 validation check
			verifyCheck();

			if (util.isError($scope.valid)) {
				return false;
			}

			var smsAthNo = $scope.data.smsAthNo;
			var param = {
				"smsAthNo": smsAthNo
			};

			http.post('f.cg.he.co.cc.o.bc.CertMobileBc.verifyCellAthNo', param).then(function(result) {
				if (!util.resultMsg(result)) {
					return false;
				}

				$scope.retData = {
					success: true,
					smsAthNo: smsAthNo
				};
				layerPop.close($scope, $scope.retData);
			});
		};

		$scope.loadTermsPopup = function(type) {
			var ctrlNm = "";
			var tplNm = "";
			if (type == '01') {
				//개인정보 이용 및 제공동의 약관
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/clus/lypop_indvInf";
			} else if (type == '02') {
				//고유식별 정보 처리 동의
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/clus/lypop_identifier";
			} else if (type == '03') {
				//통신사 이용약관 동의
				ctrlNm = "layerCommon";
				var ccoDiv = $('#i_mphone_type option:selected').val();
				log.out("통신사 구분 = " + ccoDiv);
				if (ccoDiv == '1' || ccoDiv == '5') {
					//SKT 약관
					tplNm = "biz/cm/mo/clus/lypop_telecomSK";
				} else if (ccoDiv == '2' || ccoDiv == '6') {
					//KT 약관
					tplNm = "biz/cm/mo/clus/lypop_telecomKT";
				} else if (ccoDiv == '3' || ccoDiv == '7') {
					//LGT 약관
					tplNm = "biz/cm/mo/clus/lypop_telecomLG";
				}
			} else if (type == '04') {
				//개인정보 이용 및 제공동의 약관
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/lgin/lypop_sec_card01";
			} else if (type == '05') {
				//고유식별 정보 처리 동의
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/lgin/lypop_sec_card02";
			} else if (type == '06') {
				//휴대폰 본인확인 서비스 이용약관 동의 팝업
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/clus/lypop_serviceChck";
				
			}

			layerPop.open(ctrlNm, tplNm);
		};

		/* - private ------------------------------ */
		function agreeCheck () {
			$scope.valid = $scope.valid || {};
			//동의여부체크
			$scope.valid.agree = {
				error: false,
				msg: "동의에 체크해 주셔야 합니다."
			};

			if (!$scope.data.agree1 || !$scope.data.agree2 || !$scope.data.agree3) {
				$scope.valid.agree.error = true;
			}
		}
		
		function requestCheck() {
			$scope.valid = $scope.valid || {};
			
			if (type == '02') {
				//동의여부 확인
				if (!$scope.layer.i_chk_termsP01 || !$scope.layer.i_chk_termsP02 || !$scope.layer.i_chk_termsP03 || !$scope.layer.i_chk_termsP04) {
					$scope.layer.i_chk_termsP_error = true;
					isValid = false;
				} else {
					$scope.layer.i_chk_termsP_error = false;
				}
			}

			//휴대폰번호체크
			$scope.valid.telNo.error = {
				error: false,
				msg: '휴대폰번호를 정확히 입력하세요.'
			};
			
			if (_.isEmpty($scope.data.telNo) || !util.isMobile($scope.data.telNo)) {
				$scope.valid.telNo.error = true;
			}

			setTimeout(function() {
				errorMthod();
			}, 200);
		}

		function verifyCheck() {
			$scope.valid = $scope.valid || {};			
			//인증번호 받기..되어 있는지 체크
			if (!$scope.isRqeSmsAthNo) {
				$scope.valid.telNo = {
					error: true,
					msg: "인증번호 받기를 눌러주세요."
				};
			}

			//인증번호 체크
			$scope.valid.smsAthNo = {
				error: false,
				msg: "인증번호를 정확히 입력하세요."
			};

			if (_.isEmpty($scope.data.smsAthNo) || $scope.data.smsAthNo.length != 6) {
				$scope.valid.smsAthNo.error = true;
			}
			
			agreeCheck();
			
			setTimeout(function() {
				errorMthod();
			}, 200);
		}
		

		/**
		 * @method init - 초기화
		 */
		function init() {
			$scope.data = {
				type: '1',
				agree1: false,
				agree2: false,
				agree3: false
			}; //layer에서 관리되는 변수..
			//통신사 코드
			$scope.ccoDivList = [{
				cd: '1',
				nm: 'SKT'
			}, {
				cd: '2',
				nm: 'KT'
			}, {
				cd: '3',
				nm: 'LG U+'
			}, {
				cd: '5',
				nm: 'SKT 알뜰폰'
			}, {
				cd: '6',
				nm: 'KT 알뜰폰'
			}, {
				cd: '7',
				nm: 'LG U+ 알뜰폰'
			}];

			$scope.isRqeSmsAthNo = false;
			$scope.retData = {
				success: false
			};

			setTimeout(function() {
				styleFormMethod();
			}, 200);
		}
	}));

	/**
	 * @method 
	 * @param {[type]} co [description]
	 * @param {[type]} $scope) {		var log [description]
	 * @return {[type]} [description]
	 */
	mz.comm.controller('layerSelfLginController', mz.mold(function(co, $scope) {
		var id = "layerSelfLgin";
		var log = co.get('logger').getLogger('layerSelfLginController');
		var http = co.get('http');
		var layerPop = co.get('layerPop');
		var location = co.get('location');
		var util = co.get('util');
		var ajax = co.get('ajax');
		var athdc = co.get('athdc');
		var $timeout = co.get('$timeout');
		var rsecure = co.get('rsecure');
		var $window = co.get('$window');

		$scope.layer = {};

		/* - init --------------------------------- */

		init();

		/* - public ------------------------------ */
		$scope.layer.close = function(result) {
			layerPop.close($scope, {
				result: result
			});
		};
		/**
		 * [ccoDivList description] 통신사 구분
		 * @type {Array}
		 */
		//통신사 코드
		$scope.layer.ccoDivList = [{
			cd: '1',
			nm: 'SKT'
		}, {
			cd: '2',
			nm: 'KT'
		}, {
			cd: '3',
			nm: 'LG U+'
		}, {
			cd: '5',
			nm: 'SKT 알뜰폰'
		}, {
			cd: '6',
			nm: 'KT 알뜰폰'
		}, {
			cd: '7',
			nm: 'LG U+ 알뜰폰'
		}];
		//기본 통신사 코드
		$scope.layer.ccoDiv = $scope.layer.ccoDivList[0].cd;
		//인증번호 요청 여부
		$scope.layer.isRqeSmsAthNo = false;
		/**
		 * @method movePage
		 * @param {[type]} type [description]
		 */
		$scope.layer.movePage = function(type) {
			if (type == 'certificate') {
				//공인인증 등록 화면 이동
				location.go("/certification-center/user-certificate.do");
			}
		};
		$scope.layer.showTab = function(tabId) {
			log.out("tabId = " + tabId);
			$scope.layer.table = tabId;
			$timeout(function() {
				log.out("화면 스타일 적용!!");
				styleFormMethod();
			}, 100);
			//
			if ($window.tk && $window.tk.now) {
				log.out($window.tk);
				$window.tk.close();
			}
		};
		/**
		 * @method checkValid
		 * @param {[type]} type [description]
		 * @param {[type]} id [description]
		 * @param {[type]} error [description]
		 */
		$scope.layer.checkValid = function(type, id) {
			var error = false;
			var val = document.getElementById(id).value;
			log.out("val = " + val);
			if (type == 'hp') {
				if (!val || val.length < 11 || !util.isMobile(val)) {
					error = true;
				}
			} else if (type == 'ssn') {
				if (!val || val.length < 6) {
					error = true;
				}
			} else {
				if (!val) {
					error = true;
				}
			}
			$timeout(function() {
				errorMthod();
			}, 10);
			return error;
		};
		/**
		 * @method procLgin
		 * @param {[type]} type [description]
		 */
		$scope.layer.procLgin = function(type) {
			if (type == '01') {
				//공인인증서 본인인증
				//2차 추가인증의 경우, 1차와 동일한 인증방식은 사용할수 없음
				if($scope.layer.prevAuthCd && $scope.layer.prevAuthCd == '1') {
					layerPop.alert("휴대폰 또는 신용카드로 추가 인증을 해 주세요.");
					return false;
				}
				//athdc.login(ksbizSignCallback);
				athdc.login(function(result) {
					log.out(result);
					if (result.status == 1) {
						//인증서 확인 - 공인인증서 로그인 처리
						lginOfapvAthdc(result.data);
						//
					} else if (result.status == 0) {
						log.out("인증서 선택 취소!!!!1");
						layerPop.alert("인증서 선택을 취소 하였습니다. ");
					} else {
						log.out("전자서명 오류:" + result.message + "[" + result.status + "]")
						layerPop.alert("전자서명 오류:" + result.message + "[" + result.status + "]");
					}
				});
			} else if (type == '02') {
				//2차 추가인증의 경우, 1차와 동일한 인증방식은 사용할수 없음
				if($scope.layer.prevAuthCd && $scope.layer.prevAuthCd != '1') {
					layerPop.alert("공인인증서로 추가 인증을 해 주세요.");
					return false;
				}
				//휴대폰 인증 본인인증
				lginCellAthNo();
			} else if (type == '03') {
				if($scope.layer.prevAuthCd && $scope.layer.prevAuthCd != '1') {
					layerPop.alert("공인인증서로 추가 인증을 해 주세요.");
					return false;
				}
				//신용카드 본인인증
				lginCrdtCrd();
			} else {
				//
				log.out("인증 타입 오류 type = " + type);
			}
		};
		/**
		 * @method rqeCellAthNo 휴대폰 인증번호 요청
		 */
		$scope.layer.rqeCellAthNo = function() {
			if($scope.layer.prevAuthCd && $scope.layer.prevAuthCd != '1') {
				layerPop.alert("공인인증서로 추가 인증을 해 주세요.");
				return false;
			}
			//휴대폰 인증번호 요청
			rqeCellAthNo();
		};
		
		/**
		 * @method lginAgrChk
		 * @param {[type]} type [description]
		 */
		function lginAgrChk(type) {
			
			if (type == '02') {
				//동의여부 확인
				if (!$scope.layer.i_chk_termsP01 || !$scope.layer.i_chk_termsP02 || !$scope.layer.i_chk_termsP03 || !$scope.layer.i_chk_termsP04) {
					$scope.layer.i_chk_termsP_error = true;
					isValid = false;
				} else {
					$scope.layer.i_chk_termsP_error = false;
				}
			}
			
			if (type == '03') {
				//동의여부 확인
				if (!$scope.layer.i_chk_termsC01 || !$scope.layer.i_chk_termsC02) {
					$scope.layer.i_chk_termsC_error = true;
					isValid = false;
				} else {
					$scope.layer.i_chk_termsC_error = false;
				}
			}
			
		}
		/**
		 * @method loadTermsPopup 약관 팝업 호출
		 * @param {[type]} type [description]
		 */
		$scope.layer.loadTermsPopup = function(type) {
			var ctrlNm = "";
			var tplNm = "";
			if (type == '01') {
				//개인정보 이용 및 제공동의 약관
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/clus/lypop_indvInf";
			} else if (type == '02') {
				//고유식별 정보 처리 동의
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/clus/lypop_identifier"
			} else if (type == '03') {
				//통신사 이용약관 동의
				ctrlNm = "layerCommon";
				$scope.ccoDiv = $('#layer_i_mphone_type option:selected').val();
				log.out("통신사 구분 = " + $scope.ccoDiv);
				if ($scope.ccoDiv == '1' || $scope.ccoDiv == '5') {
					//SKT 약관
					tplNm = "biz/cm/mo/clus/lypop_telecomSK";
				} else if ($scope.ccoDiv == '2' || $scope.ccoDiv == '6') {
					//KT 약관
					tplNm = "biz/cm/mo/clus/lypop_telecomKT";
				} else if ($scope.ccoDiv == '3' || $scope.ccoDiv == '7') {
					//LGT 약관
					tplNm = "biz/cm/mo/clus/lypop_telecomLG";
				} else {
					layerPop.alert("통신사 구분값을 확인해 주세요.");
					return false;
				}
			} else if (type == '04') {
				//개인정보 이용 및 제공동의 약관
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/lgin/lypop_sec_card01";
			} else if (type == '05') {
				//고유식별 정보 처리 동의
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/lgin/lypop_sec_card02";
			} else if (type == '06') {
				//휴대폰 본인확인 서비스 이용약관 동의 팝업
				ctrlNm = "layerCommon";
				tplNm = "biz/cm/mo/clus/lypop_serviceChck";		
			} else {
				layerPop.alert("약관 구분을 확인해 주세요.");
				return false;
			}
			//약관 팝업 표시
			layerPop.open(ctrlNm, tplNm).then(function(result) {
				//callback
				log.out(result);
			});
		};

		/* - private ------------------------------ */
		/**
		 * @method init - 초기화
		 */
		function init() {
			//
			$timeout(function() {
				styleFormMethod();
				window.telecomSltSub.init();
			}, 200);
			//
			//키보드보안/ 가상키패드 초기화
			rsecure.initRsecureKey(300);
		}
		/**
		 * @method lginOfapvAthdc 공인인증서 본인인증
		 * @param {[type]} data [description]
		 */
		function lginOfapvAthdc(data) {
			var pm = {
				ksbizSig: data,							//인증서데이터
				prevAuthCd: $scope.layer.prevAuthCd		//직전 인증유형
			};
			http.post("f.cg.he.cm.mo.o.bc.LginBc.lginOfapvAthdc", pm).then(function(result) {
				log.out(result);
				if (result) {
					//prcesResultDivCd 0 이면성공, 1 이면실패
					if (result.header && result.header.prcesResultDivCd == '0') {
						//본인인증 성공여부 확인
						checkLoginResult(result.body);
					} else {
						//실패시 에러메시지 처리
						layerPop.alert(result.msg.standMsg);
						return false;
					}
				}
			});
		}
		/**
		 * @method lginCrdtCrd 신용카드 본인인증
		 */
		function lginCrdtCrd() {
			var isValid = true;
			//입력체크
			if (!$scope.layer.i_jumin_a01 || $scope.layer.i_jumin_a01.length < 6 || document.getElementById('layer_i_jumin_a02').value.length < 7) {
				$scope.layer.i_jumin_a01_error = true;
				isValid = false;
			} else {
				$scope.layer.i_jumin_a01_error = false;
			}
			if (!$scope.layer.i_creditCard01 || !$scope.layer.i_creditCard02 || !$scope.layer.i_creditCard03 || document.getElementById('layer_i_creditCard04').value.length == 0) {
				$scope.layer.i_creditCard_error = true;
				isValid = false;
			} else {
				$scope.layer.i_creditCard_error = false;
			}
			if (!$scope.layer.i_periodYear || !$scope.layer.i_periodMonth) {
				$scope.layer.i_period_error = true;
				isValid = false;
			} else {
				$scope.layer.i_period_error = false;
			}
			//카드유효년도 체크
			var curYear = new Date().getFullYear() % 2000;
			log.out("curYear = " + curYear % 2000);
			if ($scope.layer.i_periodYear < curYear) {
				log.out("efctYY input invalid!!!");
				$scope.layer.i_period_error = true;
				isValid = false;
			} 
			if (document.getElementById('layer_i_pw').value.length == 0) {
				$scope.layer.i_pw_error = true;
				isValid = false;
			} else {
				$scope.layer.i_pw_error = false;
			}
			//동의여부 확인
			if (!$scope.layer.i_chk_termsC01 || !$scope.layer.i_chk_termsC02) {
				$scope.layer.i_chk_termsC_error = true;
				isValid = false;
			} else {
				$scope.layer.i_chk_termsC_error = false;
			}
			if (!isValid) {
				$timeout(function() {
					errorMthod();
				}, 10);
				return false;
			}
			//주민번호 키보드보안(가상키패드) 입력 복호화 처리
			var inputData = util.getInputEncData(['layer_i_jumin_a02', 'layer_i_creditCard04', 'layer_i_pw'], document.getElementById("lyfrm"));
			log.out(inputData);
			//
			ajax.form("/solution/touchen/decode.do", inputData).then(function(ajaxRst) {
				log.out("키보드보안 복호화 결과 : ", ajaxRst);
				if(ajaxRst && ajaxRst.data && ajaxRst.data.result) {
					log.out("ajaxRst.data : ", ajaxRst.data);
					var pm = {
						iJuminA01: $scope.layer.i_jumin_a01, //주민번호 앞자리
						iJuminA02: ajaxRst.data.layer_i_jumin_a02, //주민번호 뒷자리 - 세션 키
						crdtCrdNo1: $scope.layer.i_creditCard01 + $scope.layer.i_creditCard02 + $scope.layer.i_creditCard03, //신용카드번호
						crdtCrdNo2: ajaxRst.data.layer_i_creditCard04, //신용카드번호 - 세션키
						efctYY: $scope.layer.i_periodYear, //유효년도
						efctMM: util.leftPad($scope.layer.i_periodMonth, 2, '0'), //유효월
						pwd: ajaxRst.data.layer_i_pw, 		//비밀번호 - 세션키
						prevAuthCd: $scope.layer.prevAuthCd
					};
					http.post("f.cg.he.cm.mo.o.bc.LginBc.lginCrdtCrd", pm).then(function(result) {
						log.out(result);
						if (result) {
							//prcesResultDivCd 0 이면성공, 1 이면실패
							if (result.header && result.header.prcesResultDivCd == '0') {
								//본인인증 성공여부 확인
								checkLoginResult(result.body);
							} else {
								//실패시 에러메시지 처리
								layerPop.alert(result.msg.standMsg);
								return false;
							}
						}
					});
				} else {
					layerPop.alert("데이터 암호화 세션키가 만료되었습니다.<br/>다시 시도해 주세요.").then(function() {
						window.location.reload();
					});
				}
			});
		}
		/**
		 * @method rqeCellAthNo 휴대폰 인증번호 발급 요엋
		 * @return {[type]} [description]
		 */
		function rqeCellAthNo() {
			
			//동의여부 확인
			if (!$scope.layer.i_chk_termsP01 || !$scope.layer.i_chk_termsP02 || !$scope.layer.i_chk_termsP03 || !$scope.layer.i_chk_termsP04) {
				$scope.layer.i_chk_termsP_error = true;
				isValid = false;
			} else {
				$scope.layer.i_chk_termsP_error = false;
			}
			
			var isValid = true;
			//입력여부 체크
			if (!$scope.layer.i_jumin_b01 || $scope.layer.i_jumin_b01.length < 6 || document.getElementById('layer_i_jumin_b02').value.length < 7) {
				$scope.layer.i_jumin_b01_error = true;
				isValid = false;
			} else {
				$scope.layer.i_jumin_b01_error = false;
			}
			//통신사
			$scope.ccoDiv = $('#layer_i_mphone_type option:selected').val();
			log.out("통신사 = " + $scope.ccoDiv);
			//휴대폰번호 
			if (!$scope.layer.i_mphoneNumber || $scope.layer.i_mphoneNumber.length < 11 || !util.isMobile($scope.layer.i_mphoneNumber)) {
				$scope.layer.i_mphoneNumber_error = true;
				isValid = false;
			} else {
				$scope.layer.i_mphoneNumber_error = false;
			}
			//입력 성공 여부
			if (!isValid) {
				$timeout(function() {
					errorMthod();
				}, 10);
				return false;
			}
			//주민번호 키보드보안(가상키패드) 입력 복호화 처리
			var inputData = util.getInputEncData(['layer_i_jumin_b02'], document.getElementById("lyfrm"));
			log.out(inputData);
			//
			ajax.form("/solution/touchen/decode.do", inputData).then(function(ajaxRst) {
				log.out("키보드보안 복호화 결과 : ", ajaxRst);
				if(ajaxRst && ajaxRst.data && ajaxRst.data.result) {
					log.out("ajaxRst.data : ", ajaxRst.data);
					var pm = {
						iJuminB01: $scope.layer.i_jumin_b01, //주민번호 앞자리
						iJuminB02: ajaxRst.data.layer_i_jumin_b02, //주민번호 뒷자리 복호화 데이터 저장 세션키
						ccoDiv: $('#layer_i_mphone_type option:selected').val(), //통신사
						cellNo: $scope.layer.i_mphoneNumber, //휴대폰번호
						prevAuthCd: $scope.layer.prevAuthCd
					};
					log.out("rqeCellAthNo param info ", pm);
					http.post("f.cg.he.cm.mo.o.bc.LginBc.rqeCellAthNo", pm).then(function(result) {
						log.out(result);
						if (result) {
							//prcesResultDivCd 0 이면성공, 1 이면실패
							if (result.header && result.header.prcesResultDivCd == '0') {
								//인증발송 요청 성공
								$scope.layer.isRqeSmsAthNo = true;
								return true;
							} else {
								//실패시 에러메시지 처리
								layerPop.alert(result.msg.standMsg);
								return false;
							}
						}
					});
				} else {
					layerPop.alert("데이터 암호화 세션키가 만료되었습니다.<br/>다시 시도해 주세요.").then(function() {
						window.location.reload();
					});
				}
			});
		}
		/**
		 * @method lginCellAthNo 휴대폰 본인인증
		 */
		function lginCellAthNo() {
			
			//동의여부 확인
			if (!$scope.layer.i_chk_termsP01 || !$scope.layer.i_chk_termsP02 || !$scope.layer.i_chk_termsP03 || !$scope.layer.i_chk_termsP04) {
				$scope.layer.i_chk_termsP_error = true;
				isValid = false;
			} else {
				$scope.layer.i_chk_termsP_error = false;
			}
			
			//입력 체크
			var isValid = true;
			//인증번호 발송 요청 여부
			if (!$scope.layer.isRqeSmsAthNo) {
				if(!$scope.layer.i_jumin_b01 || $scope.layer.i_jumin_b01.length < 6 || document.getElementById('layer_i_jumin_b02').value.length < 7) {
					$scope.layer.i_jumin_b01_error = true;
				}
				if(!$scope.layer.i_mphoneNumber || $scope.layer.i_mphoneNumber.length < 11 || !util.isMobile($scope.layer.i_mphoneNumber)) {
					$scope.layer.i_mphoneNumber_error = true;
				}
				$timeout(function() {
					errorMthod();
				}, 10);
				layerPop.alert("인증번호 받기를 통해 인증번호를 요청해 주세요.");
				return false;
			}
			if (!$scope.layer.i_certiNum) {
				$scope.layer.i_certiNum_error = true;
				isValid = false;
			} else {
				$scope.layer.i_certiNum_error = false;
			}
			//동의여부 확인
			if (!$scope.layer.i_chk_termsP01 || !$scope.layer.i_chk_termsP02 || !$scope.layer.i_chk_termsP03) {
				$scope.layer.i_chk_termsP_error = true;
				isValid = false;
			} else {
				$scope.layer.i_chk_termsP_error = false;
			}
			//입력 결과
			if (!isValid) {
				$timeout(function() {
					errorMthod();
				}, 10);
				return false;
			}
			//
			var pm = {
				smsAthNo: $scope.layer.i_certiNum, //인증번호
				prevAuthCd: $scope.layer.prevAuthCd
			};
			log.out("rqeCellAthNo param info ", pm);
			http.post("f.cg.he.cm.mo.o.bc.LginBc.lginCellAthNo", pm).then(function(result) {
				log.out(result);
				if (result) {
					//prcesResultDivCd 0 이면성공, 1 이면실패
					if (result.header && result.header.prcesResultDivCd == '0') {
						//본인인증 성공여부 확인
						checkLoginResult(result.body);
					} else {
						//실패시 에러메시지 처리
						layerPop.alert(result.msg.standMsg);
						return false;
					}
				}
			});
		}
		/**
		 * @method checkLoginResult 
		 */
		function checkLoginResult(data) {
			//본인인증 성공여부 확인
			if (!data.athRst) {
				//본인인증 실패
				log.out("본인인증 실패 결과 코드 athFailCd = " + data.athFailCd);
				if (data.athFailCd == '1') {
					//미등록 공인인증서일 경우 - 인증서 등록 화면 이동
					//$scope.movePage('certificate');
					layerPop.alert("등록된 공인인증서가 없습니다.<br/>공인인증서를 등록 후 사용해 주세요.");
					return false;
				} else if (data.athFailCd == '2') {
					//전자금융거래 동의 오류, 전자금융거래 동의 팝업 화면 표시
					//공인인증서 등록시, 전자금융거래 회원 동의 체결함..
					layerPop.open("layerElcFncTrsc", "biz/cm/mo/lgin/lypop_elcFncTrsc", {}).then(function(result) {
						//callback
						log.out(result);
						if (result.result) {
							//전자금융거래 회원 저장 완료
							layerPop.alert("전자금융거래 계약 체결이 완료되었습니다.").then(function() {
								//세션 로그인 처리 및 화면 이동
								login();
							});
						}
					});
				} else if(data.athFailCd == '4') {
					//중복 로그인 오류 - 타시스템에 이미 로그인되어 있음
					//추가 인증이 필요함
					$scope.layer.prevAuthCd = data.prevAuthCd;
					layerPop.alert("확인하세요!<br/>이미 고객님의 정보로 로그인되어 있습니다.<br/>고객정보 보호를 위해 기존 정보를 로그아웃하고 새로 로그인하기 위해서는 추가 본인인증이 필요합니다.");
				}
			} else {
				//본인인증성공 후, 세션 로그인 처리 및 화면 이동
				login();
			}
		}
		/**
		 * @method login
		 */
		function login() {
			ajax.form("/certification-center/login.do", {}).then(function(result) {
				log.out(result);
				if(result.data.result) {
					$scope.layer.close(true);
				} else {
					layerPop.alert(result.data.msg);
				}
			});
		}

	}));

	/**
	 * @method 클래스명Controller
	 * @param {o} co - 공통컴포넌트
	 * @param {o}  - 스코프
	 */
	mz.comm.controller('layerElcFncTrscController', mz.mold(function(co, $scope) {
		var id = "layerElcFncTrsc";
		var log = co.get('logger').getLogger('layerElcFncTrscController');
		var http = co.get('http');
		var layerPop = co.get('layerPop');
		var $timeout = co.get('$timeout');
		var param = layerPop.getParam($scope);
		log.out("param info : ", param);
		//
		/* - init --------------------------------- */

		init();

		/* - public ------------------------------- */
		/**
		 * @method close
		 */
		$scope.close = function() {
			layerPop.close($scope, {
				result: false
			});
		};
		/**
		 * @method procAgree
		 */
		$scope.procAgree = function() {
			//동의여부 확인
			if (!$scope.chkAgree) {
				$scope.chkAgreeErr = true;
				return false;
			}
			var pm = param;
			//
			http.post("f.cg.he.cm.mo.o.bc.LginBc.registSimpleElcFncTrscAgrInf", pm).then(function(result) {
				log.out(result);
				if (result) {
					//prcesResultDivCd 0 이면성공, 1 이면실패
					if (result.header && result.header.prcesResultDivCd == '0') {
						//종료
						layerPop.close($scope, {
							result: true
						});
					} else {
						//실패시 에러메시지 처리
						layerPop.alert(result.msg.standMsg);
						return false;
					}
				}
			});
		};
		/* - private ------------------------------ */

		/**
		 * @method init - 초기화
		 */
		function init() {
			$timeout(function() {
				styleFormMethod();
			}, 400);
		}
	}));

})(angular, mz);