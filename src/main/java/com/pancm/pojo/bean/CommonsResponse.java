package com.pancm.pojo.bean;

import com.pancm.pojo.enums.ErrorCodeEnum;
import lombok.Getter;
import lombok.Setter;

/**
 * 返回信息实体类
 * @author Crane chen
 */
@Getter
@Setter
public class CommonsResponse {

    private int code;
    private String msg;
    private Object data;

    public CommonsResponse(int code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public CommonsResponse() {
    }

    public static CommonsResponse successMsg(ErrorCodeEnum codeEnum){

        return success(codeEnum.getCode(), codeEnum.getError(), null);
    }

    public static CommonsResponse successWithData(ErrorCodeEnum codeEnum, Object data){

        return success(codeEnum.getCode(), codeEnum.getError(), data);

    }

    public static CommonsResponse success(int code, String msg, Object data){
        CommonsResponse ret = new CommonsResponse();
        ret.code = code;
        ret.msg = msg;
        ret.data = data;
        return ret;
    }

}
