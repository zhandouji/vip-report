package com.pancm.service;

import com.pancm.pojo.entity.MemberEntity;

import java.util.List;

public interface MembersService {

    List<MemberEntity> findAll(int pageNum, int PageSize, String param);

    MemberEntity findOne(int id);

    void saveOrUpdate(MemberEntity memberEntity);

    void deleteOne(int id);

    List<MemberEntity> getMembersByCondition(String param);
}
