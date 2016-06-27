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

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@MapperScan(value={"app.mapper"})
public class Application {
	
	@Bean
	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource);

		Resource[] arrResource = new PathMatchingResourcePatternResolver()
				.getResources("classpath:mapper/*.xml");
		sqlSessionFactoryBean.setMapperLocations(arrResource);

		return sqlSessionFactoryBean.getObject();
	}
	
	// Defined as a nested config to ensure WebMvcConfigurerAdapter is not read when not
	// on the classpath
	@Configuration		
	public static class WebMvcAutoConfigurationAdapter extends WebMvcConfigurerAdapter {
		
		private HandlerInterceptor yourInjectedInterceptor =  new InterCeptor();

		@Override
		public void addInterceptors(InterceptorRegistry registry) {
			
			registry.addInterceptor(yourInjectedInterceptor);			
		}
		
		@Override
		public void addResourceHandlers(ResourceHandlerRegistry registry) {
			if (!registry.hasMappingForPattern("/default/**")) {
				registry.addResourceHandler("/default/**").addResourceLocations(
						"classpath:/view/");
			}
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
