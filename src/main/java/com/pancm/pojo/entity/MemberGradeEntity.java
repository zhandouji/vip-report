package com.pancm.pojo.entity;


public class MemberGradeEntity {

    private Integer id;
    //等级名
    private String gradeName;
    //折扣
    private Float discount;
    //备注信息
    private String comment = "";

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGradeName() {
        return gradeName;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }

    public Float getDiscount() {
        return discount;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    @Override
    public String toString() {
        return "MemberGrade{" +
                "id=" + id +
                ", gradeName='" + gradeName + '\'' +
                ", discount=" + discount +
                ", comment='" + comment + '\'' +
                '}';
    }
}
