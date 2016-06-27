(function(angular, mz) {

	mz.core.factory('util', mz.mold(function(layerPop) {
		var o = {};

		//휴대폰 연속번호 오류 DATA
		var MOB_ERROR = ['000000','111111','222222',
		                 '333333','444444','555555','666666','777777','888888','999999'];
		
		var TEL_ERROR_NUM1 = ['02']; //자택,직장번호체크...

		var TEL_ERROR_NUM2 = ['031','032','033','041','042','043','044','051','052','053','054','055',
			     		      '061','062','063','064','070','080']; //자택,직장번호체크...

		var TEL_ERROR_NUM3 = ['0130','0303','0502','0505','0506','0507','0707','0504']; //자택,직장번호체크...

		
		
		o.isNull = function(val) {
			return _.isUndefined(val) || _.isNull(val);
		};

		//StringUtil
		//주어진 문자열이 null 또는 공백일 경우 참 반환
		o.isEmpty = function(s) {
			if (!_.isString(s)) return false;
			if (s == null || s === '') {
				return true;
			}
			return false;
		};

		//입력된 문자열이 숫자와 알파벳로만 구성되어있는지 체크
		o.isAlphaNumeric = function(s) {
			if (!_.isString(s)) return false;
			return /^[A-Za-z0-9]+$/.test(s);
		};

		//입력된 문자열이 숫자로만 구성되어있는지 체크
		o.isNumeric = function(s) {
			if (!_.isString(s)) return false;
			return /^[0-9]+$/.test(s);
		};

		//입력된 문자열이 알파벳로만 구성되어있는지 체크
		o.isAlpha = function(s) {
			if (!_.isString(s)) return false;
			return /^[A-Za-z]+$/.test(s);
		};

		//입력된 문자열이 한글로만 구성되어 있는지 체크
		o.isHangul = function(s) {
			if (!_.isString(s)) return false;
			return /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(s);
		};

		//해당하는 문자열에 대한 길이 반환
		o.getLength = function(s) {
			if (!_.isString(s)) return 0;
			return s.length;
		};

		//해당하는 문자열에 대해서 byte 단위에 대해서 길이 계산해서 총 길이 반환
		//한글은 3Byte
		o.getByteLength = function(s) {
			if (!_.isString(s)) return 0;
			var b, i, c = 0;
			for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
			return b;
		};

		//문자열의 왼쪽의 공백 문자열 제거
		o.leftTrim = function(s) {
			if (!_.isString(s)) return '';
			return s.replace(/^\s+/, "");
		};

		//문자열의 오른쪽의 공백 문자열 제거
		o.rightTrim = function(s) {
			if (!_.isString(s)) return '';
			return s.replace(/\s+$/, "");
		};

		//문자열의 공백 문자열 제거
		o.trim = function(s) {
			if (!_.isString(s)) return '';
			return s.replace(/^\s+|\s+$/g, "");
		};

		//해당하는 문자열에 대해서 입력된 길이만큼 부족한 길이를 왼쪽부터 공백으로 채워넣는다.
		o.leftPad = function(s, len, c) {
			if (!_.isString(s) || !_.isString(c)) return '';
			if (!_.isNumber(len) || len <= o.getLength(s)) return s;
			if (o.getLength(c) != 1) return s;

			var padLen = len - o.getLength(s);
			for (var i = 0; i < padLen; i++) {
				s = c + s;
			}
			return s;
		};

		//해당하는 문자열에 대해서 입력된 길이만큼 부족한 길이를 오른쪽부터 지정된 문자로 채워넣는다.
		o.rightPad = function(s, len, c) {
			if (!_.isString(s) || !_.isString(c)) return '';
			if (!_.isNumber(len) || len <= o.getLength(s)) return s;
			if (o.getLength(c) != 1) return s;

			var padLen = len - o.getLength(s);
			for (var i = 0; i < padLen; i++) {
				s += c;
			}
			return s;
		};

		o.addCommas = function(s) {
			if (_.isNumber(s)) s = '' + s;
			if (!_.isString(s)) return '';

			var x, x1, x2 = '';
			x = s.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		};

		//입력된 문자열이 주어진 문자열과 일치하는 모든 문자열을 바꿔야할 문자열로 변경
		o.replaceAll = function(s, bs, as) {
			if (!_.isString(s) || !_.isString(bs) || !_.isString(as)) return '';
			return s.split(bs).join(as);
		};

		//HTML tag가 들어있는 문자열에 대해 unescape해준다.
		o.replaceHtmlEscape = function(s) {
			if (!_.isString(s)) return '';
			return _.escape(s);
		};

		//unescaped된 문자열에 대해 HTML tag 형태로 바꿔준다.
		o.removeEscapeChar = function(s) {
			if (!_.isString(s)) return '';
			return _.unescape(s);
		};

		//DateUtil
		//입력된 일자가 유효한 일자인지 체크
		o.isDate = function(s) {
			if (!_.isString(s) || o.isEmpty(s) || o.getLength(s) != 8) return false;

			var year = Number(s.substring(0, 4));
			var month = Number(s.substring(4, 6));
			var day = Number(s.substring(6, 8));

			if (1 > month || 12 < month) {
				return false;
			}

			var lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var lastDay = lastDays[month - 1];

			if (month == 2 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)) {
				lastDay = 29;
			}

			if (1 > day || lastDay < day) {
				return false;
			}

			return true;
		};

		//입력된 시간이 유효한지 체크
		o.isTime = function(s) {
			if (!_.isString(s) || o.isEmpty(s) || o.getLength(s) != 6) return false;

			var h = Number(s.substring(0, 2));
			var m = Number(s.substring(2, 4));
			var s = Number(s.substring(4, 6));

			if (0 > h || 23 < h) {
				return false;
			}

			if (0 > m || 59 < m) {
				return false;
			}

			if (0 > s || 59 < s) {
				return false;
			}

			return true;
		};
		
		//입력된 시간이 유효한지 체크
		o.isHour = function(s) {
			if (!_.isString(s) || o.isEmpty(s) || o.getLength(s) != 2) return false;

			var h = Number(s);

			if (0 > h || 23 < h) {
				return false;
			}
			
			return true;
		};
		
		//입력받은 일자를 Date형으로 변환
		o.strToDate = function(s) {
			if (!_.isString(s)) return null;

			var array = s.split(' ');
			var date = array[0];
			var time = '000000';

			if (2 == array.length) {
				time = array[1];
			}

			if (!o.isDate(date)) return null;
			if (!o.isTime(time)) return null;

			var year = date.substring(0, 4);
			var month = Number(date.substring(4, 6)) - 1;
			var day = date.substring(6, 8);
			var hour = time.substring(0, 2);
			var minute = time.substring(2, 4);
			var second = time.substring(4, 6);

			return new Date(year, o.leftPad('' + month, 2, '0'), day, hour, minute, second);
		};

		o.formatDate = function formatDate(d, f) {
			if (!_.isString(f)) return '';

			if (_.isDate(d)) {
				return f.replace(/(yyyy|yy|mm|dd|hh24|hh|mi|ss|fff|a\/p)/gi, function($1) {
					switch ($1) {
						case "yyyy":
							return '' + d.getFullYear();
						case "yy":
							return o.leftPad('' + (d.getFullYear() % 1000), 4, '0').substring(2, 4);
						case "mm":
							return o.leftPad('' + (d.getMonth() + 1), 2, '0');
						case "dd":
							return o.leftPad('' + d.getDate(), 2, '0');
						case "hh24":
							return o.leftPad('' + d.getHours(), 2, '0');
						case "hh":
							return o.leftPad('' + ((h = d.getHours() % 12) ? h : 12), 2, '0');
						case "mi":
							return o.leftPad('' + d.getMinutes(), 2, '0');
						case "ss":
							return o.leftPad('' + d.getSeconds(), 2, '0');
						case "fff":
							return o.leftPad('' + d.getMilliseconds(), 3, '0');
						case "a/p":
							return d.getHours() < 12 ? "오전" : "오후";
						default:
							return $1;
					}
				});
			} else if (_.isString(d)) {
				return formatDate(o.strToDate(d), f);
			}

			return '';
		};

		//입력받은 일자의 요일 반환
		o.getDayOfWeek = function(s) {
			if (!o.isDate(s)) return '';
			var week = ['일', '월', '화', '수', '목', '금', '토'];
			return week[o.strToDate(s).getDay()];
		};

		//입력받은 두 날짜 사이의 일자 계산
		o.getDay = function(sd, ed) {
			if (!o.isDate(sd) || !o.isDate(ed)) return -1;
			if (Number(ed) < Number(sd)) return -2;

			var newSd = o.strToDate(sd);
			var newEd = o.strToDate(ed);
			var diffTime = newEd.getTime() - newSd.getTime();

			return Math.floor(diffTime / (1000 * 60 * 60 * 24));
		};

		//입력받은 일자에 대해서 해당 일만큼 더한 일자 반환. 마이너스 일자는 입력받은 일자보다 이전의 일자로 계산해서 반환
		o.addDays = function(s, d, f) {
			if (!o.isDate(s) || !_.isNumber(d)) return '';
			var newDt = o.strToDate(s);
			newDt.setDate(newDt.getDate() + (d));
			return o.formatDate(newDt, f || 'yyyymmdd');
		};

		//입력받은 일자에 대해서 해당 개월수만큼 더한 일자 반환. 마이너스 개월수는 입력받은 일자보다 이전 일자로 계산해서 반환
		o.addMonths = function(s, m, f) {
			if (!o.isDate(s) || !_.isNumber(m)) return '';
			var newDt = o.strToDate(s);
			newDt.setMonth(newDt.getMonth() + (m));
			return o.formatDate(newDt, f || 'yyyymmdd');
		};

		//입력받은 일자에 대해서 해당 년수만큼 더한 일자 반환. 마이너스 년수는 입력받은 일자보다 이전 일자로 계산해서 반환
		o.addYears = function(s, y, f) {
			if (!o.isDate(s) || !_.isNumber(y)) return '';
			var newDt = o.strToDate(s);
			newDt.setFullYear(newDt.getFullYear() + (y));
			return o.formatDate(newDt, f || 'yyyymmdd');
		};

		//입력받은 일자에 마지막 일 반환
		o.getLastDay = function(s, f) {
			if (!o.isDate(s)) return '';
			var newDt = o.strToDate(s);
			newDt.setMonth(newDt.getMonth() + 1);
			newDt.setDate(0);
			return o.formatDate(newDt, f || 'yyyymmdd');
		};
		
		o.checkDateOver = function(s, f) {
			if (!o.isDate(s)) return '';
			
			if(s > f){
				return false;
			}
			
			return true;
		}; 
		
		//NumberUtil
		o.strToInt = function(s) {
			if (!_.isString(s)) return 0;
			return parseInt(s, 10);
		};

		o.parseInt = function(s) {
			return parseInt(s, 10);
		};

		//ValidationUtil
		//문자열의 길이가 최소, 최대 길이 사이에 존재하는지 체크
		o.isRangeLength = function(s, min, max) {
			if (!_.isString(s) || !_.isNumber(min) || !_.isNumber(max)) return false;

			var len = o.getLength(s);
			if (min <= len && len <= max) {
				return true;
			}

			return false;
		};

		//문자열의 길이가 byte 단위로 계산했을때 최소, 최대 길이 사이에 존재하는지 체크
		o.isRangeByteLength = function(s, min, max) {
			if (!_.isString(s) || !_.isNumber(min) || !_.isNumber(max)) return false;

			var len = o.getByteLength(s);
			if (min <= len && len <= max) {
				return true;
			}

			return false;
		};

		//입력된 이메일주소가 유효한이메일주소인지 검증한다.
		o.isEmail = function(s) {
			if (!_.isString(s)) return false;
			return /^([0-9a-zA-Z]+)([0-9a-zA-Z\._-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,3}$/.test(s);
			//return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/.test(s);
		};
		
		o.phoneFormat = function(val) {
			if (o.isNull(val)) {
				return "";
			}

			val = o.replaceAll(val, "-", "");
			
			if(val.length == 12){
				var val = val.substring(0,4)+'-'+val.substring(4,8)+'-'+val.substring(8,12);
				return val;
			}
			
			return val.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
		};
		
		//핸드폰연속같은번호체크(AS-IS로직)
		o.checkSameTelNo = function(s) {
			var sameCnt = 0;
			var ret = false;
			
			s = o.phoneFormat(s);
			
			//연속된 숫자 체크..
			var array = s.split("-");
			var str   = array[1] + '' + array[2];
			
			for (var i=0; i < str.length  ; i++) {
			  var chr_pass_0 = str.charAt(0);
			  var chr_pass_1 = str.charAt(i);
			 
			  //동일문자 카운트
			  if(chr_pass_0 == chr_pass_1) sameCnt++;

			}	
			if(str.length == sameCnt)  ret = true;

			return ret;
		};

		//입력된 휴대폰번호가 유효한 번호인지 검증한다.
		o.isMobile = function(s) {
			if (!_.isString(s)) return false;
			
			var checkSameNo = _.find(MOB_ERROR, function(v){
				 //연속번호 에러가 포함된 경우 오류번호 리턴
				 return s.indexOf(v) > -1;
			 });
			
			if(_.isString(checkSameNo)) return false;
			
			s = o.phoneFormat(s); 
			
			//return /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/.test(s);
			return /^(?:(010-?\d{4})|(01[1|6|7|8|9]-?\d{3,4}))-?(\d{4})$/.test(s);
		};

		//입력된 전화번호가 유효한 번호인지 검증한다.
		o.isTel = function(s) {
			if (!_.isString(s)) return false;
			
			s = o.phoneFormat(s); 
			
			return /^\d{2,3}-\d{3,4}-\d{4}$/.test(s);
		};
		
		o.isAccount = function(s) {
			if (!_.isString(s)) return false;
			
			var len = s.length;
			
			return (11 <= len && len <= 14);
		};


		o.getCrytoData = function(obj, key) {
			return obj[key + '#[E]'] || '';
		};
		o.setCrytoData = function(obj, key, value){
			return obj[key + '#[E]'] =  value;
		};

		o.getListData = function(obj) {
			if (_.isArray(obj)) {
				return obj;
			}

			var a = [];
			if (_.isUndefined(obj) || _.isNull(obj)) {
				return a;
			}
			a.push(obj);
			return a;
		};

		o.resultMsg = function(result) {
			if (_.isUndefined(result) || _.isNull(result)) {
				return false;
			}

			if (result.body && result.body.resultMsg) {
				layerPop.alert(result.body.resultMsg);
				return false;
			}

			if (result.msg && result.msg.standMsg) {
				layerPop.alert(result.msg.standMsg);
				return false;
			}

			if (_.isUndefined(result.body) || _.isNull(result.body)) {
				return false;
			}

			return true;
		};

		o.validation = function(valid, object) {
			var succ = true;

			_.each(valid, function(v, k) {
				var val = object[k];

				if (_.isUndefined(val) || _.isNull(val) || val == '') {
					valid[k].error = true;
					succ = false;
				}
			});


			return succ;
		};

		o.existy = function(x) {
			return x != null
		};

		o.cat = function() {
			var head = _.first(arguments);
			if (o.existy(head)) {
				return head.concat.apply(head, _.rest(arguments));
			} else
				return [];
		};

		o.construct = function(head, tail) {
			return o.cat([head], _.toArray(tail));
		};

		o.mapKeyReName = function(obj, newNames) {
			return _.reduce(newNames, function(o, nu, old) {
					if (_.has(obj, old)) {
						o[nu] = obj[old];
						return o;
					} else return o;

				},

				_.omit.apply(null, o.construct(obj, _.keys(newNames))));
		};

		o.isError = function(valid) {
			var flag = false;
			_.each(valid, function(v, k) {
				if (valid[k].error) {
					flag = true;
					return false;
				}
			});

			return flag;
		};

		/**
		 * 키보드보안/가상키패드 입력 object
		 */
		o.getInputEncData = function(ids, formObj) {
			var inputData = {
				ids: ids,
				transkeyUuid: tk.transkeyUuid
			};
			var isMakeEncData = false;
			var idsBuf = "";
			for (var i = 0; i < ids.length; i++) {
				var id = ids[i];
				//var tkCheckObj = document.getElementsByName("Tk_" + id + "_checkbox");
				//var tkCheckObj = document.getElementById("Tk_" + id + "_checkbox");
				var tkCheckObj = $("input[type=hidden][name=Tk_" + id + "_checkbox]");
				var tkCheckVal = "";
				if (tkCheckObj == undefined) {
					tkCheckVal = "e2e";
				} else {
					//tkCheckVal = tkCheckObj.value;
					tkCheckVal = tkCheckObj.val();
				}
				if (tkCheckVal == 'transkey') {
					//가상키패드일경우
					var values = tk.inputFillEncData(document.getElementById(id)); //inputFillEncData 로직 태워서 전송해야 함
					var name = document.getElementById(id).name;
					var hidden = values.hidden;
					var hmac = values.hmac;
					inputData["name_" + id] = name;
					inputData["hidden_" + id] = hidden;
					inputData["hmac_" + id] = hmac;
				} else if (tkCheckVal == 'e2e') {
					//키보드보안일 경우
					if (!isMakeEncData) {
						if (TK_makeEncData(formObj)) {
							inputData.hid_key_data = encodeURIComponent(document.getElementById("hid_key_data").value);
							inputData.hid_enc_data = encodeURIComponent(document.getElementById("hid_enc_data").value);
							isMakeEncData = true;
						}
					}
				}
				inputData["Tk_" + id + "_checkbox"] = tkCheckVal;
			}
			return inputData;
		};

		/**
		 * 모바일 가상키패드 입력 object
		 */
		o.getMobileInputEncData = function(ids, formObj) {
			var inputData = {
				ids: ids,
				transkeyUuid: mtk.transkeyUuid
			};
			var isMakeEncData = false;
			var idsBuf = "";
			for (var i = 0; i < ids.length; i++) {
				var id = ids[i];

				//가상키패드일경우
				var values = mtk.inputFillEncData(document.getElementById(id)); //inputFillEncData 로직 태워서 전송해야 함
				var name = document.getElementById(id).name;
				var hidden = values.hidden;
				var hmac = values.hmac;
				inputData["name_" + id] = name;
				inputData["hidden_" + id] = hidden;
				inputData["hmac_" + id] = hmac;

				inputData["Tk_" + id + "_checkbox"] = 'transkey';
			}
			return inputData;
		};

		/**
		 * 자택/직장번호 4자리 유효성 체크...
		 */
		o.isTelFstNum = function(number){
			var fNum = '';
			if(number && number.length > 3){
				//두자리까지체크
				fNum = _.find(TEL_ERROR_NUM1, function(v){
					return number.substring(0,2).indexOf(v) > -1;
				});
				if(!fNum){
					//세자리체크
					fNum = _.find(TEL_ERROR_NUM2, function(v){
						return number.substring(0,3).indexOf(v) > -1;
					});
					if(!fNum){
						//네자리체크
						fNum = _.find(TEL_ERROR_NUM3, function(v){
							return number.substring(0,4).indexOf(v) > -1;
						});
					}
				}
			}
			if(!fNum){
				return false;
			}else{
				return true;
			}
			
		};
		
		/**
		 * 화면 스크롤 이동
		 */
		o.goScroll = function(id) {
			var offset = $('#'+id).offset().top;
			$('html, body').stop().animate({
				scrollTop: offset
			}, 'normal');
			$("#"+id).focus();
			$("body").attr("data-scraction","0")
		};
		
		/**
		 * direct 직판 url 
		 */
		o.getDirectHost = function() {
			var directUrl = "";
			if (mz.ENVIRINFODIVCD == 'D') {
				directUrl = "https://wwwdev.meritzdirect.com:19142/";
			} else if (mz.ENVIRINFODIVCD == 'T') {
				directUrl = "https://wwwtest.meritzdirect.com:19142/";
			} else {
				directUrl = "https://www.meritzdirect.com/";
			}
			return directUrl;
		};
		
		/**
		 * 쿠키 셋팅 
		 */
		o.setCookie = function(name,value,expiredays){
			var todayDate = new Date(); 
			if (expiredays == null){
				 // 쿠키가 저장될 기간을 설정 null 일경우 default 하루 
				 expiredays = 1;
			}
			todayDate.setDate( todayDate.getDate() + expiredays ); 
			document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
			
		}
		

		/**
		 * 쿠키 가져오기 
		 */
		o.getCookie = function(name){
			var nameOfCookie = name + "="; 
			var x = 0; 
			while ( x <= document.cookie.length ){ 
				var y = (x+nameOfCookie.length); 
				if ( document.cookie.substring( x, y ) == nameOfCookie ) { 
					if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 ) 
						endOfCookie = document.cookie.length; 
					return unescape( document.cookie.substring( y, endOfCookie ) ); 
				} 
				x = document.cookie.indexOf( " ", x ) + 1; 
				if ( x == 0 ) 
					break; 
			 } 
			 return ""; 
		}
		
		
		return o;
	}));

})(angular, mz);