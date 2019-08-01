package com.pancm.controller;

import com.pancm.dao.GiftRepository;
import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.entity.GiftEntity;
import com.pancm.pojo.entity.MemberEntity;
import com.pancm.pojo.enums.ErrorCodeEnum;
import com.pancm.service.MembersService;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 会员管理类
 */
@RestController
public class MembersController {

    @Resource
    private MembersService membersService;

    @Resource
    private GiftRepository giftRepository;

    /**
     * 获取会员列表
     * @param pageNum
     * @return
     */
    @PostMapping(value = "/member/getMembersList")
    public ModelAndView getMembersList(HttpServletRequest request, @RequestParam(value = "pageNum",defaultValue = "1") int pageNum, String param){
        List<MemberEntity> memberEntities = membersService.findAll(pageNum, 20, param);
        List<GiftEntity> giftEntities = giftRepository.findAll();
        for (MemberEntity memberEntity : memberEntities) {
            for (GiftEntity giftEntity : giftEntities) {
                if(memberEntity.getMemberIntegral() > giftEntity.getScore()){
                    memberEntity.setGiftFlag(true);
                    continue;
                }
            }
        }
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
        List<MemberEntity> memberEntities = membersService.getMembersByCondition(memberEntity.getPhone());
        if(!CollectionUtils.isEmpty(memberEntities)){
            return CommonsResponse.successMsg(ErrorCodeEnum.PHONE_EXIST);
        }
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

    /**
     * 兑换礼品
     * @param id
     * @return
     */
    @GetMapping("/member/getGift")
    public ModelAndView getGift(@RequestParam(value = "id", defaultValue = "0") int id, HttpServletRequest request){
        ModelAndView view = new ModelAndView("member/getGift");
        MemberEntity entity = membersService.findOne(id);
        List<GiftEntity> giftEntities = giftRepository.findAll();
        List<GiftEntity> giftList = new ArrayList<>();
        for (GiftEntity giftEntity : giftEntities) {
            if(entity.getMemberIntegral() > giftEntity.getScore()){
                giftList.add(giftEntity);
            }
        }
        Map<String, Object> info = new HashMap<>();
        info.put("list", giftList);
        info.put("memberIntegral", entity.getMemberIntegral());
        request.setAttribute("info", info);
        return view;
    }
}
