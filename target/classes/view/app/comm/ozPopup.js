(function(angular, mz) {
	mz.comm.controller('ozViewPopController', mz.mold(function(co, $scope) { 
		var log = co.get('logger').getLogger('ozViewPopController');
		var layerPop = co.get('layerPop');
		$scope.io = {viweruri:layerPop.getParam($scope).viweruri};
		$scope.ux = {close:function(){layerPop.close($scope,{result:'cancel'});}};
	}));

	mz.comm.factory('ozPopup', mz.mold(function(logger, $rootScope, $compile, $controller, $q, $timeout, ajax, co, wiselog, $window) {
		var o = {};
		var LAYER_INFO  = "layerInfo";
		var LAYER_NM    = "layer-pop-nm";

		var log = logger.getLogger('ozPopup');

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

		o.getParam = function($scope) { return getLayerInfo($scope[LAYER_NM]).param; };

		o.close = function($scope, data) {
			getLayerInfo($scope[LAYER_NM]).promise.resolve(data);
			
			closeLayerPopup($scope[LAYER_NM]);
			
			$timeout(function() {
				setLayerInfo($scope[LAYER_NM], {});
				$("#" + $scope[LAYER_NM]).remove();
				$scope.$destroy();
			}, 300);
		};

		function makeHtml(html) {
			$("#uiDirectPannel > div").last().after(html);
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

					var html = "<div id=\"" + name + "\"></div>";
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

})(angular, mz);