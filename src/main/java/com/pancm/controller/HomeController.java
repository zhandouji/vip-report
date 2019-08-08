package com.pancm.controller;

import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.enums.ErrorCodeEnum;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Objects;

@RestController
public class HomeController {

    /**
     * 跳转到登陆的页
     * @return
     */
    @GetMapping(value = {"/index", "/"})
    public ModelAndView loginPage(HttpServletRequest request){
        ModelAndView view = new ModelAndView();
        HttpSession session = request.getSession();
        if (session.getAttribute("userName") == null){
            view.setViewName("login");
            return view;
        }
        view.setViewName("home/index");
        return view;
    }

    @RequestMapping(value = "/toLogin")
    public ModelAndView toLogin(){
        ModelAndView view = new ModelAndView("login");
        return view;
    }
}
