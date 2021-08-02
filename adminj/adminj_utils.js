

//工具方法
Date.prototype.format = function (format) {
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

function stringToDate(str){
    str = str.replace(/-/g,'/'); 
    return new Date(str);
}



Array.prototype.deleteValue=function(val){
    var arr=this;
    for(var i=0;i<arr.length;i++){
        if(val==arr[i]){
            arr.splice(i,1);
            break;
        }
    }
}

stringIsEmpty=function (str) {
    return str==undefined || str.length==0;
}

function ajaxData(method,url,formData,succFunc,ajaxConfig) {
    $.ajax({
        url:url,
        type:method,
        contentType: "application/json;charset=utf-8",
        data:formData,
        success:function (data) {
            var resultCodeName='resultCode',messageName='message';
            if(ajaxConfig!=undefined){
                resultCodeName=ajaxConfig.resultCodeName;
                messageName=ajaxConfig.messageName;
            }
            if(data[resultCodeName]==0){
                succFunc(data)
            }else{
                var msg=data[messageName];
                if(msg==undefined)msg='数据请求出错';
                layui.layer.msg(msg);
            }
        },error:function (data) {
            layui.layer.msg('load data error:'+JSON.stringify(data));
        }
    });
}