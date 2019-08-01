
//--------报警详情修改--------------//
function descriptionEdit(){
    var ad_id=$('#ad_id').val();
    var ad_content=$('#ad_description');
    $.ajax({
        type:"post",
        url:BASESERVLET+"/web/alarmDescription/save",
        data:{
            id:ad_id,content:ad_content.val(),
		},
        dataType:"json",
        success:
            function(success){
            alert("修改成功！");
        }
    });
}

