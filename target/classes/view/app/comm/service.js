(function(angular, mz) {

	//상품 약관 파일 다운로드
	mz.comm.service('pdClusPdf', mz.mold(function(logger, http, util, fileUtil, layerPop) {
		var log = logger.getLogger('pdClusPdf');	
		var o = {};
		//약관 파일 다운로드
		o.downPdClus = function(pdCd) {
			log.out("pdCd = " + pdCd);
			if(util.isEmpty(pdCd)) {
				layerPop.alert("상품 코드를 확인해 주세요.");
				return false;
			}
			http.post("f.cg.he.ct.tm.o.bc.CtrCnfBc.retrievePdfFileLst", {pdCd : pdCd}).then(function(result) {
				if (result) {
					if (result.header && result.header.prcesResultDivCd == '0') {
						var isDown = false;
//						6102	6101	1	CM_ATC_FILE_CTG_CD		약관	   
//						6103	6101	2	CM_ATC_FILE_CTG_CD		상품요약서	   
//						6104	6101	3	CM_ATC_FILE_CTG_CD		사업방법서	 
						for(var i=0 ; i<result.body.pdfList.length ; i++) {
							var item = result.body.pdfList[i];
							if('6102' == item.cmAtcFileCtgCd){
					    		isDown = true;
					    		fileUtil.pdfDownload('/hp/fileDownload.do', {
					    			path: util.getCrytoData(item, "atcFilePthNm"),
					    			id: util.getCrytoData(item, "atcFilePthNm"),
					    			orgFileName: item.ortxtFileNm
					    		});
					    	}
						}
						if(!isDown) {
							layerPop.alert("등록된 상품 약관이 없습니다.");
						}
					} else {
						//error -> msg
						layerPop.alert(result.msg.standMsg);
					}
				}
			});
		};
		
		return o;
	}));
	
	// uiControl
	mz.comm.service('bind', function(co){
		var $timeout = co.get('$timeout');
		return {
			select : function(target, id){
				var el = $('#' + id);
				el.parent().on('click', '.select_list a, .slc_drop a', function() {
					$timeout(function() {
						target[id] = el.val();
					}, 10);
				});
			},
			watchLoop : function(scope, fn){
				scope.$watch(fn);
			}
		};
	});
	//rsecure
	mz.comm.factory('rsecure', mz.mold(function(logger, ajax, $timeout, $window, co) {
		var log = logger.getLogger('rsecure');
		var o = {};

		//키보드보안 세션키 발급 및 초기화 설정
		o.initRsecureLoading = function() {
			if($window.loadflag) {
				TK_Rescan();
			} else {
				ajax.form("/solution/touchen/tnksrnd.do", {}).then(function(result) {
					log.out(result);
					$window.TNK_SR = result.data.TNK_SRND;
					$window.bInit = 0;
					$window.bAddListner = 0;
					$window.loadflag = false;
					$window.tekOption.bstart = 0;
					$window.tekOption.srdk = TNK_SR;
					//
					RSecure_Loading();		//키보드보안
					//
				});
			}
		};
		//가상키패드 초기화 설정
		o.initTranskey = function() {
			if($window.tk && $window.tk.now) {
				$window.tk.close();
			}
			$window.tk = null;
			$window.transkey = [];
			//
			initTranskey();			//가상키패드
		};
		//키보드 보안, 세션키 발급 모드 초기화 설정
		o.initRsecureKey = function(time) {
			$timeout(function() {
				//가상키패드 주석처리
				o.initTranskey();
				//
				o.initRsecureLoading();
			}, time || 100);
		};
		
		return o;		
	}));
	
	
	//wiselog
	mz.comm.factory('wiselog', mz.mold(function(logger, $window, $q, co) {
		var log = logger.getLogger('wiselog');
		
		var info = {};
		var o = {};
		
		o.setUserId = function(id){
			log.out("userId = " + id);
			info.id = id;
		};
		
		o.logging = function() {
			var defered = $q.defer();
			log.out("logging sid = " + _n_sid_properties);
			log.out("loggins _n_bank_uid = " + info.id);
			$window['_n_sid'] = _n_sid_properties;
			$window['_n_bank_uid'] = info.id || '';
			$window['n_logging']();
			
			defered.resolve(true);
			return defered.promise;
		};
		
		o.clickLogging = function(pm) {
			log.out("" + $window.location.host);
			log.out("clickLogging pm = " + pm);
			$window['n_click_logging']($window.location.host + pm);
		};
		
		return o;
	}));
	
	// session
	mz.comm.factory('session', mz.mold(function(logger, $rootScope, http, menuService, path, $window, $location, wiselog, co, $timeout) {
		var log = logger.getLogger('session');

		return {
			test: function() {
				return http.post('f.cg.he.co.cc.o.bc.SessionRouteBc.getSessionUserInfo', {}, false).then(function(result) {
					if (result && result.body) {
						//고객ID로 조회된 정보를 가져온다.
						var userInfo = result.body.userInfo;
						var authCd   = '';
						var pageId = path.getPageId();
						var viewId = path.getViewId();
						var menu = _.filter(mz.menu, function(info) { return menuService.realMenuCheck(info, pageId);})[0];
						var cmCnnAthTpCds  = [];
						
						if(!_.isUndefined(menu)) {
							cmCnnAthTpCds = menu.cmCnnAthTpCd.split(",");
						}
						if (userInfo) {
							authCd = userInfo.authCd;
							//$rootScope.$broadcast('event.session.test', userInfo);
							if(viewId == '/desc'
							&& (-1 < _.indexOf(cmCnnAthTpCds, '5') || -1 < _.indexOf(cmCnnAthTpCds, authCd))) {
								$window.location.replace('/main.do');
								return false;
							}
							//wiselog 사용자 설정
							wiselog.setUserId(userInfo.userId);
						}
						
						if(0 < cmCnnAthTpCds.length
						&& -1 == _.indexOf(cmCnnAthTpCds, '5')
						&& -1 == _.indexOf(cmCnnAthTpCds, authCd)) {
							if(-1 < _.indexOf(mz.paths, '/desc')) {
								$window.location.replace(path.targetUrl(path.getPageId(), '/desc'));
//								$location.path('desc').replace();
							} else {
								//alert("권한 체크 URL로 이동..");
								$window.location.replace("/certification-center/user-authentication.do");
							}
							return false;
						}
						
						//wiselog
						wiselog.logging();
						return true;
					}
				});
			}
		};
	}));
	
	// userSession
	mz.comm.factory('userSession', mz.mold(function(co, path, $rootScope, $routeParams, $window, $location, $route) {
		var o = {};
		var _recv = {};
		
		o.loginEventOn = function( param ){
			$rootScope.$broadcast('event.session.chk', {});
		}		
		
		o.loginChk = function( param ){
			return co.get('http').post('/biz/cm/co/session/getRouteSession', {}, false).then(function(result) {				
				if(result && result.LOGIN_SESSION ) {
					_recv = result.LOGIN_SESSION;
				}
				
				return _recv;
			});
		}
		
		o.login = function( param ){
			return co.get('http').post('/biz/cm/co/user/login', param, false).then(function(result) {				
				_recv = result;
				
				return _recv;
			});
		}
		
		o.logout = function(){
			return co.get('http').post('/biz/cm/co/user/logout', param, false).then(function(result) {				
				_recv = result;
				
				return _recv;
			});
		}

		return o;
	}));

	// location
	mz.comm.factory('location', mz.mold(function(co, path, $rootScope, $routeParams, $window, $location, $route) {
		var o = {};
		var _recv = {};		

		o.getSessionParam = function() {
			return _recv.param;
		};

		o.init = function() {
			return co.get('http').post('/biz/cm/co/session/getRouteSession', {}, false).then(function(result) {
				if(result && result.ROUTE_SESSION ) {
					_recv.param = result.ROUTE_SESSION;
				}
				
				$rootScope.$broadcast('event.session.chk', result.LOGIN_SESSION);
			});
		};

		o.makeUrl = function(pageId, viewId) {
			return path.targetUrl(pageId, viewId);
		};

		o.go = function(pageId, viewId, param) {
			pageId = pageId || '';
			viewId = viewId || '';
			
			setSessionParam(param).then(function(result) {
				if (pageId != path.getPageId()) {
					$window.location.href = o.makeUrl(pageId, viewId);
					return;
				}

				if (viewId != path.getViewId()) {
					//console.log("service : offset = " + 0);
					$('html, body').stop().animate({
				        scrollTop: 0
				    }, 0);
					
					$location.path(viewId);
					return;
				}
				
				$route.reload();

			});
		};
		
		o.redirect = function(pageId, viewId) {
			$window.location.replace("/transferUrl.do?transfer=" + encodeURIComponent(o.makeUrl(pageId, viewId)));
		};

		function setSessionParam(param) {
			return co.get('http').post('/biz/cm/co/session/setRouteSession', param || {}, false);
		}

		return o;
	}));
	
	//layer popup
	mz.comm.factory('layerPop', mz.mold(function(logger, $location, $rootScope, $compile, $controller, $q, $timeout, ajax, co, wiselog, $window) {
		var o = {};
		var LAYER_INFO  = "layerInfo";
		var LAYER_NM    = "layer-pop-nm";
		//var EVENT_CLEAR = "event.layerPop.clear";
		
		var log = logger.getLogger('layerPop');

		o.open = function(name, tpl, param, fn) {
			if(!_.isUndefined($rootScope[LAYER_INFO]) 
			&& !_.isNull($rootScope[LAYER_INFO])	
			&& !_.isEmpty(getLayerInfo(name))) {
				return;
			}
			//가상키패드가 활성화 여부 체크
			if ($window.tk && $window.tk.now) {
				log.out($window.tk);
				$window.tk.close();
			}
			
			
			var deferred = $q.defer();
			var pm       = _.clone(param);
			
			setLayerInfo(name, {
				param: pm
			});
			
			//wiselog 추가 (layerPop open시)
			wiselog.clickLogging(makeUrl(tpl));
			//
			reqTpl(name, tpl).then(function(result) {
				if (result) {
					setLayerInfo(name, {
						id: name,
						promise: deferred,
						param: pm
					});
					fn && fn();
				}
			});

			return deferred.promise;
		};

		o.getParam = function($scope) {
			return getLayerInfo($scope[LAYER_NM]).param;
		};
		
		o.clear = function() {
			$rootScope[LAYER_INFO] = null;
			var comm = ['layer_alert', 'layer_help', 'layer_confirm'];
			for(var i = 0; i < comm.length; i++) {
				$rootScope[comm[i]] = {open: false};
			}
			//$rootScope.$broadcast(EVENT_CLEAR, 'clear-all');
		};

		o.close = function($scope, data) {
			getLayerInfo($scope[LAYER_NM]).promise.resolve(data);
			
			closeLayerPopup($scope[LAYER_NM]);
			
			$timeout(function() {
				setLayerInfo($scope[LAYER_NM], {});
				$("#" + $scope[LAYER_NM]).remove();
				$scope.$destroy();
			}, 300);
		};

		o.alert = function(message, option) {
			var deferred = $q.defer();
			var obj = {
				deferred: deferred, 
				message: message || '',
				option: option,
				tpl: 'comm/alert',
				id: 'layer_alert',
				controller: 'layerAlertController'
			};
			makeSystemLayer(obj);
			return deferred.promise;
		};

		o.confirm = function(message, title, option) {
			var deferred = $q.defer();
			var obj = {
				deferred: deferred, 
				message: message || '',
				title: title || '',
				option: option,
				tpl: 'comm/confirm',
				id: 'layer_confirm',
				controller: 'layerConfirmController'
			};
			makeSystemLayer(obj);
			return deferred.promise;
		};
		
		function makeHtml(html) {
			if($("#layer_popup_container").size() == 0) {
				//layer popup container 위치 적용.(div id='content')
				$("#content").append("<div id='layer_popup_container'></div>");
			}
			if ($("#layer_popup_container > div").size() == 0) {
				$("#layer_popup_container").html(html);
			} else {
				$("#layer_popup_container > div").last().after(html);
			}
		}

		function makeUrl(tpl) {
			return mz.path("/views/" + tpl + ".tpl");
		}

		function reqTpl(name, tpl) {
			var deferred = $q.defer();
			var url = makeUrl(tpl) + "?" + mz.v();

			ajax.tpl(url).then(function(result) {
				if (result.status == 200) {
					var $scope = $("body").scope().$new();
					
					$scope[LAYER_NM] = name; 
					
					/*
					$scope.$on(EVENT_CLEAR, function(event, data) {
						deferred.reject(false);
						setLayerInfo(name, {});
						$("#" + name).remove();
						$scope.$destroy();
					});
					*/
					
					
					var html = "<div id=\"" + name + "\" class='onlymain'></div>";
					makeHtml(html);

					$controller(name + 'Controller', {
						co: co,
						$scope: $scope
					});
					
					$("#" + name).html($compile(result.data)($scope));
					openLayerPopup(name, $(this));
					deferred.resolve(true);
				} else {
					deferred.reject(false);
				}
			});
			return deferred.promise;
		}

		function setLayerInfo(name, obj) {
			if (_.isUndefined($rootScope[LAYER_INFO]) || _.isNull($rootScope[LAYER_INFO])) {
				$rootScope[LAYER_INFO] = {};
			}

			$rootScope[LAYER_INFO][name] = obj;
		}

		function getLayerInfo(name) {
			return $rootScope[LAYER_INFO][name];
		}
		
		function makeSystemLayer(obj) {
			var deferred   = obj.deferred;
			var $scope     = $("body").scope().$new();
			var url        = makeUrl(obj.tpl)  + "?" + mz.v();
			var id         = obj.id;
			var controller = obj.controller;
			var message    = obj.message;
			var title      = obj.title || '';
			var option     = obj.option || {};
			
			if($rootScope[id] && $rootScope[id].open) {
				return;
			}
			
			$rootScope[id] = {open: true};
			$scope.title = title;
			$scope.message = message;
			$scope.option = option;
			$scope.promise = deferred;
			
			if (0 < $("#" + id).size()) {
				$("#" + id).remove();
			}
			
			ajax.tpl(url).then(function(result) {
				if (result) {
					makeHtml(result.data);
					open();
				}
			});
			
			function open() {
				$controller(controller, {
					co: co,
					$scope: $scope
				});
				$("#" + id).html($compile($("#" + id).html())($scope));
				openLayerPopup(id, $(this));
			}
		}

		return o;
	}));
	
	//system popup
	mz.comm.factory('systemPop', mz.mold(function($window, $q) {
		var o = {};

		o.open = function(url, name, param, option, flag) {
			$window.popupParam = $window.popupParam || {};
			$window.popupParam[name] = param;

			option = _.extend({
				width: '900',
				height: '500',
				left: '0',
				top: '0',
				scrollbars: 'yes',
				resizable: 'yes',
				menubar: 'no',
				location: 'no',
				status: 'no',
				toolbar: 'no'
			}, option);
			
			if(_.isUndefined(flag)) {
				flag = true;
			}
			
			if(flag) {
				option.left = (screen.availWidth - option.width) / 2;
				option.top  = (screen.availHeight - option.height) / 2;
			}

			$window.open(mz.WEBROOT + url,
				name,
				_.map(option, function(v, k) {
					return k + '=' + v;
				}).join(','));
		};

		o.close = function() {
			$window.open('about:blank', '_self').close();
		};

		o.getParam = function() {
			if ($window.opener && $window.opener.popupParam) {
				return $window.opener.popupParam[$window.name];
			}
			return null;
		};

		return o;
	}));
	
	// mkt
	mz.comm.factory('mkt', function(co){
		var $timeout = co.get('$timeout');
		var http = co.get('http');
		var log = co.get('logger').getLogger('mkt');

		return {
			log : function(fn){
				fn && $timeout(function(){
					fn();
				},1);
			},
			// 고객정보
			3010 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3010',
					cmCnnAthTpCd : data.cmCnnAthTpCd || '' // 본인인증구분(카/폰/공)
				});
			},

			// 자동차번호
			3020 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3020',
					vehcNo : data.vehcNo || '', 			// 차량번호
					crbdNo : data.crbdNo || '',				// 차대번호
					vehcPchTpCd : data.vehcPchTpCd || '',	// 차량구입유형코드
					inscoCd : data.inscoCd || '',			// 보험사코드
					bfCtrEdDdTm : data.bfCtrEdDdTm || '',	// 전계약종료일시각
					dcXchgGrdeCd : data.dcXchgGrdeCd || '', // 할인할증등급코드
					riskBdCd : data.riskBdCd || '',	 		// 리스크밴드코드
					bfCtrEdDdTm : data.bfCtrEdDdTm || '', 	// 전계약종료일시각(8자리 : YYYYMMDD)
					inscoCd : data.inscoCd || '', 			// 보험사코드(두자리 : 02) 
					insStDt : data.insStDt || '',			// 보험시작일자(8자리 : YYYYMMDD)
					insEdDt : data.insEdDt || '', 			// 보험종료일자(8자리 : YYYYMMDD)
					sbcCrrCd : data.sbcCrrCd || ''			// 가입경력코드
				});
			},

			// 자동차모델
			3030 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3030',
					vehcMnfcoCd : data.vehcMnfcoCd || '',	// 차량제작사코드
					vhtpCd : data.vhtpCd || '',				// 차종코드
					atmNm : data.atmNm || '',				// 차명
					vehcRegYy : data.vehcRegYy || '',		// 차량등록년도
					dtlsBnmCd : data.dtlsBnmCd || '',		// 세부차명코드
					dtlsOptTpCd : data.dtlsOptTpCd || '',	// 세부옵션유형코드
					vehcPrc : data.vehcPrc || ''			// 차량가격
				});
			},

			// 운전자범위
			3040 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3040',
					drvpeLimtSicCd : data.drvpeLimtSicCd || '' 	// 운전자한정특약코드
				});
			},

			// 용도및주행거리
			3050 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3050',
					vehcUsgCd : data.vehcUsgCd || '' 			// 차량용도코드
				});
			},

			// 직업정보
			3060 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3060',
					jobCd : data.jobCd || '',		// 직업코드
					jobGrdCd : data.jobGrdCd || '',	// 직업급수코드
					jobNm : data.jobNm || ''		// 직업명
				});
			},

			// 납입기간및방법
			3070 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3070',
					pyPrdTpCd : data.pyPrdTpCd, 	// pyPrdTpCd 	납입 기간유형코드
					pyPrd : data.pyPrd, 			// pyPrd  		납입 기간-년단위
					insPrd : data.insPrd, 			// insPrd 		보험 기간-년단위
					pyCycCd : data.pyCycCd, 		// pyCycCd		납입 주기코드
					insStDt : data.insStDt, 		// insStDt		보험 시작일
					insEdDt : data.insEdDt 			// insEdDt		보험 종료일
				});
			},

			// 보험료계산
			3080 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3080',
					prctrNoDect : data.prctrNoDect || '', 	// 가계약NO
					planCd : data.planCd || '', 			// 플랜코드(A/B/C)
					ttPrem : data.ttPrem || '', 			// 총보험료
					pyPrem : data.pyPrem || '', 			// 납입보험료
					dcXchgGrdeCd : data.dcXchgGrdeCd || '',	// 할인할증등급코드 (예)14Z)
					sbcCrrCd : data.sbcCrrCd || '', 		// 가입경력코드 (예)4)
					covCdList : data.covCdList || []		// 담보코드목록 {covNm, covCd, pstmStdAmt, insdAmtCurCd}
				});
			},

			// 가입시도
			3090 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3090'
				});
			},

			// 피보험자계약자연락처
			3095 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3095',
					riskBdCd : data.riskBdCd || '',			// 리스크밴드코드
					inspeNm : data.inspeNm || '', 			// 피보험자명
					inspeCusId : data.inspeCusId || '', 	// 피보험자ID
					zpcd : data.zpcd || '',					// 우편번호
					telArNo : data.telArNo || '',			// 전화지역번호
					telofNo : data.telofNo || '',			// 전화국번호
					telSnoDect : data.telSnoDect || '',		// 전화일련번호
					emailAdrDect : data.emailAdrDect || ''	// 이메일
				});
			},

			// 인수심사
			3100 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3100'
				});
			},

			// 청약
			3110 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3110',
					prctrIdDect : data.prctrIdDect || '',	// 가계약ID
					prctrNoDect : data.prctrNoDect || ''	// 가계약NO
				});
			},

			// 연락처
			3120 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3120',
					zpcd : data.zpcd || '',					// 우편번호
					telArNo : data.telArNo || '',			// 전화지역번호
					telofNo : data.telofNo || '',			// 전화국번호
					telSnoDect : data.telSnoDect || '',		// 전화일련번호
					emailAdrDect : data.emailAdrDect || ''	// 이메일
				});
			},

			// 결제방법
			3130 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3130',
					sttlMdCd : data.sttlMdCd || ''	//결재방법코드
				});
			},

			// 결재완료
			3140 : function(data){
				data = data || {};
				traceLog({
					stageCd : '3140',
					pyPrem : data.pyPrem || '' //납입보험료
				});
			},

			// 에러
			ERROR : function(data){
				data = data || {};
				traceLog({
					stageCd : 'ERROR',
					errMsgCd : data.errMsgCd || '', 	// 에러코드
					errMsgCon : data.errMsgCon || '' 	// 에러메시지
				});
			}
		};

		function traceLog(param){
			log.trace(param);
			http.post('f.cg.de.co.cc.o.bc.MktLogStoreBC.saveMktLog',param,false);
		}
	});
	
	mz.comm.factory('mktTMEvent', function(co){
		var http = co.get('http');
		var log = co.get('logger').getLogger('mktTMEvent');
		var o = {};
		o.C1TM = function (data){
			param = {				
					    stageCd : 'C1', 
						mzCd : data.mzcode,
						rsId : data.rsId,
						cusNm : data.cusNm,
						birth : data.birth
			}
			return http.post('f.cg.de.co.cc.o.bc.MktEventBC.getMktEventTMSession',param,false).then(function(result) {
				log.out("########",result.body.eventMsg);
				if(result){
					if(!_.isEmpty(result.body)){
						if(result.body.evntId){
							if(result.body.eventMsg){							
								return result.body.prtcPsbCd;	
							}
						}
					}		
				}
				return false;
			});
		}
		return o;
	});
	// mkt Event
	mz.comm.factory('mktEvent', function(co){
		var log = co.get('logger').getLogger('mktEvent');
		var $timeout = co.get('$timeout');
		var http = co.get('http');
		var layerPop = co.get('layerPop');
		var popup = co.get('popup');
		
		return {
			I1TM : function(data){
			data = data || {};
			insertEventTm({
					stageCd : 'I1',
					mzCd : data.mzcode,           // 페이지 넘버
					gndrcd : data.gndrcd, 
					rsId : data.rsId,
					cusNm : data.cusNm,
					birth : data.birth
				});
			}
		};
		function insertEventTm(param){
			try{
				$timeout(function(){
					log.trace(param.joinCheck);
					http.post('f.cg.de.co.cc.o.bc.MktEventBC.insertMktEventTM',param,false).then(function(result) {
								
					});
				},10);
			}catch(e){
			}
		}
	});
	
	
	// 세션관리
	mz.comm.factory('contract', mz.mold(function($rootScope, co) {
		var log 	 = co.get('logger').getLogger('contract');
		var http     = co.get('http');
		var path     = co.get('path');
		
		var o = {};
		
		// --개발자정의 --------------------------------------------------------
		o.setDevCustom = function(iPrm){
			return http.post('f.cg.de.co.cc.o.bc.ContractInfoBc.setDevCustom', iPrm || {}, false);
		};
		o.addDevCustom = function(iPrm){
			return http.post('f.cg.de.co.cc.o.bc.ContractInfoBc.addDevCustom', iPrm || {}, false);
		};
		o.getDevCustom = function(){
			return http.post('f.cg.de.co.cc.o.bc.ContractInfoBc.getDevCustom', {}, false);
		};
		o.runRecent = function() {
			log.trace('runRecent');
			var viewId = path.getViewId().split('/')[1];
			if(viewId=='i')
				return;

			mz.getRecent(co);
		};
		o.getMkt = function(){
			return http.post('f.cg.de.co.cc.o.bc.ContractInfoBc.getMkt', {}, false);
		};

		return o;
	
	}));
})(angular, mz);