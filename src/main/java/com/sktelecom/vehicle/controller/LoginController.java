package com.sktelecom.vehicle.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sktelecom.vehicle.service.LoginService;
import com.sktelecom.vehicle.vo.LoginVo;


@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	LoginService loginService;
	
	@RequestMapping(value = "/Login")
	public String login(HttpServletRequest req, HttpServletResponse res) throws Exception {		
		return "login";
	}
	
	@ResponseBody
	@RequestMapping(value = "/SSOLogin",method=RequestMethod.POST)
	public Map<String,String> ssoLogin(@RequestBody LoginVo loginVo, HttpSession sess) {
			
		LoginVo user = loginService.checkUser(loginVo);
		Map<String,String> response = new HashMap<String,String>();
		if(user != null)
		{
			sess.setAttribute("LoginVo", user);
			response.put("result", "Y");
		} else
		{
			response.put("result", "N");
		}
		return response;
	}
	
	@GetMapping(value = "/Logout")
	public String logout(HttpServletRequest req, HttpSession sess) throws Exception {
		sess.removeAttribute("LoginVo");
		
		return "login";
	}
	
}
