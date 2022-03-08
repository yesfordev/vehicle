package com.sktelecom.vehicle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import org.springframework.web.servlet.ModelAndView;

import com.sktelecom.vehicle.service.TestService;

@Controller	
public class TestController {
	
	@Resource(name="testService")
	private TestService testService;
	
	@RequestMapping("/test")
    public ModelAndView sampleView(ModelAndView mv) throws Exception {
        mv.addObject("testAttribute", testService.selectTestData());
        mv.setViewName("test");
        return mv;
    }
}
