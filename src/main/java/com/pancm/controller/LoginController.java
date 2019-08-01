package com.pancm.controller;

import com.pancm.pojo.bean.UserInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {

    @RequestMapping(value = "/web/login", method = RequestMethod.POST,
            consumes = {"application/x-www-form-urlencoded;charset=UTF-8"})
    public ModelAndView login( UserInfo userInfo){
        ModelAndView view = new ModelAndView();
        if(StringUtils.isBlank(userInfo.getUserName()) || StringUtils.isBlank(userInfo.getPassword())){
            view.setViewName("login");
            return view;
        }
        view.setViewName("home/alarm_console");
        return view;

    }
}
