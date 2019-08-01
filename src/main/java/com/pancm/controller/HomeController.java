package com.pancm.controller;

import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.enums.ErrorCodeEnum;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class HomeController {

    /**
     * 跳转到登陆的页
     * @return
     */
    @GetMapping(value = "/")
    public ModelAndView loginPage(){
        ModelAndView view = new ModelAndView("login");
        return view;
    }

    @PostMapping(value = "/toLogin")
    public CommonsResponse toLogin(String userName, String passWord){
        if(StringUtils.isEmpty(userName) || StringUtils.isEmpty(passWord)){
            return CommonsResponse.successMsg(ErrorCodeEnum.LOGIN_ERROR);
        }
        //根据用户名查询用户信息
        if(false){
            //如果没有查询到该用户，则返回登陆失败
            return CommonsResponse.successMsg(ErrorCodeEnum.ERROR_PARAM);
        }else {
            //如果该用户存在，则验证该用户的密码是否和输入的一致
            if(false){
                //如果不一致，则返回登陆失败
            }else {
                //如果一致，则返回登陆成功
                return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
            }
        }
        return CommonsResponse.successMsg(ErrorCodeEnum.ERROR_PARAM);
    }
}
