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

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.HandlerMapping;

/* Controller ( URL ) */
@Controller
@PropertySource("classpath:url_map.properties")
public class Controllers {
	
	@Autowired
	private Environment env;
	
	final private String RETURN_URL = "index";
    
	@RequestMapping({"*.do", "*/*.do", "*/*/*.do"})
	public String urlMappingHandler( final HttpServletRequest request, Model model) {
		
		String inpUrlStr = (String) request.getAttribute( HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);		
		String propertyNm = inpUrlStr.substring(1).replaceAll("/", "_").replace(".do", "");
		String pathStr = null;
		
		if( propertyNm.equals("") )	propertyNm = "main";
		
		pathStr = env.getProperty(propertyNm);
		
		model.addAttribute( "targetCtrlPath", pathStr);
		
		//model.addAttribute("name", "SpringBlog from Millky");		
		/*
		System.out.println("-------------------------");
		System.out.println( pathStr );
		System.out.println("-------------------------");
		*/
		
		return RETURN_URL;
	}
}
