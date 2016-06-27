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

import app.MyBatisTransactionManager;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
 
@Service("myBatisSupport")
public class MyBatisSupport {
 
	@Autowired(required = false)
	@Qualifier("sqlSession")
	protected SqlSessionTemplate sqlSession;
 
	@Autowired
	ApplicationContext applicationContext;
 
	public MyBatisTransactionManager getTransactionManager() {
		return applicationContext.getBean(MyBatisTransactionManager.class);
	}
}