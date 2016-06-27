(function(angular, mz) {
	// 공통팝업
	mz.comm.service('popup', mz.mold(function(co){
		var log = co.get('logger').getLogger('popup');
		var layerPop = co.get('layerPop');
		var o = {};

		o.contract = function(url) {
			return layerPop.open('layerContract', 'biz/cm/cc/main/popDirect', {src:url});
		};

		// o.ozview = function(data) {
		// 	return layerPop.open('ozviewPop', 'biz/cm/mc/popup/ozview', data);
		// };

		return o; 
	}));

	// Alert
	mz.comm.controller('layerContractController', mz.mold(function(co, $scope) {
		var layerPop = co.get('layerPop');
		var $sce = co.get('$sce');
		var prm = layerPop.getParam($scope);
		$scope.pio = {iframe : $sce.trustAsHtml('<iframe name="contract" style="width:100%; height:800px;  overflow-y: hidden; border:none;margin-top:30px;" scrolling="no" id="directFrame" src="'+prm.src+'"></iframe>')};
		
		$scope.close = function() {
			
			//$scope.pio.iframe.src
			var drctFrame = document.getElementById('directFrame').contentWindow;
			
			if(drctFrame){
				if(drctFrame.mz && drctFrame.mz.product && drctFrame.mz.product.mzcode){
					var mzcode = drctFrame.mz.product.mzcode;
					var _url = "/default/views/comm/scsnPrvn/" + mzcode + ".tpl";
					 $.ajax({//이탈방지 팝업 tpl 유무 체크
					    url : _url,
					    type : 'HEAD',
					    error : function(){
							layerPop.close($scope);
							setTimeout(function(){$('body').removeAttr('style');}, 300);
							$('#uiDirectPannel').remove();
							$('#goDirect').animate({backgroundColor: '#ffffff'},function(){
								$('body').removeAttr('style')
								$('.ui_layer_frame , #goDirect').remove();
								$('body').removeAttr('style')
							});
					 	},//error
					    success : function(){
							layerPop.open("layerScsnPrvnPop", "comm/scsnPrvn/" + mzcode, {})
							.then(function(result){
								if(result.result){//홈으로/창닫기
									layerPop.close($scope);
									setTimeout(function(){$('body').removeAttr('style');}, 300);
									$('#uiDirectPannel').remove();
									$('#goDirect').animate({backgroundColor: '#ffffff'},function(){
										$('body').removeAttr('style')
										$('.ui_layer_frame , #goDirect').remove();
										$('body').removeAttr('style')
									});
								}
							});//layerPop
					 	}//success
					 });//ajax
				}else{//default 이탈방지 페이지
					
					layerPop.close($scope);
					setTimeout(function(){$('body').removeAttr('style');}, 300);
					$('#uiDirectPannel').remove();
					$('#goDirect').animate({backgroundColor: '#ffffff'},function(){
						$('body').removeAttr('style')
						$('.ui_layer_frame , #goDirect').remove();
						$('body').removeAttr('style')
					});
				}
			}else{
				layerPop.close($scope);
				setTimeout(function(){$('body').removeAttr('style');}, 300);
				$('#uiDirectPannel').remove();
				$('#goDirect').animate({backgroundColor: '#ffffff'},function(){
					$('body').removeAttr('style')
					$('.ui_layer_frame , #goDirect').remove();
					$('body').removeAttr('style')
				});
			}	
			
		};
	}));

	mz.comm.controller('layerScsnPrvnPopController', mz.mold(function(co, $scope) {
		var layerPop = co.get('layerPop');
		var location = co.get('location');
		var $sce = co.get('$sce');
		var $rootScope  = co.get('$rootScope');
		var id = "layer_scsnPrvnPop";
		//홈으로
		$scope.goHome = function() {
			location.go("/main.do");
			layerPop.close($scope, {result : true});
		};
		
		//창닫기
		$scope.goClose = function() {
			layerPop.close($scope, {result : true});
		};
		
		//취소
		$scope.goCancle = function() {
			layerPop.close($scope, {result : false});
		};
		
		//2016-03-16 배태경
		//자동차/여행보험 제외한 전체 상품 link 추가 
		//의료실비
		$scope.goAPlus = function() {
			location.go("/health-and-kids/alpha-plus.do#!/");
			layerPop.close($scope, {result : true});
		};
		
		//3대질병
		$scope.goMDisease = function() {
			location.go("/health-and-kids/major-disease.do#!/");
			layerPop.close($scope, {result : true});
		};
		
		
		
	}));
	
	/**
	 * @method Controller 제도개정을위한 임시 팝업
	 * @param {o} co - 공통컴포넌트
	 * @param {o} $scope - 스코프
	 */
	mz.comm.controller('uiInsServiceTipController', function(co, $scope) {
		var log = co.get('logger').getLogger('uiInsServiceTip');
		var layerPop	= co.get('layerPop');
		var util	= co.get('util');
		/* - init --------------------------------- */
		init();
		/* - public ------------------------------- */
		/**
		 * @method close
		 */
		$scope.close = function() {
			layerPop.close($scope);
		};
		$scope.todayClose = function(){
			util.setCookie("noOpenPop","done", 1);
			layerPop.close($scope);
		}
		/* - private ------------------------------ */
		/**
		 * @method init - 초기화
		 */
		function init() {
		}
	});
	

})(angular, mz);