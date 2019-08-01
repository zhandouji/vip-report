/**
 * H5活动核心JS 此JS依赖jQuery 和 animate.css
 * 
 */

window.SR_H5CORE = {
	config : {
		pageWidth : 640, //稿件宽度
		pageHeight : 1000, //稿件高度
		stopScroll : false, //是否禁止滑动屏幕
		lanscape : false, //是否创建禁止横屏提示
		hidePage : false, //是否创建预加载弹层，防止图片突然变大的BUG
		hidePageClass : ".page" //需要隐藏的元素的选择符，只支持CSS的选择符，与hidePage属性配合使用，如果hidePage为false,该属性没有意义
	},
	winHeight : $(window).height(),
	zoom : 1, //页面缩放比例
	isAndroid : navigator.userAgent.indexOf('Android')>-1, //是否为安卓机
	readList : [],
	musicList : {},
	ready : function (fun) {
		/**
		 * 预备事件，表示页面尺寸已经初始化完成
		 * 参数是一个函数，将该函数推入预执行数组中
		 */
		typeof fun == "function" && this.readList.push(fun);
	},
	initPageHeight : function () {
		//初始化页面.page-con-auto尺寸
		var self = this;
		if(self.winHeight > self.config.pageHeight){
			$(".page-con-auto").css({width:self.config.pageWidth,height:self.config.pageHeight,top:(self.winHeight-self.config.pageHeight)/2});
		}else{
			self.zoom = self.winHeight / self.config.pageHeight;
			$(".page-con-auto").css({width:self.config.pageWidth*self.zoom,height:self.config.pageHeight*self.zoom,left:(self.config.pageWidth-self.config.pageWidth*self.zoom)/2});
		}

		//创建禁止横屏提示
		self.config.lanscape && $("<div id=\"lanscape\"></div>").appendTo("body");

		/**
		 * 初始化图片尺寸和所有直接子元素的坐标
		 * 初始化.page-con-auto中所有直接子元素的坐标，需设置 data-position="200,150",属性{200:表示left,150:表示top}
		 * 如果图片设置了.w100类，则不会重置尺寸
		 */
		self.imgNum = $(".page-con-auto img").length;
		$(".page-con-auto *").each(function (index,element) {
			if(element.tagName == "IMG"){
				var newimg = new Image();
				newimg.onload = function () {
					$(element).css({width:this.width*self.zoom});

					var size = $(element).data("size");
					if(typeof size === "string" && size != ""){
						size = size.split(",");
						$(element).css({width:size[0] * self.zoom,height:size[1] * self.zoom});
					}

					$(element).is(".w100") && $(element).css({width:"100%"});
					//删除通过hidePageClass属性创建的样式表
					--self.imgNum == 0 && $("#hide-page-style").remove();
					/*if(--self.imgNum == 0){
					 $("#hide-page-style").remove();
					 for(var i=0;i<self.readList.length;i++){
					 self.readList[i].call();
					 }
					 }*/
				}
				newimg.onerror = function(){
					--self.imgNum == 0 && $("#hide-page-style").remove();
				}
				newimg.src = element.src;
			}

			var position = $(element).data("position");
			if(typeof position === "string" && position != ""){
				position = position.split(",");
				var left = parseInt(position[0])/self.config.pageWidth*100+"%";
				var top = parseInt(position[1])/self.config.pageHeight*100+"%";
				$(element).css({position:"absolute",left:left,top:top});
			}

			var size = $(element).data("size");
			if(typeof size === "string" && size != ""){
				size = size.split(",");
				$(element).css({width:size[0] * self.zoom,height:size[1] * self.zoom});
				if($(element).is(".iscroll")){
					$(element).data("iscroll-height",size[1]);
				}
			}
		});
		
		//初始化页面上的视频尺寸，保证全屏可以显示（当视频需要内嵌式播放时使用，且只能在IOS中实现，且视频需设置 webkit-playsinline 属性）
		if(self.winHeight > self.config.pageHeight){
			$(".page-video video").css({width:"auto",height:"100%",marginLeft:(self.config.pageWidth-self.config.pageWidth*self.zoom)/2});
		}else{
			$(".page-video video").css({width:"100%",height:"auto"});
		}

		/**
		 * 执行预备函数
		 * 该函数会在.page-con-auto尺寸初始化完成后后执行
		 * 但是该函数中仍然无法准确获取图片的宽高 （一种解决方案是放到）
		 */
		for(var i=0;i<self.readList.length;i++){
			self.readList[i].call();
		}
	},
	btnClick : function(ele,callback,animation){
		if(!animation) animation = 'animated rubberBand';
		//按钮单击事件
		if(!$(ele).data("click")){
			$(ele).data("click",true);
			//webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend
			$(ele).one("webkitAnimationEnd", function(){
				$(ele).removeClass(animation);
				$(ele).data("click",false);
				if(callback)callback.call(ele);
			});
			$(ele).addClass(animation);
		}
	},
	showErr : function (opt) {
		/**
		 * 错误弹窗 HTML结构如下：
		 * <div class="error-hook">
		 * 		<div class="error-box">
		 * 			<h2>操作失败</h2>
		 * 			<div class="msg"></div>
		 * 			<button type="button" class="closes"></button>
		 * 			<button type="button" class="closes2"></button>
		 * 		</div>
		 * </div>
		 */
        opt = $.extend({
            type : '', //默认是错误弹窗、如果使用成功可传递"ok"
            msg : '', //弹窗的提示文本 支持HTML
			closeBtn : false, //是否显示右上角的叉
			btnTxt : '确定', //按钮上的文字
            stopClose : false, //是否不关闭弹层，直接执行回调函数，适用刷新页面时 如：location.reload();
            callback : $.noop
        },opt||{});
        $('.error-box').attr("class","error-box").addClass(opt.type);
        $('.error-box div.msg').html(opt.msg);
        $('.error-hook').show();
		!opt.closeBtn && $('.error-box .closes').remove();
		$('.error-box .closes').one('touchend', function () {$('.error-hook').hide();return false;});
		$('.error-box .closes2').text(opt.btnTxt).one('touchend', function () {
            if(opt.stopClose){
                opt.callback.call(this);
            }else{
                $('.error-hook').hide();
                opt.callback.call(this);
            }
            return false;
        });
    },
	showLoad : function () {
		/**
		 * loading框  HTML结构如下：
		 * <div class="loading-box">
		 * 		<div class="loading">
		 * 			<p>请稍后</p>
		 * 		</div>
		 * </div>
		 */
		$('.loading-box').show();
	},
	hiddenLoad : function () {
		$('.loading-box').hide();
	},
	preloadMusic : function () {
		//预处理声音
		var self = this;
		self.musicList.ready = false;
		if (document.addEventListener) {
			document.addEventListener("WeixinJSBridgeReady", function () {
				$(".bgm").each(function (index, element) {
					self.musicList[element.id] = element;
					element.autoplay && element.play();
				});
				self.musicList.ready = true;
			}, false);
		}
	},
	playMusic : function (id,load) {
		//播放声音
		if(this.musicList.ready){
			load && this.musicList[id].load(); //如果需要从头播放，需要给load传true
			this.musicList[id].play();
		}else{
			var music = document.getElementById(id);
			load && music.load(); //如果需要从头播放，需要给load传true
			music.play();
		}
	},
	pauseMusci : function (id) {
		//暂停声音
		document.getElementById(id).pause();
	},
	animation : function () {
		/**
		 * 动画延迟、动画时间
		 * 元素动画延迟需要设置 data-animation-delay="5000" 属性，单位为毫秒
		 * 元素动画时间需要设置 data-animation-duration="2000" 属性，单位为毫秒
		 *
		 * 之所以用插入style的形式，是因为iphone 6s在设置了行内属性后，不起作用
		 */
		var style = document.createElement("style");
		$(".animated").each(function (index) {
			var delay = $(this).data("animation-delay");
			if(typeof delay !== 'undefined' && typeof delay === "number"){
				var _class = "ele-delay"+index;
				$(this).addClass(_class);
				style.innerHTML += "."+ _class + "{animation-delay:"+ parseFloat(delay/1000) +"s; -webkit-animation-delay:"+ parseFloat(delay/1000) +"s;}";
			}
			var duration = $(this).data("animation-duration");
			if(typeof duration !== 'undefined' && typeof duration === "number"){
				_class = "ele-duration"+index;
				$(this).addClass(_class);
				style.innerHTML += "."+ _class + "{animation-duration:"+ parseFloat(duration/1000) +"s; -webkit-animation-duration:"+ parseFloat(duration/1000) +"s;}";
			}
		});
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	includScript : function(url, opt){
		/*
		 * 加载js函数
		 * opt{ok:加载成功回调函数,err:加载失败回调函数}
		 **/
		opt = $.extend(opt || {},{
			dataType: "script",
			cache: true,
			url: url
		});

		return $.ajax(opt).done(function (data) {
			typeof opt.ok == "function" && opt.ok(data);
		}).fail(function () {
			typeof opt.err == "function" && opt.err();
		});
	},
	dhback : function(opt){
		//动画结束回调
		opt = $.extend({
			ele : null, //触发动画的元素
			callback : $.noop, //动画执行完后的回调函数
			propagation : true //是否禁止事件冒泡{true:禁止,false:不禁止}
		},opt||{});

		$(opt.ele).on('webkitAnimationEnd', function(){
			opt.callback.call($(opt.ele));
			if(opt.propagation){
				return false;
			}
		});
	},
	preventTouch : function (opt) {
		//预防滑动的时候误点击
		//ele 防止单击的元素
		//callback 单击后的操作
		opt = $.extend({
			ele : "",
			callback : $.noop
		},opt||{});
		var isMove = false;
		$(opt.ele).parent().on("touchmove", opt.ele, function () {
			isMove = true;
		}).on("touchend", opt.ele, function (event) {
			if(!isMove) {
				opt.callback && opt.callback.call(this);
			}else{
				isMove = false;
			}
			event.preventDefault();
			//return false; //如果返回false，会导致父元素的滑动效果取消
		});
	},
	ajax : function(opt){
		//封装的AJAX请求，防止重复提交
		if(!$(opt.ele).data("isajax")){
			$(opt.ele).data("isajax",true);
			opt = $.extend(true,{
				ele : "", //用来触发请求的元素，URL要以data-url的形式，写在该元素上
				type : "post",
				url : $(opt.ele).data("url"),
				dataType:"json",
				data : {},
				timeout : 60000, //超时时间
				callback : $.noop
			},opt||{});
			$.ajax({
				type:opt.type,
				url:opt.url,
				dataType:opt.dataType,
				data:opt.data,
				timeout:opt.timeout
			}).done(function(data) {
				$(opt.ele).data("isajax",false);
				opt.callback(data);
			}).fail(function(){
				$(opt.ele).data("isajax",false);
			});
		}
	},
	showPage : function(opt){
		//显示指定页面
		opt = $.extend({
			ele:'',
			dlay:800,
			callback:$.noop,
			dlay2:800
		},opt||{});
		setTimeout(function(){
			$(opt.ele).removeClass("hidden");
			if(typeof opt.callback == "function"){
				setTimeout(function(){
					opt.callback();
				},opt.dlay2);
			}
		},opt.dlay);
	},
	hidePage : function(opt){
		//隐藏指定页面
		opt = $.extend({
			ele:'',
			dlay:1000,
			callback:$.noop,
			dlay2:800
		},opt||{});
		setTimeout(function(){
			$(opt.ele).addClass("hidden");
			if(typeof opt.callback == "function"){
				setTimeout(function(){
					opt.callback();
				},opt.dlay2);
			}
		},opt.dlay);
	},
	initIscroll : function(opt){
		/**
		 * 初始化iscroll
		 *
		 * 每个iscroll必须设置.iscroll类以及ID属性 如：<div class="iscroll" id="myscroll" data-iscroll-height=400></div>
		 * 每个iscroll必须设置data-iscroll-height属性，用来表示高度 如：data-iscroll-height=400
		 * 初始化后可通过 SR_H5CORE.iscroll.id名 的形式调用该iscroll 如：SR_H5CORE.iscroll.myscroll
		 */
		var self = this;

		//加载iscroll.js
		self.includScript("http://static.sinreweb.com/common/js/plugs/iscroll.js",{
			ok: function () {
				$(".iscroll").each(function(index, element) {
					//初始化iscroll高度
					$(element).css({height:$(element).data("iscroll-height"),position:"relative",overflow:"hidden"});
					$(element).find(">*").wrapAll("<div class=\"iscroll-box\"></div>");
					var $pullUpEl = $(element).find(".pullUp"),
						disabledLoad = true;

					self.iscroll = {};
					if($pullUpEl.length > 0){
						opt  = $.extend(true,{
							useTransition: true,
							hScrollbar : false,
							//vScrollbar: false,
							//scrollbarClass : "myscrollbar",
							checkDOMChanges: true,
							onRefresh: function () {
								if ($pullUpEl.is('.loadmore') && !$pullUpEl.data("disabledload")) {
									$pullUpEl.removeClass();
									$pullUpEl.find('.pullUpLabel').html('向上滑动加载更多');
								}
							},
							onScrollMove: function () {
								//console.log('minY:'+this.minScrollY)
								//console.log('maxY:'+this.maxScrollY)
								//console.log('y:' + this.y)
								if(this.y < (this.maxScrollY - 80) && !$pullUpEl.is('.flip') && !$pullUpEl.data("disabledload") && disabledLoad) {
									$pullUpEl.addClass('flip');
									$pullUpEl.find('.pullUpLabel').html('释放加载更多');
								}
							},
							onScrollEnd: function () {
								if ($pullUpEl.is('.flip') && !$pullUpEl.data("disabledload") && !$pullUpEl.data("isajax") && disabledLoad) {
									$pullUpEl.data("isajax",1);
									$pullUpEl.addClass('loadmore');
									$pullUpEl.find('.pullUpLabel').html('加载中请稍后...');

									//下拉加载更多
									setTimeout(function () {
										self.loadMoreList({
											template : loadMoerData
										});
									},500);
								}
							}
						},opt || {});
					}else{
						opt  = $.extend(true,{
							useTransition: true,
							hScrollbar : false,
							//vScrollbar: false,
							//scrollbarClass : "myscrollbar",
							checkDOMChanges: true,
						},opt || {});
					}
					self.iscroll[element.id] = new iScroll(element, opt);
				});
			}
		});
	},
	loadMoreList : function(opt){
		//下拉加载更多 依赖iscroll.js 参考蒙牛纯甄项目
		var self = this;
		var $pullUpEl = $("#pullUp");
		var datas = $pullUpEl.data("ajaxdata");

		opt = $.extend({
			url:$pullUpEl.data("url"),
			data : datas+"&pageNumber="+$pullUpEl.data("pagenumber"),
			ele:'.iscroll-con-box',
			template : $.noop
		},opt||{});
		//下拉加载更多 AJAX 通信
		if(!$pullUpEl.data("disabledload")){
			$.ajax({
				url:opt.url,
				type:"post",
				data:opt.data,
				dataType:"json",
				success:function(data){
					$pullUpEl.data("isajax",0); //防止重复加载
					if(($.isArray(data.data) && (data.data.length != 0)) || !$.isEmptyObject(data.data)){
						$pullUpEl.data("pagenumber",data.page);
						opt.template.call(opt,data);
						self.iscroll.refresh();
					}else{
						//如果没有更多数据 隐藏加载gif 并禁止拉动刷新
						$pullUpEl.removeClass('loadmore').data("disabledload","1");
						$(".pullUpLabel",$pullUpEl).text("没有更多内容了");
					}
				}
			});
		}
	},
	uploadFile: function (opt) {
		/**
		 * 封装微信上传图片
		 * 此段代码参考蒙牛纯甄BBS项目
		 * 上传按钮HTML结构 <label id="upload-file"><input type="file" name="upload-file[]"></label>
		 **/
		var self = this,
			opt = $.extend({
				H5Button: $("#upload-file"), //上传图片按钮元素
				imgLength : 1, //图片的数量 默认1张
				imgSize : 3, //图片大小 默认3M
				autoUploadImage : true, //安卓机型在选择了照片后，是否自动获取serverID,默认为 true 获取
				chooseImageSuccess : function(src){}, //选择照片后的回调函数 src可直接赋值给img显示图片
				uploadImageSuccess : function(serverId){} //上传照片回调函数，安卓需要用到该函数
			},opt||{});

		/**
		 * 微信上传照片 安卓版使用
		 * 只能一张一张的上传
		 * 所以采用递归形式处理
		 **/
		function uploadImage(){
			(function wx_uploadImg(localIds){
				var localId = localIds.pop();
				wx.uploadImage({
					localId:localId,
					isShowProgressTips:1,
					success:function(res){
						weixin.images.serverId.push(res.serverId); //返回的是服务器端图片的id

						//执行上传成功回调函数 每上传成功一次，执行一次
						opt.uploadImageSuccess(res.serverId);

						//其他对serverId做处理的代码
						if(localIds.length > 0){
							wx_uploadImg(localIds);
						}
					}
				})
			})(weixin.images.localId);
		}

		//如果是安卓手机的话
		if(self.isAndroid){
			//安卓使用微信API
			opt.H5Button.find("input[type='file']").remove();
			opt.H5Button.on('touchend',function(){
				wx.chooseImage({
					count: opt.imgLength,
					success: function (res) {
						/**
						 * 保存本地图片的id(由微信客户端提供) 返回的是一个数组
						 * 数组中的内容可以直接赋值到img的src属性
						 **/
						weixin.images.localId = res.localIds;

						//执行选择照片后的回调函数
						if(opt.imgLength > 1){
							//如果上传多图
							for(var i=0; i<res.localIds.length; i++){
								opt.chooseImageSuccess(res.localIds[i]);
							}
						}else{
							opt.chooseImageSuccess(res.localIds[0]);
						}

						//选择成功后是否自动开始上传，获取serverID
						autoUploadImage && uploadImage();
					}
				});
			});
		}else{
			//IOS使用HTML原生上传 input file 多图
			//如果上传多图
			opt.imgLength > 1 && opt.H5Button.attr("multiple",true);

			opt.H5Button.find("input[type='file']").on('change',function (){
				var oFile = this.files,
					rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i,
					oReader = [];
				for(var i=0; i<oFile.length; i++){
					if (!rFilter.test(oFile[i].type)) {
						$("#dialog2 .weui_dialog_bd").html("选择的图片格式不正确 请重新选择");
						$("#dialog2").show();
						return;
					}
					if(oFile[i].size > opt.imgSize * 1024 * 1024){
						$("#dialog2 .weui_dialog_bd").html("单张图片的大小不能大于3M");
						$("#dialog2").show();
						return;
					}
				}

				for(var i=0; i<oFile.length; i++){
					oReader[i] = new FileReader();
					oReader[i].onload = function(e){
						//执行选择照片后的回调函数
						opt.chooseImageSuccess(e.target.result);
					}
					oReader[i].readAsDataURL(oFile[i]);
				}
			});
		}
	},
	flipImage : function (src,callback) {
		/**
		 * 翻转图片
		 * 修复手机拍的照片方向不对的问题
		 **/
		this.includScript("http://static.sinreweb.com/common/js/plugs/exif.js",{
			ok : function () {
				var orientation;
				//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
				var imgEle = new Image();
				imgEle.onload = function () {
					EXIF.getData(this,function(){
						orientation=EXIF.getTag(this,'Orientation');
					});
					getImgData(src,orientation,function(data){
						//返回图片的base64
						callback(data);
					});
				}
				imgEle.src = src;
			}
		});

		// @param {string} img 图片的base64
		// @param {int} dir exif获取的方向信息
		// @param {function} next 回调方法，返回校正方向后的base64
		function getImgData(img,dir,next){
			var image=new Image();
			image.onload=function(){
				var degree=0,drawWidth,drawHeight,width,height;
				drawWidth=this.naturalWidth;
				drawHeight=this.naturalHeight;
				//以下改变一下图片大小
				var maxSide = Math.max(drawWidth, drawHeight);
				if (maxSide > 1024) {
					var minSide = Math.min(drawWidth, drawHeight);
					minSide = minSide / maxSide * 1024;
					maxSide = 1024;
					if (drawWidth > drawHeight) {
						drawWidth = maxSide;
						drawHeight = minSide;
					} else {
						drawWidth = minSide;
						drawHeight = maxSide;
					}
				}

				var canvas=document.createElement('canvas');
				canvas.width=width=drawWidth;
				canvas.height=height=drawHeight;
				var context=canvas.getContext('2d');
				//判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
				switch(dir){
					//iphone横屏拍摄，此时home键在左侧
					case 3:
						degree=180;
						drawWidth=-width;
						drawHeight=-height;
						break;
					//iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
					case 6:
						canvas.width=height;
						canvas.height=width;
						degree=90;
						drawWidth=width;
						drawHeight=-height;
						break;
					//iphone竖屏拍摄，此时home键在上方
					case 8:
						canvas.width=height;
						canvas.height=width;
						degree=270;
						drawWidth=-width;
						drawHeight=height;
						break;
				}
				//使用canvas旋转校正
				context.rotate(degree*Math.PI/180);
				context.drawImage(this,0,0,drawWidth,drawHeight);
				//返回校正图片
				next(canvas.toDataURL("image/png"));
			}
			image.src=img;
		}
	},
	preloadImage : function (Progress, Complete, imglist, delay) {
		/**
		 * 图片预加载
		 * Progress:function handler(progress){//使用当前进度},
		 * Complete:function handler(){//加载完成后执行},
		 * imglist:[uri1,uri2,uri3,....],
	 	 * delay:nubmer 每次执行Progress的时间间隔，默认20毫秒
	 	 * */
		var complete = 0,
			count = imglist.length,
			currentProgress = 0,
			delay = typeof delay == 'undefined' ? 20 : delay;

		function _animate() {
			var completeProgres = complete / count;
			currentProgress = (currentProgress + 0.01) < completeProgres ? (currentProgress + 0.01) : completeProgres;
			if (Math.floor(currentProgress * 100) < 100) {
				Progress(currentProgress);
				setTimeout(_animate, delay);
			} else {
				setTimeout(function () {
					Progress(1);
					setTimeout(function () {
						Complete();
					}, 200);
				}, delay);
			}
		}

		for (var i = 0; i < count; i++) {
			var img = new Image();
			img.onload = function () {
				complete++;
				if (!Progress && complete == count) {
					Complete();
				}
			};
			img.src = imglist[i];
		}
		if (Progress) {
			_animate();
		}
	},
	events : function () {
		/**
		 * 事件绑定
		 * SR_H5CORE.events({
		 *		event : "touchend",
		 *		list :[
		 * 			{ele: ".a", callback: function () {}},
		 * 			{ele:".b", callback : function () {}}
		 *		]
		 *  });
		 */
		var events = arguments;
		for(var i=0; i<events.length; i++){
			for(var x=0; x<events[i].list.length; x++){
				(function(){
					var _i = i,
						_x = x;
					$(events[_i].list[_x].ele).on(events[_i].event, function(){
						events[_i].list[_x].callback.call(this);
						return false;
					});
				})();
			}
		}
	},
	init : function(config){
		var self = this;

		//初始化配置项
		self.config = $.extend(self.config,config||{});

		//预处理音乐
		self.preloadMusic();

		/**
		 * 创建预加载弹层
		 */
		if(self.config.hidePage && self.config.hidePageClass){
			var style = document.createElement("style");
			style.id = "hide-page-style";
			var _class = self.config.hidePageClass.split(",");
			for(var i in _class){style.innerHTML += _class[i] +"{visibility:hidden}";}
			style.innerHTML += "#main:before{content:'\u6B63\u5728\u52A0\u8F7D\u8BF7\u7A0D\u540E';position:fixed;left:0;top:54%;width:100%;text-align:center;font-size:24px;}";
			style.innerHTML += "#main:after{content:'';position:fixed;left:0;top:0;width:100%;height:100%;background:url(data:image/gif;base64,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) no-repeat 50%; background-size:50px;}";
			document.getElementsByTagName("head")[0].appendChild(style);
		}

		$(function(){
			//初始化页面尺寸 并禁止手机滑动默认行为 如果给stopScroll传递true，则禁止手机滑动默认行为，默认为true
			self.initPageHeight();

			//初始化动画延迟与动画时间
			self.animation();

			/**
			 * 禁止手机滑动默认行为
			 */
			if(self.config.stopScroll){
				$('body').on('touchmove', function (event) {
					event.preventDefault();
				});
			}


			/*self.ajax({
				ele:".page1-c-t-1"
			})*/

		


			//进度条 先确保加载完背景后 再开始加载其他
			/*self.preloadImage(function(currentProgress){},function(){
				$('.load .page-con-all-top').removeClass('none');
			 	self.preloadImage(function(currentProgress){
					$(".load span").text(parseInt(currentProgress*100)+"%");
					$(".jd").css({width:currentProgress*75+"%"});
				},
				function(){
					$(".load").addClass("zoomOut");
					self.showPage({
						ele:".page1",
						dlay:500,
						callback:function(){

						}
					});
				},
				["images/1-a-1.png",
					"images/1-a-2.png",
					"images/1-a-3.png",
					"images/1-a-4.png",
					"images/1bg.jpg",
					"images/1-c-b-1.jpg",
					"images/1-c-b-2.png",
					"images/1-c-t-1.png",
					"images/1-c-t-2.png",
				],
				20));
			},[
				"images/jdbg.png",
				"images/jd.png"
			],0))*/
		});
	}
};