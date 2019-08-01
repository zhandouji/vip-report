/**添加layer*/
function addClueAd1() {
        var id= $("#filesId").val();
    if(''==id){
        $("#filesId").html("文件为空");
        return false;
    }
    var adDesc=$("input[name='adDesc']").val();
    var areaCode=$("input[name='areaCode']").val();
    if(''==areaCode){
        $("#areaCode").html("地区编码不能为空");
        return false;
    }
        var adType=$("select[name='adType']").val();
        var jsonClueAd = {
            "adFile":id,
            "adDesc":adDesc,
            "areaCode":areaCode,
            "adType":adType
        }
        jsonClueAd=JSON.stringify(jsonClueAd);
        $.ajax({
            url:"/skynet/api/saveClueAd",
            type:"post",
            contentType:"application/json",
            dataType: "json",
            data:jsonClueAd,
            success:function(data){
                if(data.status==true){
                    layer.msg("保存成功55", {shift: -1,time:1000},function(){
                        layer.close();
                        queryAdFile();
                    });

                    $('input:text').each(function(idx,item){
                        $(item).val("");
                    })
                    $('input:file').each(function(idx,item){
                        $(item).val("");
                    })
                    $('select').find('option').each(function(idx,item) {
                        if($(item).val()=='000'){
                            $(item).attr('selected','selected')
                        }
                    })
                }else{
                    layer.msg("保存失败，已存在111");
                }
            }
        });
}


