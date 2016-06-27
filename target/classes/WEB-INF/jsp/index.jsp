<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Demo</title>

<script type="text/javascript"  src="/default/asset/lib/lib.min.js"></script>

<!-- BootStrap 3.3.6 : S -->
<link rel="stylesheet" href="/default/asset/bootstrap-3.3.6-dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="/default/asset/bootstrap-3.3.6-dist/css/bootstrap-theme.min.css" />
<script src="/default/asset/bootstrap-3.3.6-dist/js/bootstrap.min.js"></script>
<!-- BootStrap 3.3.6 : E -->

<link rel="stylesheet" href="/default/asset/css/angular-block-ui.min.css" />
<link rel="stylesheet" href="/default/asset/css/user_custom.css" />

<script type="text/javascript">
  	var mz = {
  		DOMAIN:'',WEBROOT:'',APPROOT:'default',WEBPAGE:'${targetCtrlPath}',
  		ERRORPAGE:'/error.do', DOWNLOADURL:'https://cmdown.meritzfire.com/manager', ENVIRINFODIVCD:'P',
  		MODE:{
  			LOG:true,
  			TRACE:true
  		}
	};
</script>
  
<script src="/default/app/comm/app.js"></script>
<script src="/default/app/core/core.js"></script>
<script src="/default/app/comm/comm.js"></script>
<script src="/default/app/app.js"></script>
<script src="/default/app/run.js"></script>


</head>
<body data-ng-controller="commController as comm">
	
	<div data-ui-header id="header"></div>
	
	<div data-ng-view id="container"></div>
	
	<div data-ui-footer id="footer"></div>

</body>
</html>