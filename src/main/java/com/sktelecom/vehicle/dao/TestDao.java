package com.sktelecom.vehicle.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository("testDao")
public class TestDao {
	
	@Autowired
    protected SqlSessionTemplate sqlSession;
    
    public String selectSampleData() {
        return sqlSession.selectOne("test.selectTestTable");
    }
}
