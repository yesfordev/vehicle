package com.sktelecom.vehicle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sktelecom.vehicle.dao.LoginDao;
import com.sktelecom.vehicle.vo.LoginVo;

@Service("loginService")
public class LoginService {
	
	@Autowired
	protected LoginDao loginDao;
	
	public LoginVo checkUser(LoginVo loginVo)
	{
		return loginDao.checkUser(loginVo);
	}

}
