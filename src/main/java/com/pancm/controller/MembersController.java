package com.pancm.controller;

import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.entity.MemberEntity;
import com.pancm.pojo.enums.ErrorCodeEnum;
import com.pancm.service.MembersService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 会员管理类
 */
@RestController
public class MembersController {

    @Resource
    private MembersService membersService;

    /**
     * 获取会员列表
     * @param pageNum
     * @return
     */
    @PostMapping(value = "/member/getMembersList")
    public ModelAndView getMembersList(HttpServletRequest request, @RequestParam(value = "pageNum",defaultValue = "1") int pageNum, String param){
        List<MemberEntity> memberEntities = membersService.findAll(pageNum, 20, param);
        ModelAndView view = new ModelAndView("member/member_list");
        request.setAttribute("list", memberEntities);
        return view;
    }

    /**
     * 查询单个会员
     * @param request
     * @param id
     * @return
     */
    @GetMapping(value = "/member/getMemberById")
    public ModelAndView getMemberById(HttpServletRequest request, @RequestParam(value = "id", defaultValue = "0") int id){
        ModelAndView view = new ModelAndView("member/member_edit");
        if(id != 0){
            request.setAttribute("info", membersService.findOne(id));
        }
        return view;
    }

    @PostMapping(value = "/member/saveOrUpdate")
    public CommonsResponse saveOrUpdate(@RequestBody MemberEntity memberEntity){
        membersService.saveOrUpdate(memberEntity);
        return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
    }

    @GetMapping("/member/deleteOne")
    public CommonsResponse deleteOne(int id){
        membersService.deleteOne(id);
        return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
    }

    /**
     * 根据条件查询会员
     * @param param
     * @return
     */
    @PostMapping("/memeber/getMembersByCondition")
    public CommonsResponse getMembersByCondition(String param){
        List<MemberEntity> entities = membersService.getMembersByCondition(param);
        return CommonsResponse.successWithData(ErrorCodeEnum.SUCCESS, entities);
    }
}
