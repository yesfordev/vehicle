package com.sktelecom.vehicle.service;

import org.springframework.stereotype.Service;
import com.sktelecom.vehicle.dao.TestDao;
import org.springframework.beans.factory.annotation.Autowired;

@Service("testService")
public class TestService {

	@Autowired
	protected TestDao testdao;
	
	public String selectTestData() {
        String serviceTest = testdao.selectSampleData();
        
        serviceTest = "로직적용 " + serviceTest;
        return serviceTest;
    }

}
