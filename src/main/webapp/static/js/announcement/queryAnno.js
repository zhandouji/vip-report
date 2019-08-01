//--------报警详情文件查找--------------//
function queryAnno() {
    var domain = $('#domain').val();
    var param = {};
    param.domain=domain;
    param = JSON.stringify(param);

    var indexOfLayer = layer.load(2, {time: 5000});
    $("#anno_tab_div").html('');
    $.ajax({
        url: BASESERVLET + "/web/annoOption/query",
        type: "post",
        contentType: "application/json",
        dataType: "html",
        data:param,
        success: function (data) {
            layer.close(indexOfLayer);
            $("#anno_tab_div").html(data);
        }
    });
}