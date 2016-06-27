package app.mapper.dp.mb;

import java.util.HashMap;

public interface DpMbMapper {	
	
	public HashMap[] retrieveList(HashMap reqMap) throws Exception;			// 조회결과
	
	public String retrieveListTotalNum(HashMap reqMap) throws Exception;	// 조회결과 Rows Total Number
	
	public HashMap[] retrieveDetail(HashMap reqMap) throws Exception;		// 조회상세	
	
}
