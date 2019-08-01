package com.pancm.controller;

import java.util.List;

import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.enums.ErrorCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pancm.pojo.User;
import com.pancm.service.UserService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


/**
 * 
* Title: UserRestController
* Description: 
* 用户控制层
* Version:1.0.0  
* @author pancm
* @date 2018年3月19日
 */
@RestController
public class UserRestController {

		@Autowired
		private UserService userService;

	@GetMapping(value = "/index")
	public ModelAndView toIndex(){
		ModelAndView view = new ModelAndView("login");
		return view;
	}

	/**
	 * 跳转到会员管理页面
	 * @return
	 */
	@GetMapping(value = "/user/toUserListPage")
	public ModelAndView toUserListPage(){
		ModelAndView view = new ModelAndView("member/member");
		return view;
	}

	/**
	 * 加载会员管理数据
	 * @param pageNum
	 * @param pageSize
	 * @return
	 */
	@PostMapping(value = "/user/getUsersList")
	public CommonsResponse getUsersList(int pageNum, int pageSize){
		return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
	}

}
