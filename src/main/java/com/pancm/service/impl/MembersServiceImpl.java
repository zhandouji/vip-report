package com.pancm.service.impl;

import com.github.pagehelper.PageHelper;
import com.pancm.mapper.MembersMapper;
import com.pancm.pojo.entity.MemberEntity;
import com.pancm.service.MembersService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

@Service
public class MembersServiceImpl implements MembersService {

    @Resource
    private MembersMapper membersMapper;

    @Override
    public List<MemberEntity> findAll(int pageNum, int PageSize, String param) {
        if(StringUtils.isEmpty(param)){
            PageHelper.startPage(pageNum, PageSize);
            return membersMapper.findAll();
        }else {
            PageHelper.startPage(pageNum, PageSize);
            return getMembersByCondition(param);
        }
    }

    @Override
    public MemberEntity findOne(int id) {
        return membersMapper.findOne(id);
    }

    @Override
    public void saveOrUpdate(MemberEntity memberEntity) {
        if(Objects.equals(0, memberEntity.getId()) || Objects.isNull(memberEntity.getId())){
            //如果实体类中的id为0或者为空，则说明时新增，否则是修改
            membersMapper.saveOne(memberEntity);
            return;
        }
        membersMapper.updateOne(memberEntity);
        return;
    }

    @Override
    public void deleteOne(int id) {
        membersMapper.deleteOne(id);
    }

    @Override
    public List<MemberEntity> getMembersByCondition(String param) {
       return  membersMapper.getMembersByCondition(param);
    }
}
