/**
 * 文件上传
 * @author shilinchuan
 * @date 2018/2/5
 **/

/**
 * 初始化上传信息 如果存在fileIds，imageIds优先使用，不实用files，images
 * @param maxCount 可上传最大数量
 * @param type 文件类型
 * @param fileIds 已有文件id，多个用","分割
 * @param imageIds 已有图片id，多个用","分割
 * @param files 已有图片，数据结构[{id:id,name:name}]
 * @param images 已有图片，数据结构[{id:id,name:name}]
 */
function initFileUpload(maxCount, type, fileIds, imageIds, files, images) {
  var txt = `
    <div class="file-upload-list-box">
      <button type="button" class="layui-btn layui-btn-xs" id="uploadFile" style="margin-bottom:4px">上传文件</button>
      <ul class="file-upload-list" id="fileList"></ul>
      <input type="hidden" id="maxCount" value="${maxCount}">
      <input type="hidden" id="fileType" value="${type}">
    </div>
  `;
  $("#fileUpload").html(txt);

  //根据字符串ids显示文件名称
  if (fileIds !== undefined && fileIds != null) {
    files = [];
    var fileIdArr = fileIds.split(',');
    if (fileIdArr != null && fileIdArr.length > 0) {
      $.each(fileIdArr, function (index, value) {
        var file = {id: value};
        files.push(file);
      });
    }
  }

  //根据字符串ids显示图片
  if (imageIds !== undefined && imageIds != null) {
    images = [];
    var imageIdArr = imageIds.split(',');
    if (imageIdArr != null && imageIdArr.length > 0) {
      $.each(imageIdArr, function (index, value) {
        var image = {id: value};
        images.push(image);
      });
    }
  }

  if (files !== undefined && files != null && files.length > 0) {
    appendFile(files);
  }
  if (images !== undefined && images != null && images.length > 0) {
    appendImage(images);
  }

  //刷新上传按钮
  refreshUploadFileBtn();
}

/**
 * 上传
 */
layui.use('upload', function () {
  var fileType = $('#fileType').val();
  var upload = layui.upload;
  //执行实例
  var uploadInst = upload.render({
    elem: '#uploadFile' //绑定元素
    , url: '/skynet/api/uploadFile' //上传接口
    , accept: 'file' //允许上传的文件类型
    , multiple: true
    , data: {type: fileType}
    , before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
      layer.load(2); //上传loading
    }
    , done: function (res) {
      //上传完毕回调
      //上传成功
      if (res.status) {
        var file = res.list[0];

        var fileType = 0;
        if (file.name != null && file.name.length > 0) {
          if (isImage(file.name)) {
            fileType = 1;
          }
        }

        if (fileType === 1) {
          //图片
          appendImage(res.list);
        } else {
          //文件
          appendFile(res.list);
        }
        refreshUploadFileBtn();
      } else {
        layer.msg(res.error);
      }
      layer.closeAll('loading'); //关闭loading
    }
    , error: function () {
      //请求异常回调
      layer.closeAll('loading'); //关闭loading
    }
  });
});

/**
 * 根据id删除li标签
 * @param id
 */
function deleteFile(id) {
  $("#li_file_id_" + id).remove();
  refreshUploadFileBtn();
}

/**
 * 图片格式文件后缀
 * @type {string}
 */
var imageSuffix = 'bmp,jpg,jpeg,png,gif';

/**
 * 判断是否为图片
 * @param name 文件名称
 */
function isImage(name) {
  var fileSuffix = name.substring(name.lastIndexOf('.') + 1, name.length);
  return imageSuffix.indexOf(fileSuffix) > -1;
}

/**
 * 图片显示
 * @param images
 */
function appendImage(images) {
  $.each(images, function (index, value) {
    var id = value.id;
    var name = (value.name === undefined ? ('附件图片' + (index + 1)) : value.name);

    var txt = `
      <li id="li_file_id_${id}" style="margin-bottom:4px"><span><img style="width: 40%; height: 40%" src="/skynet/web/file/${id}"/></span>
        <div><a class="file-upload-delete" onclick="deleteFile(\'${id}\')">删除</a></div>
        <input type="hidden" id="file_data_${id}" value="${id},${name}"/>
      </li>
    `;
    $("#fileList").append(txt);
  });
}

/**
 * 文件显示
 * @param files
 */
function appendFile(files) {
  $.each(files, function (index, value) {
    var id = value.id;
    var name = (value.name === undefined ? ('附件文件' + (index + 1)) : value.name);

    var txt = `
      <li id="li_file_id_${id}" style="margin-bottom:4px"><span>${name}</span>
        <div><a class="file-upload-delete" onclick="deleteFile(\'${id}\')">删除</a></div>
        <input type="hidden" id="file_data_${id}" value="${id},${name}"/>
      </li>
    `;
    $("#fileList").append(txt);
  });
}

/**
 * 判断是否显示上传按钮
 */
function refreshUploadFileBtn() {
  var maxCount = $('#maxCount').val();
  if (maxCount != 0) {
    var count = $("#fileList").children().length;
    maxCount = Number(maxCount);
    if (count >= maxCount) {
      $("#uploadFile").css("display", "none");
    } else {
      $("#uploadFile").css("display", "block");
    }
  }
}