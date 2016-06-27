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

	// A Tag Click 제어
	mz.core.directive('a', function() {
		return {
			restrict: 'E',
			link: function(scope, elem, attrs) {
				if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
					elem.on('click', function(e) {
						e.preventDefault();
					});
				}
			}
		};
	});

	// Form Tag Submit 제어
	mz.core.directive('form', function() {
		return {
			restrict: 'E',
			link: function(scope, elem, attrs) {
				elem.on('submit', function(e) {
					e.preventDefault();
				});
			}
		};
	});

})(angular, mz);