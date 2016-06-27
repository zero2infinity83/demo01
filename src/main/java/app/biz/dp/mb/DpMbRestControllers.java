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

package app.biz.dp.mb;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.mapper.dp.co.*;
import app.mapper.dp.mb.*;


@RestController
@RequestMapping(value="/biz/dp/mb")
public class DpMbRestControllers {
	
	@Autowired
	private DpCoMapper dpCoMapper;
	
	@Autowired
	private DpMbMapper dpMbMapper;	
	
	/**
	 * @method retrieveList - 직원목록조회
	 * @param {Map} request 
	 * 					startNum(String) 		- 조회 시작번호
	 * 					pagePerNum(String) 		- 페이지 당 노출건수
	 * 					SearchOpt(String)		- 검색 옵션 ( 01: emp_no, 02:first_name, 03: last_name )
	 * 					searchTxt(String)		- 검색단어
	 * @param {Map} resMap 	
	 * 					totNum(String) 			- 조회 전체건수 
	 * 					startNum(String) 		- 조회 시작번호 
	 * 					memberList(Array[Map]) 	- 직원목록
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/retrieveList", method = RequestMethod.POST)	
	public HashMap retrieveList( @RequestBody Map<Object, Object> request ) throws Exception {
		HashMap reqMap = (HashMap) request.get("body");
		HashMap resMap = new HashMap();
		
		HashMap queryReqMap = new HashMap();
		
		queryReqMap.put("startNum", 	reqMap.get("startNum"));
		queryReqMap.put("pagePerNum", 	reqMap.get("pagePerNum"));
		queryReqMap.put("searchOpt", 	reqMap.get("searchOpt"));
		queryReqMap.put("searchTxt", 	reqMap.get("searchTxt"));
		
		resMap.put( "totNum", dpMbMapper.retrieveListTotalNum( queryReqMap ) );
		resMap.put( "startNum", reqMap.get("startNum") );
		resMap.put( "memberList", dpMbMapper.retrieveList( queryReqMap ) );
		
		return resMap;
	}
	
	/**
	 * @method retrieveDetail - 직원상세정보조회
	 * @param {Map} request 
	 * 					empNo(String) 		- 직원번호
	 * @param {Map} resMap 	
	 * 					empDetailInfo(Map)	- 직원상세정보 					
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/retrieveDetail", method = RequestMethod.POST)	
	public HashMap retrieveDetail( @RequestBody Map<Object, Object> request ) throws Exception {
		HashMap reqMap = (HashMap) request.get("body");
		HashMap resMap = new HashMap();
		
		HashMap queryReqMap = new HashMap();
		
		queryReqMap.put("empNo", 	reqMap.get("empNo"));		
		
		resMap.put( "empDetailInfo", dpMbMapper.retrieveDetail( queryReqMap ) );
		
		//System.out.println( queryReqMap );
		//System.out.println( dpMbMapper.retrieveDetail( queryReqMap ) );
		
		return resMap;
	}
	
	/**
	 * @method updateEmployeeInfo - 직원상세정보수정
	 * @param {Map} request 
	 * 					empNo(String) 		- 직원번호
	 * 					firstName(String) 	- 이름
	 * 					lastName(String) 	- 성
	 * 					gender(String) 		- 성별
	 * 					birthDate(String) 	- 생년월일(ex. 951201 )
	 * 					title(String) 		- 직책명
	 * 					deptNo(String) 		- 부서번호 ( )
	 * 					deptName(String) 	- 부서명
	 * 
	 * @param {Map} resMap 	
	 * 					res(String)			- 성공 여부( 성공시 : 0 ) 					
	 */
	@SuppressWarnings("unchecked")		
	@RequestMapping(value="/updateEmployeeInfo", method = RequestMethod.POST)	
	public HashMap updateEmployeeInfo( @RequestBody Map<Object, Object> request ) throws Exception {
		HashMap reqMap = (HashMap) request.get("body");
		HashMap resMap = new HashMap();
		
		HashMap queryReqMap = new HashMap();
		
		queryReqMap.put("empNo", 		reqMap.get("empNo"));
		queryReqMap.put("firstName", 	reqMap.get("firstName"));
		queryReqMap.put("lastName", 	reqMap.get("lastName"));
		queryReqMap.put("gender", 		reqMap.get("gender"));
		queryReqMap.put("birthDate", 	reqMap.get("birthDate"));
		
		queryReqMap.put("title", 	reqMap.get("title"));
		queryReqMap.put("deptNo", 	reqMap.get("deptNo"));
		queryReqMap.put("deptName", reqMap.get("deptName"));
		
		dpCoMapper.updateEmployees(queryReqMap);
		dpCoMapper.updateTitles(queryReqMap);
		
		resMap.put( "res", "0" );		// 성공시
		
		return resMap;
	}
	
}