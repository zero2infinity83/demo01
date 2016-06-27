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

	// uiHeader
	mz.comm.directive('uiHeader', mz.mold(function() {
		var o = {};

		o.templateUrl = mz.path('/app/views/comm/uiHeader.tpl', true);

		o.controller = mz.mold(function(co, $scope) {
			var log = co.get('logger').getLogger('uiHeader');
			var layerPop = co.get('layerPop');
			var http = co.get('http');
			var location = co.get('location');
			var menuService = co.get("menuService");
			var path = co.get("path");
			var popup = co.get("popup");
			var util = co.get("util");
			var userSession = co.get("userSession");
			var pageId = path.getPageId();
			
			$scope.map = {};
			$scope.map.userInfo = {};			
			
			
			$scope.$on('event.session.chk', function( event, param ){				
				
				log.out("Event Session Check!" );
				
				userSession.loginChk().then(function(param){
					$scope.map.userInfo = param;					
				});
				
			});			
			
			/**
			 * @method execLogout - 로그아웃 실행
			 */			
			$scope.execLogout = function(){
				
				http.post('/biz/cm/co/user/logout', {}, false).then(function(result) {
					
					if( result.resCd == 0 )	$scope.map.userInfo = {};
					
				});
				
			}
			
			
			/**
			 * @method execLogin - 로그인 페이지로 이동
			 */
			$scope.execLogin = function(){
				location.go("/user/login.do", "", {});				
			}			
			
				
			/*
			var menu = _.filter(mz.menu, function(info) {
				return menuService.realMenuCheck(info, pageId);
			})[0];

			if (!_.isUndefined(menu)) {
				menuService.setGnb(util.trim(menu.path.split(">")[0]));

				//default title setting
				var pathnames = menu.pathname.split(">");
				var title = pathnames[pathnames.length - 1];
				document.title = title + " | 메리츠화재 다이렉트";
			}
			
			$scope.curGnbId = menuService.getGnbId();

			$scope.onOff = 'off';
			$scope.onOffMenu = function(){
				if($scope.onOff == 'off'){
					$scope.onOff = 'on';
					$('#ly_direct_cc').css('display','block');
				}else{
					$scope.onOff = 'off';
					$('#ly_direct_cc').css('display','none');
				}
			};
			*/
			
			/**
			 * 메뉴이동처리		
			 */
			/*
			$scope.moveMenu = function(menuId) {
				if(util.isNull(menuId)
				|| menuId == 0) {
					//메인 이동
					location.go("/main.do");
					return;
				}
				menuService.setGnb(menuId);
				var gnb = menuService.getGnb();
				if(gnb) {
					menuService.goMenu(gnb);
				} 
			};

			$scope.showDirect = function(menuId) {
				if(util.isNull(menuId) || menuId == 0) {
					location.go("/main.do");
					return;

				}
				$scope.onOff = 'off';
				// $('#ly_direct_cc').css('display','none');
				menuService.setGnb(menuId);
				var gnb = menuService.getGnb();
				popup.contract(gnb.linkUrl);
			};
			*/
		});

		return o;
	}));
	
	// uiSnb
	mz.comm.directive('uiSnb', mz.mold(function() {
		var o = {};
		o.templateUrl = mz.path('app/views/comm/uiSnb.tpl', true);
		o.controller  = mz.mold(function(co, $scope) {
			var log         = co.get('logger').getLogger('uiSnb');
			var http        = co.get('http');
			var location    = co.get('location');
			var menuService = co.get("menuService");
			var layerPop    = co.get('layerPop');
			var path        = co.get('path');
			var util        = co.get('util');
			
			//pageId를 이용해서 최상의 id를 찾는다.
			var pageId   = path.getPageId();
			var linkList = _.filter(mz.menu, function(info) { return menuService.realMenuCheck(info, pageId);});
			
			if(linkList.length == 0) {
				return false;
			}
			
			var lnb      = linkList[linkList.length - 1];
			var paths    = lnb.path.split(">");
			
			//부모 MENU가 FOOTER일 때 예외처리..
			if(paths[0] == '5185' 
		    || paths[0] == '5198') {
				paths = [paths[1]];
				$scope.gnbMenuNm = util.trim(lnb.pathname.split(">")[1]);
			} else {
				$scope.gnbMenuNm = util.trim(lnb.pathname.split(">")[0]);
			}
			
			//$scope.gnbMenuNm = util.trim(lnb.pathname.split(">")[0]);
			
			//1차 메뉴 세팅.
			menuService.setGnb(util.trim(paths[0]));
			
			
			if(paths.length == 2) {
				$scope.curLnbId  = util.trim(paths[1]); 
			} else if(paths.length == 3) {
				$scope.curLnbId  = util.trim(paths[1]);
				$scope.curSnbId  = util.trim(paths[2]);
			}
			
			//lnb setting
			   $scope.lnbs = _.sortBy(_.filter(mz.menu, function(info) {
			    return info.hgrkMenuIdn == menuService.getGnbId() && info.menuDivCd == '1';
			   }), function(info) {
			    return info.srtSq;
			   }); 

			   //snb setting
			   _.each($scope.lnbs, function(v, k) {
			    v["snbs"] = _.sortBy(_.filter(mz.menu, function(info) {
			     return v.menuIdn == info.hgrkMenuIdn && info.menuDivCd == '1';
			    }), function(info) {
			     return info.srtSq;
			    });
			   });


			$scope.moveLnbMenu = function(lnb) {
				$scope.curLnbId = lnb.menuIdn;
				menuService.goMenu(lnb);
			};
			
			$scope.moveSnbMenu = function(snb) {
				menuService.goMenu(snb);
			};
		});
		return o;
	}));

	// uiSnbLower
	mz.comm.directive('uiSnbLower', mz.mold(function(co) {
		var log = co.get('logger').getLogger('uiSnbFooter');
		var menuService = co.get("menuService");
		var path = co.get('path');

		var o = {};

		o.templateUrl = (function(){
			var lowerPath = mz.path('/views/comm/snbLower/0000.tpl', true);
			var pageId = path.getPageId();
			var list = _.filter(mz.menu, function(info) { return menuService.realMenuCheck(info, pageId);});
			var lnb = (list && list.pop());
			if(lnb){
				var menuId = lnb.path.split(">")[0];
				var url = mz.path('/views/comm/snbLower/'+menuId+'.tpl', true);
				$.ajax({
					url: url, type: 'GET', async: false, 
					success: function(data, status) {
						if(status == 'success') lowerPath = url;
					}
				});
			}
			return lowerPath;
		})();

		return o;
	}));

	// uiContents
	mz.comm.directive('uiContents', mz.mold(function() {
		return {
			templateUrl: mz.path('/app/views/comm/uiContents.tpl', true)
		};
	}));

	// uiFooter
	mz.comm.directive('uiFooter', mz.mold(function() {
		return {
			templateUrl: mz.path('/app/views/comm/uiFooter.tpl', true)
		};
		
		/**
		 * 메뉴이동처리		
		 */
		$scope.moveMenu = function(menuId) {
			if(util.isNull(menuId)
			|| menuId == 0) {
				//메인 이동
				location.go("/main.do");
				return;
			}
			menuService.setGnb(menuId);
			var gnb = menuService.getGnb();
			if(gnb) {
				menuService.goMenu(gnb);
			} 
		};
		
	}));
	
	mz.comm.directive('mzSelect', mz.mold(function(util) {
		return {
			scope: {
				list: "="
			},
			restrict: 'A',
			link: function(scope, elem, attr) {
				scope.$watch('list', function() {
					replaceSelect(elem);
				});
			}
		};
	}));

	mz.comm.directive('mzEnter', function() {
		return {
			restrict: "A",
			link: function(scope, elem, attrs) {
				elem.bind("keydown keypress", function(event) {
					if (event.which === 13) {
						scope.$apply(function() {
							scope.$eval(attrs.mzEnter);
						});
						event.preventDefault();
					}
				});
			}
		};
	});

	mz.comm.directive('numberMax', mz.mold(function(util) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attr, ctrl) {
				$(elem).on('keyup', function(e) {
					var val = $(this).val();
					if (util.parseInt(attr.numberMax) < val) {
						var prevVal = val.substring(0, val.length - 1);
						ctrl.$setViewValue(prevVal);
						ctrl.$render();
					}
				});
			}
		};
	}));

	mz.comm.directive('numberOnly', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "disabled")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							$(this).val($(this).val().replace(/[^0-9]/g, ""));
						}
					});
			}
		};
	});

	mz.comm.directive('alphaOnly', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "disabled")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							$(this).val($(this).val().replace(/[^A-z\s]/g, ""));
						}
					});
			}
		};
	});

	mz.comm.directive('hangulOnly', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "active")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							var reg = /[^가-힣ㄱ-ㅎㅏ-ㅣ\x20]/g;
							var val = $(this).val();

							if (reg.test(val)) {
								$(this).val(val.replace(reg, ""));
							}
						}
					});
			}
		};
	});

	mz.comm.directive('langOnly', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							var reg = /[0-9.~!@\#$%<>^&*\()\-=+_\'`\\\?]/g;
							var val = $(this).val();

							if (reg.test(val)) {
								$(this).val(val.replace(reg, ""));
							}
						}
					});
			}
		};
	});

	mz.comm.directive('emailOnly', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "disabled")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							$(this).val($(this).val().replace(/[^(A-z@.0-9)]/g, ""));
						}
					});
			}
		};
	});

	mz.comm.directive('disNumber', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.on('keyup', function(e) {
						$(this).val($(this).val().replace(/[^\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3A-z\s]/g, ""));
					});
			}
		};
	});

	mz.comm.directive('commaNumber', function(util) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							var tmp = $(this).val().replace(/[^0-9]/g, "");
							$(this).val(util.addCommas(tmp));
						}
					});
			}
		};
	});

	mz.comm.directive('telNo', mz.mold(function(util) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "disabled")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							$(this).val($(this).val().replace(/[^0-9]/g, ""));
						}
					})
					.on('focusin', function(e) {
						var that = $(this);
						setTimeout(function() {
							if (that.val() != that.attr("placeholder")) {
								that.attr("maxlength", "11").val(util.replaceAll(that.val(), "-", ""));
							}
						}, 200);
					})
					.on("focusout", function(e) {
						var that = $(this);
						setTimeout(function() {
							if (that.val() != that.attr("placeholder")) {
								that.attr("maxlength", "13").val(util.phoneFormat(that.val()));
							}
						}, 200);
					});
			}
		};
	}));

	mz.comm.directive('telMaxNo', mz.mold(function(util) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "disabled")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							$(this).val($(this).val().replace(/[^0-9]/g, ""));
						}
					})
					.on('focusin', function(e) {
						var that = $(this);
						setTimeout(function() {
							if (that.val() != that.attr("placeholder")) {
								that.attr("maxlength", "12").val(util.replaceAll(that.val(), "-", ""));
							}
						}, 200);
					})
					.on("focusout", function(e) {
						var that = $(this);
						setTimeout(function() {
							if (that.val() != that.attr("placeholder")) {
								that.attr("maxlength", "14").val(util.phoneFormat(that.val()));
							}
						}, 200);
					});
			}
		};
	}));
	
	mz.comm.directive('date', mz.mold(function(util) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem)
					.css("ime-mode", "disabled")
					.on('keyup', function(e) {
						if (1 < $(this).val().length) {
							$(this).val($(this).val().replace(/[^0-9]/g, ""));
						}
					})
					.on('focusin', function(e) {
						var that = $(this);
						setTimeout(function() {
							if (that.val() != that.attr("placeholder")) {
								that.val(util.replaceAll(that.val(), "-", "")).attr("maxlength", "8");
							}
						}, 200);
					})
					.on("focusout", function(e) {
						var that = $(this);
						setTimeout(function() {
							if (that.val() != that.attr("placeholder")) {
								var val = that.val();
								that.attr("maxlength", "10");
								if(val.length == 8) {
									that.val(val.substring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6));
								}
							}
						}, 200);
					});
			}
		};
	}));

	mz.comm.directive('searchAddr', mz.mold(function(util) {
		return {
			priority: 2,
			restrict: 'A',
			compile: function(element) {
				element.on('compositionstart', function(e) {
					e.stopImmediatePropagation();
				});
			}
		};
	}));

	mz.comm.directive('mzInputText', function() {
		return {
			require: 'ngModel',
			restrict: "A",
			link: function(scope, element, attrs, ctrl) {
				element.bind('compositionstart', function(e) {
					e.stopImmediatePropagation();
				});

				element.on('compositionupdate', function(e) {
					element.triggerHandler('compositionend');
				});
			}
		};
	});

	// uiConsReq
	mz.comm.directive('uiConsReq', mz.mold(function() {
		var o = {};
		o.templateUrl = mz.path('/views/comm/uiConsReq.tpl', true);
		o.controller = mz.mold(function(co, $scope) {
			var log = co.get('logger').getLogger('uiConsReq');
			var http = co.get('http');
			var util = co.get("util");
			var bind = co.get("bind");
			var layerPop = co.get("layerPop");
			var $timeout = co.get("$timeout");
			var mkt = co.get("mkt");
			var mktEvent = co.get('mktEvent');
			var mktTMEvent = co.get('mktTMEvent');
			
			var ctcMdiaNo = false;
			
			init();

			function init() {
				
				http.post('f.cg.de.co.cc.o.cco.ContractInfoCCo.getMktTMEvnt',{}, false).then(function(result) {
					log.out(result.body.ctcMdiaNo);
					if(result && result.body && ("TCA1604OD000001|TMI1604OD000001".indexOf(result.body.ctcMdiaNo) > -1)){
						$scope.csInfo.athNo = '';				
						$scope.csInfo.smsAth = true;
						$scope.csInfo.ctcMdiaNo = true;		
												
						ctcMdiaNo = true;
						
						$('.bx_mydirect').addClass('new_access');
					}
				});
				
				$scope.csPdCd = $("[data-ui-cons-req]").attr("pdCd");
				$scope.csCmCnsTpCd = $("[data-ui-cons-req]").attr("cmCnsTpCd");
				$scope.isBusiness = $("[data-ui-cons-req]").attr("isBusiness");
				$scope.csValid = getValid();
				if ($scope.isBusiness) {
					$scope.csValid.csBusiness.valid = true;
					$scope.csValid.csBirth.valid = false;
				}
				$scope.csInfo = {};

				retrieveDriAmt();
				$timeout(function() {
					styleFormMethod();

					/**
					 * 날짜선택에 따른 상담시간 선택가능 값 설정
					 */
					bind.select($scope, "csReqDate");

					$(document.body).on('change',"#csReqDate",function (e) {
						   var optVal= $("#csReqDate option:selected").val();
						   $scope.csReqDate = optVal;
						   isNowInit();
					});
				}, 400);
				
				$scope.csInfo.ctcMdiaNo = false;
				
				if($scope.csPdCd == '60778'){
					$scope.mzcode = 'mz140';
				}else if($scope.csPdCd == '60782'){
					$scope.mzcode = 'mz150';
				}
			}
			
			
			//핸드폰유효성체크
			//인증번호 요청
			$scope.requestAthNo = function(){
				var param = {};
				param.cusNm = $scope.csInfo.csName;
				param.cellSnoDect = $scope.csInfo.csPhone;
				var phoneArray = $scope.getPhoneNumArray($scope.csInfo.csPhone);
				param.cellSno = {	// 업무당사자유무선연락처정보
				    telNatlCd: "82",		// 전화국가코드
				    arCcoCd: phoneArray[0],	// 지역통신사코드
				    telofNo: phoneArray[1],	// 전화국번호
				    telSno: phoneArray[2]	// 전화일련번호
			  	}
				param.crtDiv = 'TM';		
				
				$scope.csValid.athNo.valid = false;
				
				if($scope.csValidation()){
					$scope.csInfo.smsAth = false;
					http.post('f.cg.de.pd.ph.o.bc.CertifyPhoneBc.createAthNo', param).then(function(result) {
						log.out("인증번호 =",result.body.athReqNo);
						layerPop.alert('인증번호 발송을 요청하였습니다.<br/>잠시 후 휴대폰 문자를 확인해 주세요.');
					});
				}
			}
			
			//본인 인증 확인
			$scope.selfAthCnf = function(){
				var athNo = $scope.csInfo.athNo;
				var athNoChk = /^(\d{4})$/.test(athNo);
				var param = {};
				param.cusNm = $scope.csInfo.csName;
				param.cellSnoDect = $scope.csInfo.csPhone;
				param.athReqNo = $scope.csInfo.athNo;
				
				var phoneArray = $scope.getPhoneNumArray($scope.csInfo.csPhone);
				param.cellSno = {	// 업무당사자유무선연락처정보
				    telNatlCd: "82",		// 전화국가코드
				    arCcoCd: phoneArray[0],	// 지역통신사코드
				    telofNo: phoneArray[1],	// 전화국번호
				    telSno: phoneArray[2]	// 전화일련번호
			  	}
				
				$scope.csValid.athNo.valid = true;
				
				if($scope.csValidation()&&athNo&&athNoChk){
					http.post('f.cg.de.pd.ph.o.bc.CertifyPhoneBc.requestAth', param).then(function(result) {
						log.out("본인 확인",result.body.athNoCnf);
						if(result.body.athNoCnf == "Y"){
							log.out("본인 확인 성공 ",result);

							mktEvent['I1TM']({
						        mzcode: $scope.mzcode,
						        gndrcd : $("[name=ccSex]:checked").val(),
						        rsId :  $scope.csInfo.csPhone,
						        cusNm : $scope.csInfo.csName,
						        birth : $scope.csInfo.csBirth						        
						    });
							
							//입력정보 인입							
							mkt.log(function(){mkt['3010']({cmCnnAthTpCd:'1'});});			    						    						    												
							
							layerPop.open('lypop_privacyInq', 'biz/pd/pd/comm/lypop_privacyInq').then(function(result) {
								if (result.code) {
																		
									var param = {};
									param.birth = $scope.csInfo.csBirth;
									http.post('f.cg.de.pd.ph.o.bc.CertifyPhoneBc.getTMAge', param).then(function(result){
										log.out(result.body.age);											
										if(result.body.age < 30){
											$scope.TMEvent = '1111';
											
											registInetCns();
										}else{
											//TM 참여여부및 포인트 발송
											mktTMEvent.C1TM({
												mzcode : $scope.mzcode,
												rsId : $scope.csInfo.csPhone,
												cusNm : $scope.csInfo.csName,
												birth : $scope.csInfo.csBirth
											}).then(function(result){
												log.out(result);																											
												$scope.TMEvent = result;
												
												registInetCns();
											});
										}
									});																											
								}
							});																				
						}else{
							log.out("인증번호 오류",result);
							layerPop.alert('인증번호 오류.');
						}
						
					})
				}
			}
			
			$scope.getPhoneNumArray = function (phoneNumStr){		
				return String(phoneNumStr).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3").split('-');
			}								

			/**
			 * 시간 설정 
			 */
			function isNowInit() {
				if ($scope.csReqDate == $scope.today) {
					$scope.isNow = true;
				} else {
					$scope.isNow = false;
				}
				$timeout(function() {
					replaceSelect($("#csReqTime"));
				}, 100);
			}
			$scope.isShowTime = function(t) {
				if ($scope.csReqDate != $scope.today) {
					return true;
				} else {
					if ($scope.currentTime < t) {
						return true;
					} else {
						return false;
					}
				}
			}

			$timeout(function() {
				replaceSelect($("#csReqDate"));
				replaceSelect($("#csReqTime"));
				styleFormMethod();
			}, 400);
			
			/**
			 * @method retrieveDriAmt - 상담희망일시
			 */
			function retrieveDriAmt() {
				http.post("f.cg.he.ct.ts.o.bc.InetCnsBc.cmClasTypCdSlzDdMngInq", {}).then(function(result) {
					if (result) {
						if (result.header && result.header.prcesResultDivCd == '0') {
							if (!util.resultMsg(result)) {
								return false;
							}
							var body = result.body;
							$scope.today = result.body.today;
							$scope.currentTime = parseInt(result.body.currentTime.substr(0, 2));
							$scope.cmDay = _.filter(util.getListData(body.slzDdLst.row), function(o) {
								return o.holiDivCd === '2';
							}).slice(0, 4);
							$scope.csReqDate = $scope.cmDay[0].dt;
							
							if ($scope.csReqDate == $scope.today && $scope.currentTime >= 18) {
								$scope.cmDay = $scope.cmDay.slice(1, 4);
								$scope.csReqDate = $scope.cmDay[0].dt;
							}
							isNowInit();
							replaceSelect($("#csReqDate"));
						}
					}
					$timeout(function() {
						styleFormMethod();
					}, 100);
				});
			}

			/**
			 * @method registInetCns - 상담신청
			 */
			function registInetCns() {

				var pm = {
					cmCnsParentTpCd: '2101', //상담유형대분류
					cmCnsTpCd: $scope.csCmCnsTpCd, //상담유형소분류
					cmCnsParentTpNm: '보험가입',
					pdCd: $scope.csPdCd, //상품코드
					cmReplyMdCd: '2', //상담방법(1:이메일, 2:전화)
					cmTelDivCd: '23', //전화구분(23:휴대전화, 21:자택, 22:직장)
					telNo: util.phoneFormat($scope.csInfo.csPhone),
					rqeDt: $("#csReqDate option:selected").val(), //요청일시(yyyyMMdd)
					ctcPsbStTm: $("#csReqTime option:selected").val(), //요청시작시간
					ctcPsbEdTm: '', //요청종료시간
					pdNm: util.trim($(".top_tit ").text()), //상품명
					cnsCon: util.trim($(".top_tit ").text()), //내용
					sndTMDivCd: '1', //TM전송여부
					cusNm: $scope.csInfo.csName, // 고객명
					cnsScrPath : 'S',      
					allianGb:'4', //상담신청
					dbTypId:'2', //산출/상담 구분==>1:산출,2:상담
					cmpAsgnMthd:'P'
				};
				if ($scope.csInfo.csBirth != null && $scope.csInfo.csBirth != '') {
					pm.rsIdNo = $scope.csInfo.csBirth.substr(2, 6) + $("[name=csSex]:checked").val() + "000000";
				} else {
					pm.rsIdNo = "000000" + $("[name=csSex]:checked").val() + "000000";
				}

				if (pm.cmCnsTpCd == "2102") {
					pm.cmCnsTpNm = "자동차";
				} else if (pm.cmCnsTpCd == "2103") {
					pm.cmCnsTpNm = "운전자/건강/어린이";
				} else if (pm.cmCnsTpCd == "2104") {
					pm.cmCnsTpNm = "연금/저축";
				} else if (pm.cmCnsTpCd == "2105") {
					pm.cmCnsTpNm = "화재/생활";
				}
				if ($scope.isBusiness) {
					pm.cnsCon = util.trim($(".top_tit ").text()) + " " + $("#csBusiness").val();
				}
				
				//매체 이벤트 유입경로 > CM:카테고리이관
				if(ctcMdiaNo) pm.accountDvCd = 'CM';
				 
				http.post("f.cg.he.ct.ts.o.bc.InetCnsBc.registInetCns", pm).then(function(result) {			
					log.out(result.body.SMS.con);
					if (result) {
						//alert("여기에 상담신청가입시도");
						//mkt log 가입시도
						mkt.log(function(){	mkt['3090']({});	});
						
						if (result.header && result.header.prcesResultDivCd == '0') {
							
							if($scope.csPdCd!='71501'){//다이렉트 자동차보험(TM) 이벤트 제외
								//TM 이벤트 결과
								pm.rsEvent = $scope.TMEvent;
							}else{
								pm.rsEvent = "";
							}
							
							$scope.inqComplete(pm);
						} else {
							layerPop.alert(result.msg.standMsg);
						}
					}
					$timeout(function() {
						styleFormMethod();
					}, 100);
				});									
			}

			// 상담신청완료
			$scope.inqComplete = function(item) {
				layerPop.open('lypop_pdInquiry', 'biz/pd/pd/comm/lypop_pdInquiry', item).then(function(result) {
					//$route.reload();
					closeCsEvents();
				});
			};

			// 상담예약신청
			$scope.reservation = function() {
				if ($scope.csValidation()) {
					//alert("역기에 상담신청고객정보")
					mkt.log(function(){mkt['3010']({cmCnnAthTpCd:'1'});});
					layerPop.open('lypop_privacyInq', 'biz/pd/pd/comm/lypop_privacyInq').then(function(result) {
						if (result.code) {
							registInetCns();
						}
					});
				}
			};

			/**
			 * Validation
			 */
			function getValid() {
				var valid = {
					csName: {
						error: false,
						msg: '이름을 정확히 입력하세요.',
						select: false,
						valid: true
					},
					csBirth: {
						error: false,
						msg: '생년월일을 정확히 입력하세요.',
						select: false,
						valid: true
					},
					csBusiness: {
						error: false,
						msg: '업종을 선택하세요.',
						select: true,
						valid: false
					},
					csPhone: {
						error: false,
						msg: '연락처를 정확히 입력하세요.',
						select: false,
						valid: true
					},
					athNo: {
						error: false,
						msg: '인증번호를 정확히 입력하세요',
						valid: false
					}
				};
				return valid;
			}

			$scope.csValidation = function($event) {
				var isAll = true;
				if ($event) {
					isAll = false;
				}
				var validResult = true;
				if (!isAll) {
					validResult = valid($event.currentTarget);
				} else {
					var resArr = new Array();
					var sr = true;
					_.each($scope.csValid, function(v, k) {
						if (v.valid) {
							if (sr) {
								sr = valid('#' + k);
								resArr.push(sr);
								if (!sr) {
									alert(v.msg);
								}
							}
						}
					});
					if (_.contains(resArr, false)) {
						validResult = false;
					}
				}

				$timeout(function() {
					errorMthod();
				}, 50);

				function valid(target) {
					var elem = $(target);
					var id = elem.attr("id");
					var val;

					/**
					 * 셀렉트 박스 처리
					 */
					if ($scope.csValid[id].select) {
						val = elem.val();
					} else {
						val = $scope.csInfo[id];
					}

					var result = true;
					if (_.isUndefined(val) || _.isNull(val) || val == '') {
						$scope.csValid[id].error = true;
						result = false;
					} else {
						$scope.csValid[id].error = false;
						if ('csBirth' == id && !util.isDate(val)) {
							$scope.csValid[id].error = true;
							result = false;
						} else if ('csPhone' == id && (!util.isNumeric(val) || !util.isRangeLength(val, 9, 11))) {
							$scope.csValid[id].error = true;
							result = false;
						} else if ('csAgree1' == id && !elem.prop('checked')) {
							$scope.csValid[id].error = true;
							result = false;
						} else if ('csAgree2' == id && !elem.prop('checked')) {
							$scope.csValid[id].error = true;
							result = false;
						} else if ('athNo' == id && (!util.isNumeric(val) || !util.isRangeLength(val, 4, 4))){
							$scope.csValid[id].error = true;
							result = false;
						}
					}
					return result;
				}

				return validResult;
			};
		});
		return o;
	}));

	// uiInsCalc
	mz.comm.directive('uiInsCalc', mz.mold(function() {
		
		var o = {};
		o.templateUrl = mz.path('/views/comm/uiInsCalc.tpl', true);
		o.scope = {
			pdCd: '@pdCd',
			cmCntTpCd: '@cmCntTpCd',
			callback: '&callback'
		};
		o.controller = mz.mold(function(co, $scope) {
			var log = co.get('logger').getLogger('uiInsCalc');
			var http = co.get('http');
			var util = co.get("util");
			var layerPop = co.get("layerPop");			
			var $timeout = co.get("$timeout");
			var mkt = co.get("mkt");
			var mktEvent = co.get('mktEvent');
			var mktTMEvent = co.get('mktTMEvent');
			
			var ctcMdiaNo = false;
			
			init();

			function init() {
				http.post('f.cg.de.co.cc.o.cco.ContractInfoCCo.getMktTMEvnt',{}, false).then(function(result) {
					log.out(result.body.ctcMdiaNo);
					if(result && result.body && ("TCA1604OD000001|TMI1604OD000001".indexOf(result.body.ctcMdiaNo) > -1)){
						$scope.ccInfo.athNo = '';				
						$scope.ccInfo.smsAth = true;
						$scope.ccInfo.ctcMdiaNo = true;		
												
						ctcMdiaNo = true;
						
						$('.bx_mydirect').addClass('new_access');
					}
				});

				$scope.ccPdCd = $("[data-ui-ins-calc]").attr("pdCd");
				$scope.ccCmCnsTpCd = $("[data-ui-ins-calc]").attr("cmCnsTpCd");
				$scope.ccValid = getValid();				
				$scope.ccInfo = {};
				$timeout(function() {
					styleFormMethod();
				}, 400);
				
				$scope.ccInfo.ctcMdiaNo = false;
				
				if($scope.ccPdCd == 'APS'){
					$scope.mzcode = 'mz140';
				}else if($scope.ccPdCd == 'CI'){
					$scope.mzcode = 'mz150';
				}
			}
			
			
			//핸드폰유효성체크
			//인증번호 요청
			$scope.requestAthNo = function(){
				var param = {};
				param.cusNm = $scope.ccInfo.ccName;
				param.cellSnoDect = $scope.ccInfo.ccPhone;
				var phoneArray = $scope.getPhoneNumArray($scope.ccInfo.ccPhone);
				param.cellSno = {	// 업무당사자유무선연락처정보
				    telNatlCd: "82",		// 전화국가코드
				    arCcoCd: phoneArray[0],	// 지역통신사코드
				    telofNo: phoneArray[1],	// 전화국번호
				    telSno: phoneArray[2]	// 전화일련번호
			  	}
				param.crtDiv = 'TM';		
				
				$scope.ccValid.athNo.valid = false;
				
				if($scope.ccValidation()){
					$scope.ccInfo.smsAth = false;
					http.post('f.cg.de.pd.ph.o.bc.CertifyPhoneBc.createAthNo', param).then(function(result) {
						log.out("인증번호 =",result.body.athReqNo);
						layerPop.alert('인증번호 발송을 요청하였습니다.<br/>잠시 후 휴대폰 문자를 확인해 주세요.');
					});
				}
			}
			
			//본인 인증 확인
			$scope.selfAthCnf = function(){
				var athNo = $scope.ccInfo.athNo;
				var athNoChk = /^(\d{4})$/.test(athNo);
				var param = {};
				param.cusNm = $scope.ccInfo.ccName;
				param.cellSnoDect = $scope.ccInfo.ccPhone;
				param.athReqNo = $scope.ccInfo.athNo;
				
				var phoneArray = $scope.getPhoneNumArray($scope.ccInfo.ccPhone);
				param.cellSno = {	// 업무당사자유무선연락처정보
				    telNatlCd: "82",		// 전화국가코드
				    arCcoCd: phoneArray[0],	// 지역통신사코드
				    telofNo: phoneArray[1],	// 전화국번호
				    telSno: phoneArray[2]	// 전화일련번호
			  	}
				
				$scope.ccValid.athNo.valid = true;
				
				if($scope.ccValidation()&&athNo&&athNoChk){
					http.post('f.cg.de.pd.ph.o.bc.CertifyPhoneBc.requestAth', param).then(function(result) {
						log.out("본인 확인",result.body.athNoCnf);
						if(result.body.athNoCnf == "Y"){
							log.out("본인 확인 성공 ",result);

							mktEvent['I1TM']({
						        mzcode: $scope.mzcode,
						        gndrcd : $("[name=ccSex]:checked").val(),
						        rsId :  $scope.ccInfo.ccPhone,
						        cusNm : $scope.ccInfo.ccName,
						        birth : $scope.ccInfo.ccBirth						        
						    });
							
							//입력정보 인입							
							mkt.log(function(){mkt['3010']({cmCnnAthTpCd:'1'});});			    						    						    												
							
							layerPop.open('lypop_privacyInsur', 'biz/pd/pd/comm/lypop_privacyInsur').then(function(result) {
								if (result.code) {
									
									var param = {};
									param.birth = $scope.ccInfo.ccBirth;
									http.post('f.cg.de.pd.ph.o.bc.CertifyPhoneBc.getTMAge', param).then(function(result){
										log.out(result.body.age);											
										if(result.body.age < 30){
											$scope.TMEvent = '1111';
											
											retrieveInsCalc();
										}else{
											//TM 참여여부및 포인트 발송
											mktTMEvent.C1TM({
												mzcode : $scope.mzcode,
												rsId : $scope.ccInfo.ccPhone,
												cusNm : $scope.ccInfo.ccName,
												birth : $scope.ccInfo.ccBirth
											}).then(function(result){
												log.out(result);																												
												$scope.TMEvent = result;
												
												retrieveInsCalc();
											});	
										}
									});																											
								}
							});																				
						}else{
							log.out("인증번호 오류",result);
							layerPop.alert('인증번호 오류.');
						}
						
					})
				}
			}
			
			$scope.getPhoneNumArray = function (phoneNumStr){		
				return String(phoneNumStr).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3").split('-');
			}

			/**
			 * @method retrieveInsCalc - 계산
			 */
			function retrieveInsCalc() {
				var pm = {
					pdCd: $scope.ccPdCd, //상품코드
					gender: $("[name=ccSex]:checked").val(),
					birthday: $scope.ccInfo.ccBirth
				};
				http.post("f.cg.he.pd.pd.o.bc.InsCalcBc.insCalc", pm).then(function(result) {
					if (result) {
						//prcesResultDivCd 0 이면성공, 1 이면실패
						if (result.header && result.header.prcesResultDivCd == '0') {
							if (result.body.isPossible) {
								$scope.callback && $scope.callback({
									data: {
										result: true,
										name: $scope.ccInfo.ccName,
										amount: result.body.amount,
										
										//TM 이벤트 결과
										rsEvent : $scope.TMEvent
									}
								});
								premInetCns(result);
							} else {
								if (result.body.amount == '0' && result.body.isPdCd) {
									layerPop.alert("만 " + result.body.minAge + "~" + result.body.maxAge + "세 까지만 가입가능합니다.");
								} else {
									layerPop.alert("데이터가 없습니다.");
								}
							}
						} else {
							//실패시 에러메시지 처리
							layerPop.alert(result.msg.standMsg);
							return false;
						}
					}
				});
			}

			function premInetCns(result) {
				
				var amount = result.body.amount;
				var pm = {
					cmCnsParentTpCd: '2101', //상담유형대분류
					cmCnsTpCd: $scope.ccCmCnsTpCd, //상담유형소분류
					cmCnsParentTpNm: '보험가입',
					pdCd: $scope.ccPdCd, //상품코드
					cmReplyMdCd: '', //상담방법(1:이메일, 2:전화)
					cmTelDivCd: '23', //전화구분(23:휴대전화, 21:자택, 22:직장)
					telNo: util.phoneFormat($scope.ccInfo.ccPhone),
					rqeDt:'', //요청일시(yyyyMMdd)
					ctcPsbStTm: '', //요청시작시간
					ctcPsbEdTm: '', //요청종료시간
					pdNm: util.trim($(".top_tit ").text()), //상품명
					cnsCon: "[계산된보험료] " + result.body.amount + "원", //내용
					sndTMDivCd: '1', //TM전송여부
					cusNm: $scope.ccInfo.ccName, // 고객명
					cnsScrPath : 'S',     
					allianGb:'5', //5:산출,4:상담
					dbTypId:'1', //산출/상담 구분==>1:산출,2:상담
					cmpAsgnMthd:'P'
					};
				
				var ccSex = '';
				if( $("[name=ccSex]:checked").val() =='M'){
					ccSex = '1';
				}else if($("[name=ccSex]:checked").val() =='F'){
					ccSex = '2';
				}
				
				if ($scope.ccInfo.ccBirth != null && $scope.ccInfo.ccBirth != '') {
					pm.rsIdNo = $scope.ccInfo.ccBirth.substr(2, 6) + ccSex + "000000";
				} else {
					pm.rsIdNo =  "000000" + ccSex + "000000";
				}

				if (pm.cmCnsTpCd == "2102") {
					pm.cmCnsTpNm = "자동차";
				} else if (pm.cmCnsTpCd == "2103") {
					pm.cmCnsTpNm = "운전자/건강/어린이";
				} else if (pm.cmCnsTpCd == "2104") {
					pm.cmCnsTpNm = "연금/저축";
				} else if (pm.cmCnsTpCd == "2105") {
					pm.cmCnsTpNm = "화재/생활";
				}
				
				//매체 이벤트 유입경로 > CM:카테고리이관
				if(ctcMdiaNo) pm.accountDvCd = 'CM';
				
				
				//상담신청및 접속정보저장
				http.post("f.cg.he.ct.ts.o.bc.InetCnsBc.premInetCns", pm).then(function(result) {
					//alert("요기에 보험료계산 - 보험료계산 남김");
					log.out(result.body.SMS.con);
					if (result) {
						if (result.header && result.header.prcesResultDivCd == '0') {
							//mkt log
							mkt.log(function(){
								mkt['3080']({
									pyPrem : amount 
								});
							});
							log.out("premInetCns success");
							
						} else {
							//layerPop.alert(result.msg.standMsg);
							log.out("premInetCns fail");
						}
					}
					$timeout(function() {
						styleFormMethod();
					}, 100);
				});
			}
			
			// 계산신청
			$scope.calculation = function() {
				if ($scope.ccValidation()) {
					
					//alert("요기에 보험료계산 - 고객정보로그 남김");
					// mkt log
					mkt.log(function(){mkt['3010']({cmCnnAthTpCd:'1'});});
					
					layerPop.open('lypop_privacyInsur', 'biz/pd/pd/comm/lypop_privacyInsur').then(function(result) {
						if (result.code) {							
							retrieveInsCalc();
						}
					});
				}
			};

			/**
			 * Validation
			 */
			function getValid() {
				var valid = {
					ccName: {
						error: false,
						msg: '이름을 정확히 입력하세요.',
						valid: true
					},
					ccBirth: {
						error: false,
						msg: '생년월일을 정확히 입력하세요.',
						valid: true
					},
					ccPhone: {
						error: false,
						msg: '연락처를 정확히 입력하세요.',
						valid: true
					},
					athNo: {
						error: false,
						msg: '인증번호를 정확히 입력하세요',
						valid: false
					}
				};
				return valid;
			}

			$scope.ccValidation = function($event) {
				var isAll = true;
				if ($event) {
					isAll = false;
				}
				var validResult = true;
				if (!isAll) {
					validResult = valid($event.currentTarget);
				} else {
					var resArr = new Array();
					var sr = true;
					_.each($scope.ccValid, function(v, k) {
						if(v.valid){
							if (sr) {
								sr = valid('#' + k);
								resArr.push(sr);
								if (!sr) {
									alert(v.msg);
								}
							}
						}
					});
					if (_.contains(resArr, false)) {
						validResult = false;
					}
				}

				$timeout(function() {
					errorMthod();
				}, 50);

				function valid(target) {
					var elem = $(target);
					var id = elem.attr("id");
					var val = $scope.ccInfo[id];
					
					var result = true;
					if (_.isUndefined(val) || _.isNull(val) || val == '') {
						$scope.ccValid[id].error = true;
						result = false;
					} else {
						$scope.ccValid[id].error = false;
						if ('ccBirth' == id && !util.isDate(val)) {
							$scope.ccValid[id].error = true;
							result = false;
						} else if ('ccPhone' == id && (!util.isNumeric(val) || !util.isRangeLength(val, 9, 11))) {
							$scope.ccValid[id].error = true;
							result = false;
						} else if ('ccAgree1' == id && !elem.prop('checked')) {
							$scope.ccValid[id].error = true;
							result = false;
						} else if ('ccAgree2' == id && !elem.prop('checked')) {
							$scope.ccValid[id].error = true;
							result = false;
						} else if ('athNo' == id && (!util.isNumeric(val) || !util.isRangeLength(val, 4, 4))){
							$scope.ccValid[id].error = true;
							result = false;
						}
					}
					return result;
				}

				return validResult;
			};
		});
		return o;
	}));

	// uiEcrmPd
	mz.comm.directive('uiEcrmPd', mz.mold(function() {
		var o = {};
		o.templateUrl = mz.path('/views/comm/uiEcrmPd.tpl', true);
		o.scope = {
			dpId: '@dpId'
		};
		o.controller = mz.mold(function(co, $scope) {
			var log = co.get('logger').getLogger('uiEcrmPd');
			var http = co.get('http');
			var location = co.get('location');
			var $sce = co.get('$sce');
			var $window = co.get('$window');
			//
			$scope.ecrm = {};
			init();

			$scope.ecrm.showPdInfo = function(item) {
				log.out("showPdInfo click !!", item);
				//click event 전송
				transferEcrmLog(item);
				//환경에 따라 화면 이동
				if ('M' === mz.device[0]) {
					//mobile
					if (item.prdUrlMob) {
						log.out("prdUrlMob = " + item.prdUrlMob);
						$window.open(item.prdUrlMob);
					}
				} else {
					//PC
					if (item.prdUrlWeb) {
						log.out("prdUrlWeb = " + item.prdUrlWeb);
						$window.open(item.prdUrlWeb);
					}
				}
			};

			function init() {
				$scope.ecrm.cusNm = "";
				$scope.ecrm.dpType = '1'; //상품 disp type 초기값(1, 2)
				$scope.ecrm.dpList = new Array();

				retriveEcrmRcmPdInf();
			}

			function retriveEcrmRcmPdInf() {
				var pcid = $window.n_GetCookie('PCID', false)
				var pm = {
					dp: $scope.dpId,
					pcid: pcid
					//cusId: '10021940018' //test
				};
				http.post("f.cg.he.co.cc.o.bc.ECrmRcmBc.recommend", pm).then(function(result) {
					log.out(result);
					if (result) {
						//prcesResultDivCd 0 이면성공, 1 이면실패
						if (result.header && result.header.prcesResultDivCd == '0') {
							if (result.body.status == "Success") {
								//var dpList = result.body.dpList;
								//log.out(dpList);
								$scope.ecrm.cusNm = result.body.cusNm;
								log.out($scope.ecrm.cusNm);
								
								if(result.body.dpList && result.body.dpList.dps[0] && result.body.dpList.dps[0].itemList
										&& result.body.dpList.dps[0].itemList.items){
								
									var itemList = result.body.dpList.dps[0].itemList.items;
									_.each(itemList, function(item) {
										log.out(item);
										var dpItem = {
											clickUrl: item.clickUrl,
											itemValue: _.find(item.basisInfo.basisList, function(n) {
												return n.key == "ITEM_VALUE";
											}).value,
											itemName: _.find(item.basisInfo.basisList, function(n) {
												return n.key == "ITEM_NAME";
											}).value,
											dpType: _.find(item.basisInfo.basisList, function(n) {
												return n.key == "DP_TYPE";
											}).value,
											prdDesc: $sce.trustAsHtml(_.find(item.basisInfo.basisList, function(n) {
												return n.key == "PRD_DESC";
											}).value),
											dispPrdNm: _.find(item.basisInfo.basisList, function(n) {
												return n.key == "DISP_PRD_NM";
											}).value,
											prdUrlWeb: _.find(item.basisInfo.basisList, function(n) {
												return n.key == "PRD_URL_WEB";
											}).value,
											prdUrlMob: _.find(item.basisInfo.basisList, function(n) {
												return n.key == "PRD_URL_MOB";
											}).value
										};
										log.out(dpItem);
										$scope.ecrm.dpType = dpItem.dpType;
										$scope.ecrm.dpList.push(dpItem);
									});
								}
							}
						}
					}
				});
			}
			/**
			 * 클릭시, ecrm log 전송
			 */
			function transferEcrmLog(pm) {
				//wiselog.ecrmClickLogging(pm.clickUrl);
				$.ajax({
					url : pm.clickUrl,
					dataType: "jsonp"
				});
			}
		});
		return o;
	}));
	
	mz.comm.directive('faqList', mz.mold(function() {
		var o = {};
		
		o.templateUrl = mz.path('/views/comm/faqList.tpl', true);
		
		o.scope = {
			ntbdIdn: '@ntbdIdn',
			vdeoEscCon: '@vdeoEscCon'
		};
		
		o.controller = mz.mold(function(co, $scope) {
			var log      = co.get('logger').getLogger('faqList');
			var location = co.get('location');
			var util     = co.get("util"); 
			var http     = co.get('http');
			var $sce     = co.get('$sce');
			var $timeout = co.get('$timeout');
			
			init();
			
			
			$scope.openFaq = function() {
				location.go('/customer-center/faq.do');
			};
			$scope.getTrustAsHtml = function(html){
				return $sce.trustAsHtml(html);
			};
			
			function pdFaqList() {
				var pm = {
					vdeoesccon : $scope.vdeoEscCon || '',
					ntbdidn : $scope.ntbdIdn  //faq게시판 구분코드
				};
				
				log.out("pdFAqList param ########", pm);
				
				http.post('f.cg.he.ct.tq.o.bc.FaqBc.pdFaqList', pm, false).then(function(result) {
					log.out(result);
					if(result) {
						if(result.header && result.header.prcesResultDivCd == '0') {
							//success
							$scope.faqFreList = util.getListData(result.body.list);
							for(var i=0 ; i < $scope.faqFreList.length; i++) {
								$scope.faqFreList[i].dtl = util.replaceAll($scope.faqFreList[i].dtl, '\n', '<br>');
								$scope.faqFreList[i].dtl = util.replaceAll($scope.faqFreList[i].dtl, ' ', '&nbsp;');
							}
							
							$timeout(function() {
								//accordionMethod();
							}, 200);
						}
					}
				});
			}
			
			function init() {
				pdFaqList();
			}
		});
		
		return o;
	}));
	
	//상품 promotion event
	mz.comm.directive('uiProdEvent', mz.mold(function() {
		var o = {};
		
		o.templateUrl = mz.path('/views/comm/uiProdEvent.tpl', true);
		
		o.controller = mz.mold(function(co, $scope) {
			var log      = co.get('logger').getLogger('uiProdEvent');
			
			init();
			
			function init() {
				log.out("상품 promotion event directive");
			}
		});
		
		return o;
	}));
	
})(angular, mz);