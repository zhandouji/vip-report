package com.pancm.controller;

import com.pancm.dao.TransacationRecordRepository;
import com.pancm.pojo.bean.CommonsResponse;
import com.pancm.pojo.entity.TransactionRecordEntity;
import com.pancm.pojo.enums.ErrorCodeEnum;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;


/**
 * 兑换记录controller
 */
@RestController
public class TransactionRecordController {

    @Resource
    TransacationRecordRepository recordRepository;

    /**
     * 根据用户id查询该用户的兑换记录
     * @param id
     * @return
     */
    @GetMapping("/record/getRecordByMemberId")
    public CommonsResponse getRecordByMemberId(@RequestParam(name = "id", defaultValue = "0") int id){
        if(Objects.equals(0, id)){
            return CommonsResponse.successMsg(ErrorCodeEnum.ERROR_PARAM);
        }
        List<TransactionRecordEntity> recordEntities = recordRepository.findAllByMemberIdOrderByCreateTimeDesc(id);
        return CommonsResponse.successWithData(ErrorCodeEnum.SUCCESS, recordEntities);
    }

    /**
     * 获取所有的兑换记录
     * @return
     */
    @GetMapping("/record/getAllRecordList")
    public CommonsResponse getAllRecordList(String phone){
        List<TransactionRecordEntity> recordEntities;
        if(StringUtils.isEmpty(phone)){
            recordEntities = recordRepository.findAll(new Sort(Sort.Direction.DESC, "create_time"));
        }else {
            recordEntities = recordRepository.findAllByMobileOrderByCreateTimeDesc(phone);
        }
        return CommonsResponse.successWithData(ErrorCodeEnum.SUCCESS, recordEntities);
    }
}
