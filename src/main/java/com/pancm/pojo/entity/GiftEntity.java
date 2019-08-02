package com.pancm.pojo.entity;

import javax.persistence.*;

@Entity
@Table(name = "gift")
public class GiftEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    /**
     * 礼品名称
     */
    private String  name;
    /**
     * 单个礼品积分
     */
    private int score;
    /**
     * 礼品单位
     */
    private String unit;
    /**
     * 礼品剩余数量
     */
    private int count;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
