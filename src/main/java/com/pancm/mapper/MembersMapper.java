package com.pancm.mapper;

import com.pancm.pojo.entity.MemberEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MembersMapper {

    @Select("select * from member")
    List<MemberEntity> findAll();

    @Select("select * from member where id = #{id}")
    MemberEntity findOne(@Param("id") int id);

    @Insert("insert into member(member_name, phone, sex, email, member_grade_id, person_phone, member_integral)values(#{memberName}, #{phone}, #{sex}, #{email}, #{gradeId},#{personPhone}, #{memberIntegral})")
    void saveOne(MemberEntity memberEntity);

    @Update("update member set member_name = #{memberName}, phone = #{phone}, sex = #{sex}, email = #{email}, member_grade_id = #{gradeId}, person_phone = #{personPhone}, member_integral = #{memberIntegral} where id = #{id}")
    void updateOne(MemberEntity memberEntity);

    @Delete("delete from member where id = #{id}")
    void deleteOne(int id);

    @Select("select * from member where member_name like CONCAT('%', #{param}, '%') or phone like CONCAT('%',#{param}, '%')")
    List<MemberEntity> getMembersByCondition(String param);
}
