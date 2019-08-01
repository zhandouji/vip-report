package com.pancm.pojo.bean;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * 用户实体类
 */
@Getter
@Setter
public class UserInfo {
    private int id;
    private String userName;
    private String name;
    private String phone;
    private String password;
}
