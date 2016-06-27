/*
 * COPYRIGHT (c) ****
 * This software is the proprietary ****
 * 
 * Modeler : 천주현
 *
 * Revision History
 * Author Date       Description
 * ------ ---------- -----------
 * 천주현 2016-06-13 First Draft
 */

package app.biz.cm.co;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.mapper.dp.co.DpCoMapper;
import app.mapper.dp.mb.*;


@RestController
@RequestMapping(value="/biz/cm/co")
public class CmCoRestControllers {
	
	@Autowired
	private DpCoMapper DpCoMapper;	
	
	final private String LOGIN_SESSION = "LOGIN_SESSION";
	
	final private String ROUTE_SESSION = "ROUTE_SESSION";	
	
	/**
	 * @method login - 사용자 로그인
	 * @param {Map} request
	 * 					userId(String)			- 사용자 아이디
	 *  				userPw(String)			- 사용자 암호
	 * @param {Map} resMap
	 * 					resCd(Object)			- 로그인 여부
	 * 					LOGIN_SESSION(Object)	- 사용자 정보
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/user/login", method = RequestMethod.POST)	
	public HashMap userLogin( @RequestBody Map<Object, Object> map, HttpServletRequest request ) throws Exception {
		
		HttpSession userSession = request.getSession();
		
		HashMap reqMap = (HashMap) map.get("body");
		HashMap resMap = new HashMap();
		
		HashMap queryReqMap = new HashMap();
		HashMap queryResMap = null;
		
		String userPw = null;
		String resCd = "2";			// 로그인 결과 코드 ( 0:성공, 1:암호틀림, 2: 아이디 없음)
		
		queryReqMap.put( "userId", reqMap.get("userId") );
		
		queryResMap = DpCoMapper.retrieveUserLoginInfo( queryReqMap );
		
		if( queryResMap != null ){
			userPw = (String) queryResMap.get("password");
			
			if( userPw.equals( reqMap.get("userPw") ) ){
				
				resCd = "0";
				userSession.setAttribute( LOGIN_SESSION, queryResMap );
				
			}else{
				resCd = "1";
			}
		}		
		
		resMap.put( LOGIN_SESSION, userSession.getAttribute( LOGIN_SESSION ) );
		resMap.put( "resCd", resCd );
		
		return resMap;
	}
	
	/**
	 * @method logout - 사용자 로그아웃
	 * @param {Map} request 
	 * @param {Map} resMap
	 * 					resCd(String)	- 로그아웃 정상처리 여부
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/user/logout", method = RequestMethod.POST)	
	public HashMap userLogout( @RequestBody Map<Object, Object> map, HttpServletRequest request ) throws Exception {
		
		HashMap resMap =  new HashMap();
		
		HttpSession userSession = request.getSession();
		
		userSession.setAttribute( LOGIN_SESSION, null );
		
		resMap.put( "resCd", "0" );
		
		return resMap;
	}
		
	/**
	 * @method setRouteSession - 정보 저장(페이지 이동 시)
	 * @param {Map} request 
	 * @param {Map} resMap 	
	 * 					ROUTE_SESSION(Object)	- 저장할 정보
	 */
	
	@RequestMapping(value="/session/setRouteSession", method = RequestMethod.POST)	
	public HashMap setRouteSession( @RequestBody Map<Object, Object> map, HttpServletRequest request ) throws Exception {
		
		HttpSession userSession = request.getSession();
		HashMap resMap = new HashMap();
		
		userSession.setAttribute( ROUTE_SESSION, map.get("body") );		
		
		System.out.println( "-----------setRouteSession-------------" );
		System.out.println( userSession.getAttribute( ROUTE_SESSION ) );
		System.out.println( map.get("body") );
		System.out.println( "-----------//setRouteSession-------------" );		
		
		resMap.put( ROUTE_SESSION, userSession.getAttribute( ROUTE_SESSION ) );		
		
		return resMap;
	}
	
	/**
	 * @method getRouteSession - 정보 로드(페이지 이동 시)
	 * @param {Map} request 
	 * @param {Map} resMap 	
	 * 					ROUTE_SESSION(Object)	- 로드할 정보
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/session/getRouteSession", method = RequestMethod.POST)	
	public HashMap getRouteSession( @RequestBody Map<Object, Object> map, HttpServletRequest request ) throws Exception {
		
		HttpSession userSession = request.getSession();
		HashMap resMap = new HashMap();
		
		System.out.println( "-----------getRouteSession-------------" );
		System.out.println( userSession.getAttribute( ROUTE_SESSION ) );
		System.out.println( "-----------//getRouteSession-------------" );
		
		Object routeSessionParam = userSession.getAttribute( ROUTE_SESSION );
		Object loginSession = userSession.getAttribute( LOGIN_SESSION );
		
		if( routeSessionParam == null )	routeSessionParam = "{}";
		if( loginSession == null )		loginSession = "{}";
		
		resMap.put( LOGIN_SESSION, loginSession );
		resMap.put( ROUTE_SESSION, routeSessionParam );
		
		return resMap;
	}
	
}