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

package app;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/* InterCepter Handler */
public class InterCeptor extends HandlerInterceptorAdapter{
	
	final private String LOGIN_SESSION = "LOGIN_SESSION";
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
		
		System.out.println("InterCeptor");
		
		HttpSession userSession = request.getSession();
		
		HashMap loginSession = (HashMap) userSession.getAttribute( LOGIN_SESSION );
		
		if( loginSession != null ){
			System.out.println("Current Status : Log In");
		}else{
			System.out.println("Current Status : Log Out");
		}
		
		/*
		System.out.println( userSession.getAttribute( "test" ) );		
		
		userSession.setAttribute( "test", putMap );		
		*/
		/*
		try {
			//logininfo 세션값이 널일경우
			if(request.getSession().getAttribute("logininfo") == null ){
					//로그인페이지로 redirect
					response.sendRedirect("/login");	
					return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		
		//널이 아니면 정상적으로 컨트롤러 호출
		return true;
	}
}
