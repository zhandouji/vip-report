
//videoOption条目删除
//详情，编辑超链接 跳转页面
function optionDelete(id){
    layer.confirm('删除后不可恢复，确认删除吗？', {
        btn: ['是','否'] //按钮
    }, function(){
        $.ajax({
            url:BASESERVLET+"/web/annoOption/delete",
            type:"post",
            dataType: "json",
            data:"id="+id,
            success:function(data){
                layer.msg('已删除');

            }
        });
    }, function(){
        layer.msg("已取消删除");
    });
}

/**添加*/
function addAnnoOption(){
    layer.open({
        type:2,
        title:'添加公告信息',
        shadeClose:true,
        shade:0.8,
        area:['500px','300px'],
        content:"/skynet//web/annoOption/add"
    })
}

/**编辑*/
function updateAnnoOption(id){
    layer.open({
        type:2,
        title:'编辑',
        shadeClose:true,
        shade:0.8,
        area:['500px','300px'],
        content:"/skynet//web/annoOption/edit?id="+id
    })
}

function saveOption(id,domain,announcement) {
    $.ajax({
        url:"/skynet//web/annoOption/save",
        type:"post",
        dataType: "json",
        data:{id:id,domain:domain,announcement:announcement},
        success:function(data){
            parent.layer.msg('修改成功', {shift: -1,time:1000},function(){
                layer.close();
            });
        }
    });
}

/**添加*/
function addOption(domain,announcement) {
    $.ajax({
        url:"/skynet//web/annoOption/save",
        type:"post",
        dataType: "json",
        data:{domain:domain,announcement:announcement},
        success:function(data){
            parent.layer.msg('添加成功', {shift: -1,time:1000},function(){
                layer.close();
            });
        }
    });
}
