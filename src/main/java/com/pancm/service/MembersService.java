package com.pancm.service;

import com.github.pagehelper.PageInfo;
import com.pancm.pojo.entity.MemberEntity;

import java.util.List;

public interface MembersService {

    PageInfo findAll(int pageNum, int PageSize, String param);

    MemberEntity findOne(int id);

    void saveOrUpdate(MemberEntity memberEntity);

    void deleteOne(int id);

    List<MemberEntity> getMembersByCondition(String param);

    Integer getListCount(String param);
}
