package com.sktelecom.vehicle.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sktelecom.vehicle.vo.LoginVo;

@Repository("loginDao")
public class LoginDao {
	
	@Autowired
    protected SqlSessionTemplate sqlSession;
	
	public LoginVo checkUser(LoginVo loginVo)
	{
		return sqlSession.selectOne("Login.selectUserCheck", loginVo);
	}
}
