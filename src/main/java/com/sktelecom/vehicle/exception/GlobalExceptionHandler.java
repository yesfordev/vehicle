package com.sktelecom.vehicle.exception;

import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import com.sktelecom.vehicle.exception.VehicleException;
import com.sktelecom.vehicle.vo.LoginVo;
import com.sktelecom.vehicle.utils.JsonUtils;
import com.sktelecom.vehicle.utils.StringUtil;


@ControllerAdvice
@RestController
public class GlobalExceptionHandler {
	
	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
	
	@ExceptionHandler(value=SQLException.class)
	public void sqlExceptionHandle(SQLException ex, HttpServletRequest request ,  HttpServletResponse response){
		
		logger.error("sqlExceptionHandle "+ getClass().getName(),ex);
		
		Map<String,Object> result = new HashMap<String,Object>();
		
		result.put("Status",500);
		result.put("Message", ex.getMessage());
		
		exceptionRequestHandle(request, response ,result,"sqlex");
		
	}
	
	@ExceptionHandler(value=RuntimeException.class)
	public void runtimeExceptionHandle(RuntimeException ex, HttpServletRequest request ,  HttpServletResponse response){
		
		logger.error("runtimeExceptionHandle : ", getClass().getName(),ex);
		
		Map<String,Object> result = new HashMap<String,Object>();
		
		result.put("Status",500);
		result.put("Message", ex.getMessage());
		
		exceptionRequestHandle(request, response ,result,"runtimeex");
	}
	
	@ExceptionHandler(value=VehicleException.class)
	public void vehicleExceptionHandle(VehicleException ex, HttpServletRequest request ,  HttpServletResponse response, Locale locale){
		

		Map<String,Object> result = new HashMap<String,Object>();
		
		result.put("Status",ex.getErrorCode() > 0 ? ex.getErrorCode() : 500);
		result.put("Message", ex.getErrorMessage());
		
		exceptionRequestHandle(request, response ,result, "hrsex");
			
	}
	
	@ExceptionHandler(value=Exception.class)
	public void exceptionHandle(VehicleException ex, HttpServletRequest request ,  HttpServletResponse response){
		
		logger.error(getClass().getName(),ex);
		
		Map<String,Object> result = new HashMap<String,Object>();
		
		result.put("Status",ex.getErrorCode() > 0 ? ex.getErrorCode() : 500);
		result.put("Message", ex.getErrorMessage());
		
		exceptionRequestHandle(request, response ,result,"ex");
	}
	
	private void exceptionRequestHandle(HttpServletRequest request, HttpServletResponse response ,Map<String,Object> result ) {
		exceptionRequestHandle(request ,response , result  , "connError");
	}
	
	private void exceptionRequestHandle(HttpServletRequest request, HttpServletResponse response ,Map<String,Object> result, String pageName) {
		
		LoginVo loginVo = (LoginVo) (request.getSession().getAttribute("LoginVo"));
		logger.error("EXCEPTION LoginVo : {}", loginVo.toString());
		
		String headerInfo = request.getHeader("X-Requested-With");
		
		if("XMLHttpRequest".equals(headerInfo)){
			response.setContentType("application/json;charset=UTF-8");
			response.setStatus(HttpStatus.OK.value());
			result.put("Status", 500);

			Writer writer=null;
			try {
				writer = response.getWriter();
				writer.write(result.toString());				
			} catch (IOException e) {
				e.printStackTrace();
			}finally{
				if(writer!=null){ try {writer.close();} catch (IOException e) {}};
			}
		}else{
			try {
				response.sendRedirect("/error/500");
			} catch (IOException e1) {
				logger.error("exceptionRequestHandle sendRedirect error ", e1);
			}
		}		
	}

}
