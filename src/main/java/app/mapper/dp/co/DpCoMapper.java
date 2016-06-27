package app.mapper.dp.co;

import java.util.HashMap;

public interface DpCoMapper {
	/*
	public void insertDepartments(HashMap reqMap) throws Exception;
	public void insertDeptEmp(HashMap reqMap) throws Exception;
	public void insertDeptManager(HashMap reqMap) throws Exception;
	public void insertEmployees(HashMap reqMap) throws Exception;
	public void insertSalaries(HashMap reqMap) throws Exception;
	public void insertTitles(HashMap reqMap) throws Exception;
	*/
	public void updateDepartments(HashMap reqMap) throws Exception;	// 부서 정보 Update
	
	public void updateDeptEmp(HashMap reqMap) throws Exception;		// 직원 정보 Update
	
	public void updateDeptManager(HashMap reqMap) throws Exception;	// 매니저 정보 Update
	
	public void updateEmployees(HashMap reqMap) throws Exception;	// 직원정보 Update
	
	public void updateSalaries(HashMap reqMap) throws Exception;	// 연봉 Update
	
	public void updateTitles(HashMap reqMap) throws Exception;		// 직책명 Update
	
	
	public HashMap retrieveUserLoginInfo(HashMap reqMap) throws Exception;	// 사용자 로그인 조회	
	
	public HashMap[] retrieveDeptList() throws Exception;			// 전체 부서 조회	
	
}
