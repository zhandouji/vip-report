package com.pancm.pojo.bean;

import java.util.HashMap;
import java.util.Map;

public enum SortDirection {

    ASC(1, "asc"),
    DESC(2, "desc");

    private int value;
    private String desc;

    private static final Map<Integer, SortDirection> intToTypeMap = new HashMap<>();

    static {
        for (SortDirection type : SortDirection.values()) {
            intToTypeMap.put(type.value, type);
        }
    }

    public static SortDirection fromInt(int value) {
        SortDirection type = intToTypeMap.get(value);
        if (type == null) {
            return DESC;
        }
        return type;
    }


    private SortDirection(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

}
