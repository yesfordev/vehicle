package com.sktelecom.vehicle.interceptor;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.sktelecom.vehicle.vo.LoginVo;

public class LoginInterceptor extends HandlerInterceptorAdapter  {
	
	private static final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);
	
	@Override	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		HttpSession session = request.getSession();
		
		if(session == null || session.getAttribute("LoginVo") == null) {			
			logger.info("SESSION => null");

			forbidden(request, response);
			return false;
			
		}
			logger.info("SESSION => " + ((LoginVo) session.getAttribute("LoginVo")).getEmpid());
		return true;
	}
	
	private void forbidden(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.sendRedirect("/Login");
	}
}
