

function AdminJ() {
    this.formData= {};
    this.config={
        validate:{
            username: function(value, item){
                if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                    return '不能有特殊字符';
                }
                if(/(^\_)|(\__)|(\_+$)/.test(value)){
                    return '首尾不能出现下划线\'_\'';
                }
                if(/^\d+\d+\d$/.test(value)){
                    return '用户名不能全为数字';
                }
            },
            email: function(value, item){
                if(value.length>0) {
                    if(!new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(value)){
                        return 'Email格式不正确';
                    }
                }
            },
            integer: function(value, item){
                if(new RegExp("^[0-9]*$").test(value)){
                    return '必须全部是数字';
                }
            },
            a_z: function(value, item){
                if(!new RegExp("^[A-Za-z]*$").test(value)){
                    return '必须全部是字母';
                }
            },
            a_z0_9: function(value, item){
                if(!new RegExp("^[A-Za-z0-9]+$").test(value)){
                    return '必须是字母和数字';
                }
            }
            ,
            zipcode: function(value, item){
                if(!new RegExp("^\\d{6}$").test(value)){
                    return '请输入正确的邮编';
                }
            },
            chinese: function(value, item){
                if(!new RegExp("^[\u4e00-\u9fa5]{0,}$").test(value)){
                    return '必须输入汉字';
                }
            },
            minLength: function(value, item){
                if(value.length==0)return
                var divId=$(item).attr('div_id')
                var config=getPropertiesMap()[divId]
                if(config==undefined)return;
                var minLen=parseInt(config['minLength'])
                if(!isNaN(minLen)){
                    if(value.length<minLen){
                        return '长度不够，不能少于'+minLen+'个字符';
                    }
                }
            },
            maxLength: function(value, item){
                if(value.length==0)return
                var divId=$(item).attr('div_id')
                var config=getPropertiesMap()[divId]
                if(config==undefined)return;
                var maxLen=parseInt(config['maxLength'])
                if(!isNaN(maxLen)){
                    if(value.length>maxLen){
                        return '长度不能超过'+maxLen+'个字符';
                    }
                }
            },min: function(value, item){
                if(value.length==0)return
                var divId=$(item).attr('div_id')
                var config=getPropertiesMap()[divId]
                if(config==undefined)return;
                var minValue=parseInt(config['minValue'])
                var val=parseInt(value)
                if(isNaN(val))return '必须输入数字';
                if(!isNaN(minValue) ){
                    if(val<minValue){
                        return '值不能小于'+minValue+'';
                    }
                }
            },max: function(value, item){
                if(value.length==0)return
                var divId=$(item).attr('div_id')
                var config=getPropertiesMap()[divId]
                if(config==undefined)return;
                var maxValue=parseInt(config['maxValue'])
                var val=parseInt(value)
                if(isNaN(val))return '必须输入数字';
                if(!isNaN(maxValue)){
                    if(val>maxValue){
                        return '值不能大于'+maxValue+'';
                    }
                }
            }
        }
    }
}


AdminJ.prototype.addLayuiFormEvent= function () {
    var that=this;
    layui.form.on('switch', function(data){
        var divId=$(data.elem).parent().parent().attr('id');
        var name=that.propertiesMap[divId]['name'];
        var selectedValue=that.propertiesMap[divId]['selectedValue'];
        var defValue=that.propertiesMap[divId]['defValue'];
        that.formData[name]=data.elem.checked?selectedValue:defValue;

    });

    layui.form.on('checkbox', function(data){
        var divId=$(data.elem).parent().parent().attr('id');
        var name=that.propertiesMap[divId]['name'];
        var map= that.formData[name];
        if(map==undefined)map= {}
        map[data.value]=data.elem.checked
        that.formData[name]=map
    });

    layui.form.on('radio', function(data){
        var divId=$(data.elem).parent().parent().attr('id');
        var name=that.propertiesMap[divId]['name'];
        that.formData[name]=data.value

    });

    layui.form.on('select', function(data){
        var divId=$(data.elem).parent().parent().attr('id');
        console.log(divId);
        var name=that.propertiesMap[divId]['name'];
        that.formData[name]=data.value
    });

};

AdminJ.prototype.validateRule=function () {
    return this.config.validate;
}


AdminJ.prototype.init= function (cofigMap) {
    this.propertiesMap=cofigMap
    var that=this;
    var initData=function (item) {
        var cptId = item.attr('cpt_id');
        var funcName = 'cpt' + cptId.substring(0, 1).toUpperCase() + cptId.substring(1)
        var func = eval('that.' + funcName)
        if (typeof (func) == 'function') {
            func(that,item)
        }
    };
    $('form').children().each(function (i, e) {
        var cptId = $(this).attr('cpt_id');
        if (cptId != undefined && cptId != '') {
            initData($(this));
        }
    });

    this.addLayuiFormEvent();

    layui.form.config.verify.email=undefined;//用自定义email验证
    var validateRule = that.validateRule();
    layui.form.verify(validateRule);//设定自定义规则

};

//组件部分 start-------------------
AdminJ.prototype.cptSwitch= function (that,item) {
    var divId=item.attr('id');
    var name=that.propertiesMap[divId]['name'];
    var defValue=that.propertiesMap[divId]['defValue'];
    that.formData[name]=defValue;
}

AdminJ.prototype.cptCheckbox= function (that,item) {
    var divId=item.attr('id');
    var name=that.propertiesMap[divId]['name'];
    var arr=that.propertiesMap[divId]['options'];
    var map={}
    for(var i=0;i<arr.length;i++){
        var row=arr[i];
        if(row.isSelect=='0')map[row.value]=row.text;
    }
    that.formData[name]=map;
}

AdminJ.prototype.cptRadio= function (that,item) {
    var divId=item.attr('id');
    var name=that.propertiesMap[divId]['name'];
    var arr=that.propertiesMap[divId]['options'];
    for(var i=0;i<arr.length;i++){
        var row=arr[i];
        if(row.isSelect=='0')that.formData[name]=row[0];
    }
}

AdminJ.prototype.cptSelect= function (that,item) {
    var divId=item.attr('id');
    var name=that.propertiesMap[divId]['name'];
    var arr=that.propertiesMap[divId]['options'];
    if(arr==undefined)return;
    for(var i=0;i<arr.length;i++){
        var row=arr[i];
        if(row.isSelect=='0')that.formData[name]=row[0];
    }
}

AdminJ.prototype.cptDate= function (that,item) {
    var divId=item.attr('id');
    var dateInputId = 'date_' + divId;
    var name=that.propertiesMap[divId]['name'];
    item.find("input").attr('id', dateInputId);
    layui.laydate.render({
        elem: '#' + dateInputId
        ,done: function(value, date, endDate){
            that.formData[name]=value
        }
    });
}

AdminJ.prototype.cptSelect2= function (that,item) {
    var divId=item.attr('id');
    var name=that.propertiesMap[divId]['name'];

    that.formData[name]={}
    item.find("select").attr('id', 'select_' + divId);
    item.find("select").select2().on('select2:select', function (e) {
        //console.log('s:' + JSON.stringify(e.params.data.id+'='+e.params.data.text));
        var sdata=that.formData[name];
        sdata[e.params.data.id]=true
    }).on('select2:unselect', function (e) {
        //console.log('us:' + JSON.stringify(e.params.data));
        var sdata=that.formData[name];
        sdata[e.params.data.id]=false
    });
}

AdminJ.prototype.cptDateRange= function (that,item) {
    var divId=item.attr('id');
    //var name=that.propertiesMap[divId]['name'];
    var dateDivId = divId + 'd_rang';
    item.find('input').attr('id', dateDivId);
    layui.laydate.render({
        elem: '#' + dateDivId
        , range: true
        ,done: function(value, date, endDate){
            var startValue='',endValue='';
            if(value.length>0){
                var arr=value.split(' - ');
                startValue=arr[0];
                endValue=arr[1];
            }
            that.formData['startDateName']=startValue;
            that.formData['endDateName']=endValue;
        }
    });
}

AdminJ.prototype.cptUploadImage= function (that,item) {
    var divId=item.attr('id');

    this.uploadImageFile(divId,divId, item,false)
}

AdminJ.prototype.cptUploadImages= function (that,item) {
    var divId=item.attr('id');
    var name=that.propertiesMap[divId]['name'];

    var item0 = item.find('.upload_ul').children().eq(0);
    item0.find('#close_div').children().eq(0).click(function () {
        $(this).parent().parent().parent().remove()
    })
    this.uploadImageFile(divId,'up_id_' + Date.now(), item0,true)

    item.find('#add_div').click(function () {
        var node = $($('span #images .upload_ul').children(':first').get(0).outerHTML)
        $(this).parent().find('#add_div').before(node)
        this.uploadImageFile(divId,'up_id_' + Date.now(), node,true)
        var len = $(this).parent().parent().find('.upload_ul').children().length;
        node.find('#close_div').children().eq(0).click(function () {
            var delId = $(this).attr('del_id');
            $(this).parent().parent().parent().remove()
        })
    });

}

AdminJ.prototype.cptUploadFile= function (that,item) {
    var divId=item.attr('id');
    var cptId=item.attr('cpt_id');
    this.uploadSingleFile(divId,cptId,item)
}

AdminJ.prototype.cptUploadFiles= function (that,item) {
    var divId=item.attr('id');
    var cptId=item.attr('cpt_id');
    this.uploadFiles(divId,cptId,item)
}

AdminJ.prototype.cptColor= function (that,item) {
    var divId=item.attr('id');
    var inputId = divId + '_c', colorUiId = divId + '_u';
    item.find('input').attr('id', inputId);
    item.find('[flag="color_ui_div"]').attr('id', colorUiId);
    layui.colorpicker.render({
        elem: '#' + colorUiId
        , color: '#1c97f5'
        , done: function (color) {
            $('#' + inputId).val(color);
        }
    });
}


//组件部分 end-------------------

AdminJ.prototype.uploadSingleFile=function(divId, cptId, item) {
    var that=this;
    var uploadUrl=that.propertiesMap[divId]['uploadUrl']
    var name=that.propertiesMap[divId]['name']
    if(uploadUrl==undefined || uploadUrl=='')uploadUrl='https://httpbin.org/post'
    var uploadTypeArr=that.propertiesMap[divId]['uploadType']
    var uploadType=replaceFileSuffix(uploadTypeArr)
    console.log(uploadType)

    var fileId = divId + 'd_file';
    item.find('button').attr('id', fileId);
    layui.upload.render({
        elem: '#' + fileId
        , url: uploadUrl
        ,exts:uploadType
        , accept: 'file'
        ,field:name
        ,data:{'filename':function () {
                var name = that.propertiesMap[divId]['name']
                var fname = that.formData[name]
                if(fname==undefined)fname='';
                return fname;
            }}
        , done: function (res) {
            layui.layer.msg('上传成功');
            $('#uploaded_div').html('')
            console.log(res);
            updateUploadFilename(divId,res,false)
        }, progress: function (n, index, e) {
            $('#uploaded_div').html(n + '%')
            if (n == 100) {
                layer.msg('上传完毕', {icon: 1});
            }
        }
    });
}

AdminJ.prototype.uploadFiles=function(divId, cptId, item) {
    var that=this;
    var uploadUrl=that.propertiesMap[divId]['uploadUrl']
    var name=that.propertiesMap[divId]['name']
    if(uploadUrl==undefined || uploadUrl=='')uploadUrl='https://httpbin.org/post'
    var uploadTypeArr=that.propertiesMap[divId]['uploadType']
    var uploadType=replaceFileSuffix(uploadTypeArr)
    console.log(uploadType)

    var fileId = divId + 'u_file', uploadId = divId + 'up_file';
    item.find('[select_file="true"]').attr('id', fileId);
    item.find('[upload_file="true"]').attr('id', uploadId);
    var uploadListIns = layui.upload.render({
        elem: '#' + fileId
        , elemList: $('#fileList') //列表元素对象
        , url: uploadUrl
        ,exts:uploadType
        , accept: 'file'
        , multiple: true
        , number: 3
        , auto: false
        ,field:name
        , bindAction: '#' + uploadId
        , choose: function (obj) {
            var that = this;
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {
                var tr = $(['<tr id="upload-' + index + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                    , '<td><div class="layui-progress" lay-filter="progress-upload-' + index + '"><div class="layui-progress-bar" lay-percent=""></div></div></td>'
                    , '<td>'
                    , '<button class="layui-btn layui-btn-xs upload-reload layui-hide">重传</button>'
                    , '<button class="layui-btn layui-btn-xs layui-btn-danger upload-delete">删除</button>'
                    , '</td>'
                    , '</tr>'].join(''));

                //单个重传
                tr.find('.upload-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.upload-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                that.elemList.append(tr);
                layui.element.render('progress'); //渲染新加的进度条组件
            });
        }
        , done: function (res, index, upload) { //成功的回调
            var that = this;
            //if(res.code == 0){ //上传成功
            var tr = that.elemList.find('tr#upload-' + index)
                , tds = tr.children();
            tds.eq(3).html(''); //清空操作
            delete this.files[index]; //删除文件队列已经上传成功的文件
            if(res.code == 0){
                updateUploadFilename(divId,res,true)
            }
            return;
            //}
            this.error(index, upload);
        }
        , allDone: function (obj) { //多文件上传完毕后的状态回调
            console.log(obj)
        }
        , error: function (index, upload) { //错误回调
            var that = this;
            var tr = that.elemList.find('tr#upload-' + index)
                , tds = tr.children();
            tds.eq(3).find('.upload-reload').removeClass('layui-hide'); //显示重传
        }
        , progress: function (n, elem, e, index) {
            layui.element.progress('progress-upload-' + index, n + '%'); //执行进度条。n 即为返回的进度百分比
        }
    })
}


AdminJ.prototype.uploadImageFile=function(divId, uploadId, item, isMulti){
    var that=this;
    var uploadUrl=that.propertiesMap[divId]['uploadUrl']
    var name=that.propertiesMap[divId]['name']
    if(uploadUrl==undefined || uploadUrl=='')uploadUrl='https://httpbin.org/post'
    var uploadTypeArr=that.propertiesMap[divId]['uploadType']
    var uploadType=replaceFileSuffix(uploadTypeArr)
    console.log(uploadType)
    var uploadButId=uploadId+'d_upload';
    var filterId='layui-progress-'+uploadId;
    item.find('div[flag="upload_div"]').attr('id',uploadButId)
    item.find('.layui-progress').attr('lay-filter',filterId);
    var uploadInst = layui.upload.render({
        elem: '#'+uploadButId
        ,url: uploadUrl
        ,exts:uploadType
        ,field:name
        ,data:{'filename':function () {
                var fname ='';
                try {
                    var name = that.propertiesMap[divId]['name']
                    fname = that.formData[name][uploadId]
                }catch(e){}
                if(fname==undefined)fname='';
                return fname;
            }}
        ,acceptMime: 'image/*'
        ,choose:function (obj) {
            console.log(JSON.stringify(obj))
        }
        ,before: function(obj){
            console.log(JSON.stringify(obj))
            //预读本地文件示例，不支持ie8
            var _selectLine=$('#'+uploadButId).parent().parent();
            _selectLine.find('.bi-cloud-upload').hide();
            _selectLine.find('#image_src').css('width','').css('height','').hide();
            _selectLine.find('.upload_image_style').each(function () {
                $(this).show();
            });
            _selectLine.find('#upload_bar_div').show();
            _selectLine.find('#upload_mask_div').show();
            obj.preview(function(index, file, result){
                _selectLine.find('#image_src').attr('src', result); //图片链接（base64）
            });

            layui.element.progress(filterId, '0%'); //进度条复位
            //layer.msg('上传中', {icon: 16, time: 0});
        }
        ,done: function(res){
            var _selectLine=$('#'+uploadButId).parent().parent();
            _selectLine.find('#upload_bar_div').hide();
            _selectLine.find('#upload_mask_div').hide();
            //如果上传失败
            if(res.code > 0){
                _selectLine.find('.bi-cloud-upload').show();
                return layer.msg('上传失败');
            }
            //上传成功的一些操作
            //……
            var img=_selectLine.find('#image_src');
            var imgWidth=img.width(),imgHeight=img.height();
            var _imgHeight=80/imgHeight*imgHeight,_imgWidth=80/imgHeight*imgWidth;
            img.css('width',_imgWidth+'px').css('height',_imgHeight+'px')
            _selectLine.find('[update_width="true"]').each(function () {
                $(this).css('width',_imgWidth+'px')
            });

            _selectLine.find('#upload_ul').children().css('border','0px')
            _selectLine.find('#image_src').show();
            _selectLine.find('.bi-cloud-upload').hide();

            updateUploadFilename(divId,res,isMulti)

            // _selectLine.find('#msgText').html(''); //置空上传失败的状态
        }
        ,error: function(){
            var _selectLine=$('#'+uploadButId).parent().parent();
            //演示失败状态，并实现重传
            _selectLine.find('#upload_bar_div').hide();
            _selectLine.find('.upload_image_style').each(function () {
                $(this).hide();
            });

        }
        //进度条
        ,progress: function(n, index, e){
            layui.element.progress(filterId, n + '%'); //可配合 layui 进度条元素使用
            if(n == 100){
                layer.msg('上传完毕', {icon: 1});
            }
        }
    });
}

AdminJ.prototype.updateUploadFilename=function(divId, res, isMulti){
    var that=this;
    if(res.filename!=undefined){
        var name=that.propertiesMap[divId]['name']
        if(isMulti){
            var files=that.formData[name]
            if(files==undefined)files={}
            files[uploadId]=res.filename
            that.formData[name]=files
        }else{
            that.formData[name]=res.filename
        }
    }
}

AdminJ.prototype.convertFormValue=function(data) {
    var that=this;
    for(divId in that.propertiesMap){
        var cptId=that.propertiesMap[divId]['cpt_id']
        var name=that.propertiesMap[divId]['name'];
        if(cptId=='select_multi' || cptId=='checkbox'){
            var mapVal=that.formData[name]
            if(mapVal!=undefined) {
                var index=0
                var arr=[]
                for (k in mapVal) {
                    var val=mapVal[val]
                    if(val==true) {
                        arr[index] = val
                        index++
                    }
                }
                data[name]=arr

            }
        }else{
            data[name]=that.formData[name] ;
        }
    }
}

AdminJ.prototype.replaceFileSuffix=function(arr){
    if(arr==undefined)return '';
    var str=''
    for(i=0;i<arr.length;i++){
        str+=arr[i]
        if(i<arr.length-1){
            str+='|'
        }
    }
    return str.replaceAll('.','')
}

var adminj=new AdminJ();





