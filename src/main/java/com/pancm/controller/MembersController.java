package com.pancm.controller;

import com.github.pagehelper.PageInfo;
import com.pancm.dao.GiftRepository;
import com.pancm.dao.TransacationRecordRepository;
import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.entity.GiftEntity;
import com.pancm.pojo.entity.MemberEntity;
import com.pancm.pojo.entity.TransactionRecordEntity;
import com.pancm.pojo.enums.ErrorCodeEnum;
import com.pancm.service.MembersService;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
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

    @Resource
    TransacationRecordRepository recordRepository;

    /**
     * 获取会员列表
     * @param pageNum
     * @return
     */
    @PostMapping(value = "/member/getMembersList")
    public ModelAndView getMembersList(HttpServletRequest request, @RequestParam(value = "pageNum",defaultValue = "1") int pageNum, String param){
        PageInfo<MemberEntity> pageInfo = membersService.findAll(pageNum, 10, param);
        List<GiftEntity> giftEntities = giftRepository.findAll();
        for (MemberEntity memberEntity : pageInfo.getList()) {
            for (GiftEntity giftEntity : giftEntities) {
                if(memberEntity.getMemberIntegral() > giftEntity.getScore()){
                    memberEntity.setGiftFlag(true);
                    continue;
                }
            }
        }
        ModelAndView view = new ModelAndView("member/member_list");
        Map<String, Object> res = new HashMap<>();
        res.put("totalRow", pageInfo.getTotal());
        res.put("currPage", pageInfo.getPageNum());
        res.put("list", pageInfo.getList());
        request.setAttribute("info", res);
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

    /**
     * 保存或者更新联系人
     * @param memberEntity
     * @return
     */
    @PostMapping(value = "/member/saveOrUpdate")
    public CommonsResponse saveOrUpdate(@RequestBody MemberEntity memberEntity){
        List<MemberEntity> memberEntities = membersService.getMembersByCondition(memberEntity.getPhone());
        if(!CollectionUtils.isEmpty(memberEntities) && !Objects.equals(memberEntities.get(0).getId(), memberEntity.getId())){
            return CommonsResponse.successMsg(ErrorCodeEnum.PHONE_EXIST);
        }
        if(!StringUtils.isEmpty(memberEntity.getPersonPhone())){
            List<MemberEntity> memberEntities1 = membersService.getMembersByCondition(memberEntity.getPersonPhone());
            if(CollectionUtils.isEmpty(memberEntities1)){
                return CommonsResponse.successMsg(ErrorCodeEnum.NO_PERSON_PHONE);
            }
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
        info.put("id", id);
        request.setAttribute("info", info);
        return view;
    }

    /**
     * 保存兑换记录
     * @return
     */
    @PostMapping("/member/saveGift")
    public CommonsResponse saveGift(@RequestParam(name = "count", defaultValue = "0") int count, String id, @RequestParam(value = "giftId", defaultValue = "0") int giftId){
        GiftEntity giftEntity = giftRepository.findOne(giftId);
        if(Objects.isNull(giftEntity)){
            return CommonsResponse.successMsg(ErrorCodeEnum.NO_GIFT);
        }
        //如果该礼品剩余数量小于兑换数，返回错误信息
        if(giftEntity.getCount() < count){
            return CommonsResponse.successMsg(ErrorCodeEnum.NO_COUNT_GIFT);
        }
        MemberEntity memberEntity = membersService.findOne(Integer.valueOf(id));
        //修改兑换用户的积分信息
        Long cScore = memberEntity.getMemberIntegral() - giftEntity.getScore() * count;
        if(cScore < 0){
            return CommonsResponse.successMsg(ErrorCodeEnum.NO_COUNT_SCORE);
        }
        memberEntity.setMemberIntegral(cScore);
        membersService.saveOrUpdate(memberEntity);
        //修改兑换物剩下的数量
        giftEntity.setCount(giftEntity.getCount() - count);
        giftRepository.saveAndFlush(giftEntity);

        //保存兑换记录
        TransactionRecordEntity recordEntity = new TransactionRecordEntity();
        recordEntity.setCount(count);
        recordEntity.setGiftId(giftId);
        recordEntity.setMemberId(Integer.valueOf(id));
        recordEntity.setMobile(memberEntity.getPhone());
        recordRepository.save(recordEntity);
        return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
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
}
