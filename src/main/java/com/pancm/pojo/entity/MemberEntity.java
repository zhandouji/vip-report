package com.pancm.pojo.entity;

import java.time.LocalDate;
import java.util.Date;

public class MemberEntity {

    private int id;
    private String memberName;
    private String phone;
    private LocalDate birthday;
    private String sex;
    //会员等级
    private MemberGradeEntity memberGrade;
    private int gradeId;
    //会员积分
    private Long memberIntegral;
    //会员余额
    private Float balance;
    //会员状态 挂失、停用、正常
    private String state;
    private String email;
    private Date createTime;
    private Date updateTime;
    /**
     * 推荐人手机号
     */
    private String personPhone;



    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBirthday() {
        return birthday.toString();
    }

    public void setBirthday(String birthday) {
        this.birthday = LocalDate.parse(birthday);
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }


    public Long getMemberIntegral() {
        return memberIntegral;
    }

    public void setMemberIntegral(Long memberIntegral) {
        this.memberIntegral = memberIntegral;
    }

    public Float getBalance() {
        return balance;
    }

    public void setBalance(Float balance) {
        this.balance = balance;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LocalDate getLocalDate(){
        return this.birthday;
    }

    @Override
    public String toString() {
        return "Member{" +
                "id='" + id + '\'' +
                ", memberName='" + memberName + '\'' +
                ", phone='" + phone + '\'' +
                ", birthday=" + birthday +
                ", sex='" + sex + '\'' +
                ", memberGrade=" + memberGrade +
                ", memberIntegral=" + memberIntegral +
                ", balance=" + balance +
                ", state='" + state + '\'' +
                '}';
    }

    public void setMemberGrade(MemberGradeEntity memberGrade) {
        this.memberGrade = memberGrade;
    }

    public MemberGradeEntity getMemberGrade() {
        return memberGrade;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getGradeId() {
        return gradeId;
    }

    public void setGradeId(int gradeId) {
        this.gradeId = gradeId;
    }

    public String getPersonPhone() {
        return personPhone;
    }

    public void setPersonPhone(String personPhone) {
        this.personPhone = personPhone;
    }
}
