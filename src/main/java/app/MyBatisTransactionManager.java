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

import org.apache.ibatis.transaction.TransactionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionException;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
 
@Service
@Scope("prototype")
public class MyBatisTransactionManager extends DefaultTransactionDefinition {
 
	 private static final long serialVersionUID = -1375151959664915520L;
	 
	 @Autowired
	 PlatformTransactionManager transactionManager;
	 
	 TransactionStatus status;
	 
	 /*
	 protected TransactionStatus getTransaction() {
		 DefaultTransactionDefinition definition = new DefaultTransactionDefinition();
		 definition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
		 return transactionManager.getTransaction(definition);
	 }	 
	 */
	 
	 /*
	 private TransactionDefinition getDefinition(int isolationLevel, boolean isReadOnly){
		 DefaultTransactionDefinition def = new DefaultTransactionDefinition(TransactionDefinition.PROPAGATION_REQUIRED);
		 
		 TransactionFactory TransactionFactory =  new TransactionFactory().
		 
		 def.setTimeout(5000);
		 def.setReadOnly(isReadOnly);
		 def.setIsolationLevel(isolationLevel);
	  
		 return def;
	 }
	 */
	 
	 public void start() throws TransactionException {
		 System.out.println("Start Transaction");		 
		 
		 status = transactionManager.getTransaction( new DefaultTransactionDefinition() );		 
		 
		 //status = transactionManager.getTransaction( new DefaultTransactionDefinition() );		 
		 
		 //status = transactionManager.getTransaction( getDefinition(TransactionDefinition.ISOLATION_READ_COMMITTED, false) );
		 //transactionManager.getTransaction(this);
		 
		 System.out.println(status.toString());
	 }
	 
	 public void commit() throws TransactionException {
		 System.out.println("Commit Transaction");
		 
		 if (!status.isCompleted()) {
			 transactionManager.commit(status);
		 }		 
	 }
	 
	 public void rollback() throws TransactionException {
		 System.out.println("Rollback Transaction");
		 
		 if (!status.isCompleted()) {
			 transactionManager.rollback(status);
		 }		 
	 }
	 
	 public void end() throws TransactionException {
		 System.out.println("End Transaction");
		 
		 rollback();		 
	 }
}
