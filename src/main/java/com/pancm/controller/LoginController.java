package com.pancm.controller;

import com.pancm.pojo.bean.UserInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Objects;

@RestController
public class LoginController {

    @Value("${user.loginName}")
    private String userName;

    @Value("${user.pwd}")
    private String password;

    @RequestMapping(value = "/web/login")
    public ModelAndView login(UserInfo userInfo, HttpServletRequest request){
        ModelAndView view = new ModelAndView();
        if(StringUtils.isBlank(userInfo.getUserName()) || StringUtils.isBlank(userInfo.getPassword())){
            view.setViewName("login");
            return view;
        }
        if(Objects.equals(userInfo.getUserName(), userName) && Objects.equals(password, userInfo.getPassword())){
            request.getSession(true).setAttribute("userName", userName);
            view.setViewName("home/index");
        }else {
            request.setAttribute("error", "密码不正确");
            view.setViewName("login");
        }
        return view;
    }

    @GetMapping("/web/logout")
    public void webLogOut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getSession().invalidate();
        request.logout();
        request.getRequestDispatcher("login").forward(request, response);
    }

}
