var _iframeWin;

//工具方法
Date.prototype.format = function (format) { //author: meizz
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
}

function ajaxData(method,url,formData,succFunc) {
    $.ajax({
        url:url,
        type:method,
        contentType: "application/json;charset=utf-8",
        data:formData,
        success:function (data) {
            if(data.resultCode==0){
                succFunc(data)
            }else{
                layui.layer.msg(data.message);
            }
        },error:function (data) {
            layui.layer.msg('load data error:'+JSON.stringify(data));
        }
    });
}


function openWin(url) {
    //添加数据
    var layer=layui.layer;
    layer.open({
        type: 2,
        title: ' ',
        shadeClose: false,
        shade: 0.8,
        area: ['800px', '86%'],
        content: url //iframe的url
        ,zIndex: layer.zIndex //重点1
        ,success: function(layero){
            layer.setTop(layero); //重点2
        },btnAlign:'c'
        ,btn:['确定','重置']
        ,yes: function(index, layero){
            //var body = layer.getChildFrame('body', index);
            //body.contents().find("#url").val(111);
            _iframeWin.postData();
        },btn2: function(index, layero){
            _iframeWin.resetData();
            return false;
        },success:function(layero, index){
            var iframeWin = window[layero.find('iframe')[0]['name']];
            _iframeWin=iframeWin;
            //iframeWin.childSelectIcon('123456');
        }
    });
}