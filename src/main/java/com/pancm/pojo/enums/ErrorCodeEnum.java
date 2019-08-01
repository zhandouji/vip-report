package com.pancm.pojo.enums;

public enum ErrorCodeEnum {

    SUCCESS(200, "请求成功"),
    ERROR(500, "发生异常"),
    NO_DATA(300, "没有数据"),
    ERROR_PARAM(403, "错误的参数"),
    LOGIN_ERROR(466, "授权错误"),
    OVERTIME(110, "TOKEN过期"),
    INVALID(401, "权限不足"),
    INVALID_PASSWORD(471, "密码过期"),
    CUSTOM_ERROR(100, "自定义错误消息"),
    NOT_SUPPORTED(410, "提交内容不合法"),
    TOO_FREQUENT(445, "太频繁的调用"),
    NO_HANDLER(404, "找不到请求"),
    UNKNOWN_ERROR(499, "未知错误"),
    DATA_EXISTS(201, "数据已经存在"),
    UPLOAD_FILED(202, "文件上传失败"),
    IMPORT_FILED(203, "Fail to import, duplicate data exists"),
    IMPORT_SUCCESS(204, "导入成功"),
    LOWER_LEVELS_HAS_DATA(205, "下级节点还存在数据"),
    FILE_NOT_FOUND(206, "文件未找到"),
    NORMAL_COMPANY_NOT_EXISTS(210, "The standard company name not exists"),
    NORMAL_COMPANY_EXISTS(207, "The standard company name already exists"),
    ORIGINAL_NAME_EXISTS(208, "The original company name already exists"),
    ORIGINAL_NAME_NOT_EXISTS(211, "The original company name not exists"),
    PENDING_COUNT(209, "存在未处理的数据"),
    SOFTWARE_PROCESS(351, "查重程序正在运行"),
    DATA_HAS_BEAN_PROCESSED(352, "数据已经被处理"),
    NORMAL_COMPANY_EMPTY(212, "The standard company name cannot be empty"),
    NORMAL_COMPANY_ERROR(213, "The company is not a top company"),
    NORMAL_COMPANY_REPEATED(214, "The name of the company is repeated"),
    NO_USER(215, "未找到该用户"),
    ELOQUA_ID_EXISTS(216, "eloquaID already exists"),
    ELOQUA_ID_EXISTS2(217, "eloquaID already exists in the document"),

    NO_DATA_TO_PROCESSED(353,"没有需要处理的疑似重复数据"),
    TEMPLATE_ERROR(354, "模板数据异常");

    // 普通方法
    static String getName(int code) {
        for (ErrorCodeEnum c : ErrorCodeEnum.values()) {
            if (c.getCode() == code) {
                return c.error;
            }
        }
        return null;
    }


    ErrorCodeEnum(int code, String error) {
        this.code = code;
        this.error = error;
    }

    private int code;
    private String error;

    public int getCode() {
        return code;
    }

    public String getError() {
        return error;
    }

}
