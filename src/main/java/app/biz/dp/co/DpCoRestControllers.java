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

package app.biz.dp.co;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.mapper.dp.co.*;


@RestController
@RequestMapping(value="/biz/dp/co")
public class DpCoRestControllers {
	
	@Autowired
	private DpCoMapper DpCoMapper;	
	
	/**
	 * @method retrieveDeptList - 부서목록조회
	 * @param {Map} request 
	 * @param {Map} resMap 	 
	 * 					deptList(Array[Map])	- 부서목록
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/retrieveDeptList", method = RequestMethod.POST)	
	public HashMap retrieveList( @RequestBody Map<Object, Object> map ) throws Exception {
		HashMap reqMap = (HashMap) map.get("body");
		HashMap resMap = new HashMap();
		
		resMap.put( "deptList", DpCoMapper.retrieveDeptList() );
		
		return resMap;
	}	
	
}