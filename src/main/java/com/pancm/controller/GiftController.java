package com.pancm.controller;

import com.pancm.dao.GiftRepository;
import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.entity.GiftEntity;
import com.pancm.pojo.enums.ErrorCodeEnum;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 礼物管理类
 */
@RestController
public class GiftController {

    @Resource
    private GiftRepository giftRepository;

    @GetMapping("/gift/toGiftPage")
    public ModelAndView toGiftPage(){
        ModelAndView modelAndView = new ModelAndView("giftManager/giftManager");
        return modelAndView;
    }

    @GetMapping("/gift/getGiftLis")
    public ModelAndView getGiftLis(String name, HttpServletRequest request){
        List<GiftEntity> list;
        if(StringUtils.isEmpty(name)){
            list = giftRepository.findAll();
        }else {
            list = giftRepository.findByNameLike("%" + name + "%");
        }
        request.setAttribute("list", list);
        ModelAndView view = new ModelAndView("giftManager/giftManager_list");
        return view;
    }

    @GetMapping("/gift/editGift")
    public ModelAndView editGift(HttpServletRequest request, @RequestParam(value = "id", defaultValue = "0") int id){
        ModelAndView view = new ModelAndView("giftManager/edit");
        if(!Objects.equals(0, id)){
            GiftEntity entity = giftRepository.getOne(id);
            request.setAttribute("info", entity);
        }
        return view;
    }

    @PostMapping("/gift/saveOrUpdate")
    public CommonsResponse saveOrUpdate(GiftEntity giftEntity){
        giftRepository.saveAndFlush(giftEntity);
        return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
    }

    @GetMapping("/gift/delGift")
    public CommonsResponse delGift(@RequestParam(value = "id", defaultValue = "0") int id){
        giftRepository.delete(id);
        return CommonsResponse.successMsg(ErrorCodeEnum.SUCCESS);
    }
}
