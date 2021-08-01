/**
 * 开源不易，如果可能请留下版权信息
 * @auther adminj
 * @date 2021-7
 * @version 1.0
 * 
 **/


function AdminJFormData() {
    this.propertiesMap={};
    this.formData= {};
    this.resetDataCpt=[];//需要触发时就收集数据的组件 radio/checkbox...
    this.editorMap={};//h5edtor object
    this.formIdName='layui-form-id';
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
                if(value.length==0)return;
                var name=$(item).attr('name'),formId=$(item).attr(layui.adminJFormData.formIdName);
                var properties=layui.adminJFormData.getPropertiesByName(formId,name);
                if(properties==undefined)return;
                var minLen=parseInt(properties['minLength'])
                if(!isNaN(minLen)){
                    if(value.length<minLen){
                        return '长度不够，不能少于'+minLen+'个字符';
                    }
                }
            },
            maxLength: function(value, item){
                if(value.length==0)return
                var name=$(item).attr('name'),formId=$(item).attr(layui.adminJFormData.formIdName);
                var properties=layui.adminJFormData.getPropertiesByName(formId,name);
                if(properties==undefined)return;
                var maxLen=parseInt(properties['maxLength'])
                if(!isNaN(maxLen)){
                    if(value.length>maxLen){
                        return '长度不能超过'+maxLen+'个字符';
                    }
                }
            },min: function(value, item){
                if(value.length==0)return
                var name=$(item).attr('name'),formId=$(item).attr(layui.adminJFormData.formIdName);
                var properties=layui.adminJFormData.getPropertiesByName(formId,name);
                if(properties==undefined)return;
                var minValue=parseInt(properties['minValue'])
                var val=parseInt(value)
                if(isNaN(val))return '必须输入数字';
                if(!isNaN(minValue) ){
                    if(val<minValue){
                        return '值不能小于'+minValue+'';
                    }
                }
            },max: function(value, item){
                if(value.length==0)return
                var name=$(item).attr('name'),formId=$(item).attr(layui.adminJFormData.formIdName);
                var properties=layui.adminJFormData.getPropertiesByName(formId,name);
                if(properties==undefined)return;
                var maxValue=parseInt(properties['maxValue'])
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

AdminJFormData.prototype.getPropertiesMap= function () {
    return this.propertiesMap;
}

AdminJFormData.prototype.getPropertiesByName= function (formId,name) {
    var formMap=this.propertiesMap[formId];
    for(divId in formMap){
        var properties=formMap[divId];
        if(properties['name']==name)return properties;
    }
    return undefined;
}

AdminJFormData.prototype.addLayuiFormEvent= function () {
    var that=this;
    
    layui.form.on('switch', function(data){
        var top=$(data.elem).parent().parent();
        var divId=top.attr('id'),formId=top.attr(that.formIdName);
        var properties=that.propertiesMap[formId][divId];

        var name=properties['name'];
        var selectedValue=properties['selectedValue'];
        var defValue=properties['defValue'];
        that.formData[formId][name]=data.elem.checked?selectedValue:defValue;

    });
    
    layui.form.on('checkbox', function(data){
        var top=$(data.elem).parent().parent();
        var divId=top.attr('id'),formId=top.attr(that.formIdName);
        var properties=that.propertiesMap[formId][divId];

        var name=properties['name'];
        var arr= that.formData[formId][name];
        if(arr==undefined)arr= [];

        if(data.elem.checked){
            arr[arr.length]=data.value;
        }else{
            arr.deleteValue(data.value);
        }
        that.formData[formId][name]=arr;
        
    });

    layui.form.on('radio', function(data){
        var top=$(data.elem).parent().parent();
        var divId=top.attr('id'),formId=top.attr(that.formIdName);
        var properties=that.propertiesMap[formId][divId];

        var name=properties['name'];
        that.formData[formId][name]=data.value;

    });

    layui.form.on('select', function(data){
        var top=$(data.elem).parent().parent();
        var divId=top.attr('id'),formId=top.attr(that.formIdName);
        var properties=that.propertiesMap[formId][divId];

        var name=properties['name'];
        that.formData[formId][name]=data.value
    });

};

AdminJFormData.prototype.validateRule=function () {
    return this.config.validate;
}


AdminJFormData.prototype.init= function (_json,layuiFormId) {

    this.propertiesMap[layuiFormId]=JSON.parse(_json);
    var that=this;
    this.formData[layuiFormId]={};
    var initData=function (item) {
        item.attr(that.formIdName,layuiFormId);
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

    $('[lay-filter="'+layuiFormId+'"]').find(':input').each(function(i,e){
        $(this).attr(that.formIdName,layuiFormId)
    });

    this.addLayuiFormEvent();

    layui.form.config.verify.email=undefined;//用自定义email验证
    var validateRule = that.validateRule();
    layui.form.verify(validateRule);//设定自定义规则

};

//组件部分 start-------------------

AdminJFormData.prototype.cptSwitch= function (that,item) {
    var divId=item.attr('id'),formId=item.attr(that.formIdName);
    var name=that.propertiesMap[formId][divId]['name'];
    var defValue=that.propertiesMap[formId][divId]['defValue'];
    var selectedValue=that.propertiesMap[formId][divId]['selectedValue'];
    var isSelect=that.propertiesMap[formId][divId]['isSelect'];
    that.formData[formId][name]=isSelect=='0'?selectedValue:defValue;
    that.resetDataCpt[that.resetDataCpt.length]='switch';
}

AdminJFormData.prototype.cptCheckbox= function (that,item) {
    that.initOptionsValue(that,item,false);
    that.resetDataCpt[that.resetDataCpt.length]='checkbox';
}

AdminJFormData.prototype.cptRadio= function (that,item) {
    that.initOptionsValue(that,item,true);
    that.resetDataCpt[that.resetDataCpt.length]='radio';
}

AdminJFormData.prototype.cptSelect= function (that,item) {
    that.initOptionsValue(that,item,true);
    that.resetDataCpt[that.resetDataCpt.length]='select';
}

AdminJFormData.prototype.cptDate= function (that,item) {
    var divId=item.attr('id'),formId=item.attr(that.formIdName);
    var dateInputId = 'date_' + divId;
    var properties=that.propertiesMap[formId][divId];
    var name=properties['name'];
    var defValue='';
    var currentTime=properties['currentTime'];
    var formatArr=properties['dateFormat'].split('|');
    var ui=formatArr[0],format=formatArr[1];
    if(currentTime=='0'){
        defValue=new Date().format(format);
    }
    item.find("input").attr('id', dateInputId);
    layui.laydate.render({
        elem: '#' + dateInputId
        ,type:ui
        ,value:defValue
        ,done: function(value, date, endDate){
            that.formData[formId][name]=value
        }
    });
    that.resetDataCpt[that.resetDataCpt.length]='date';
}

AdminJFormData.prototype.initOptionsValue= function (that,item,isSingle){
    var divId=item.attr('id'),formId=item.attr(that.formIdName);
    var name=that.propertiesMap[formId][divId]['name'];

    var arr=that.propertiesMap[formId][divId]['options'];
    var arrValue=[]
    if(arr!=undefined){
        for(var i=0;i<arr.length;i++){
            var row=arr[i];
            if(row.isSelect=='0'){
                if(isSingle){
                    that.formData[formId][name]=row.value;
                    break;
                }else{
                    arrValue[arrValue.length]=row.value;
                }
            }
        }
    }
    if(!isSingle)that.formData[formId][name]=arrValue;
    
}

AdminJFormData.prototype.cptSelect2= function (that,item) {
    var divId=item.attr('id'),formId=item.attr(that.formIdName);
    var name=that.propertiesMap[formId][divId]['name'];

    that.initOptionsValue(that,item,false);

    item.find("select").attr('id', 'select_' + divId);
    item.find("select").select2().on('select2:select', function (e) {
        //console.log('s:' + JSON.stringify(e.params.data.id+'='+e.params.data.text));
        var arr=that.formData[formId][name];
        if(arr==undefined)arr=[];
        arr[arr.length]=e.params.data.id;
    }).on('select2:unselect', function (e) {
        //console.log('us:' + JSON.stringify(e.params.data));
        var arr=that.formData[formId][name];
        arr.deleteValue(e.params.data.id);
    });
    that.resetDataCpt[that.resetDataCpt.length]='select2';
}

AdminJFormData.prototype.cptDateRange= function (that,item) {
    var divId=item.attr('id'),formId=item.attr(that.formIdName);
    //var name=that.propertiesMap[divId]['name'];
    var dateDivId = divId + 'd_rang';
    item.find('input').attr('id', dateDivId).attr('name', divId);

    var properties=that.propertiesMap[formId][divId];
    var defValue='';
    var currentTime=properties['currentTime'];
    var formatArr=properties['dateFormat'].split('|');
    var ui=formatArr[0],format=formatArr[1];
    if(currentTime=='0'){
        var val=new Date().format(format);
        defValue=val+' - '+val;
    }

    layui.laydate.render({
        elem: '#' + dateDivId
        ,type:ui
        ,value:defValue
        , range: true
        ,done: function(value, date, endDate){
            var startValue='',endValue='';
            if(value.length>0){
                var arr=value.split(' - ');
                startValue=arr[0];
                endValue=arr[1];
            }
            var properties=that.propertiesMap[formId][divId];
            that.formData[formId][properties['startDateName']]=startValue;
            that.formData[formId][properties['endDateName']]=endValue;
        }
    });
    that.resetDataCpt[that.resetDataCpt.length]='dateRange';
}

AdminJFormData.prototype.cptUploadImage= function (that,item) {
    var divId=item.attr('id');

    that.uploadImageFile(divId,divId, item,false)
    that.resetDataCpt[that.resetDataCpt.length]='uploadImage';
}

AdminJFormData.prototype.cptUploadImages= function (that,item) {
    var divId=item.attr('id'),formId=item.attr(that.formIdName);
    var name=that.propertiesMap[formId][divId]['name'];

    var uploadFunc=function(_item){
        var uploadId='up_id_' + Date.now();
        _item.attr('id',uploadId)
        that.uploadImageFile(divId,uploadId, _item,true)
        _item.find('#close_div').children().eq(0).click(function () {
            var uploadItem=$(this).parent().parent().parent();
            var uploadId=uploadItem.attr('id');
            uploadItem.remove()
            if(that.formData[formId][name][uploadId]!=undefined)that.formData[formId][name][uploadId]=undefined;
            //需要调S删除图片
        })
    };

    var item0 = item.find('.upload_ul').children().eq(0);
    item0.attr(that.formIdName,formId);
    uploadFunc(item0);

    item.find('#add_div').click(function () {
        var node = $($('span #uploadImages .upload_ul').children(':first').get(0).outerHTML)
        node.attr(that.formIdName,formId);
        $(this).parent().find('#add_div').before(node)
        uploadFunc(node);
        
    });

    that.resetDataCpt[that.resetDataCpt.length]='uploadImages';

}

AdminJFormData.prototype.cptUploadFile= function (that,item) {
    var divId=item.attr('id');
    var cptId=item.attr('cpt_id');
    that.uploadSingleFile(divId,cptId,item)
    that.resetDataCpt[that.resetDataCpt.length]='uploadFile';
}

AdminJFormData.prototype.cptUploadFiles= function (that,item) {
    var divId=item.attr('id');
    var cptId=item.attr('cpt_id');
    that.uploadFiles(divId,cptId,item)
    that.resetDataCpt[that.resetDataCpt.length]='uploadFiles';
}

AdminJFormData.prototype.cptColor= function (that,item) {
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


AdminJFormData.prototype.cptSlider=function (that,item) {
    that.initSlider(that,item,undefined);
    that.resetDataCpt[that.resetDataCpt.length]='slider';
}

AdminJFormData.prototype.initSlider=function (that,item,initValue) {
    var divId = item.attr('id'),formId=item.attr(that.formIdName);
    var inputId = divId + '_slider';
    item.find('.layui-form-label').next().children().eq(0).attr('id', inputId);
    var properties=that.propertiesMap[formId][divId];
    var min=parseInt(properties['minValue']),max=parseInt(properties['maxValue']),val=parseInt(properties['defValue']),suffix=properties['suffix'];
    var showInput=properties['showInput'];
    if (isNaN(min)) min = 0; 
    if (isNaN(max))max = 100;
    if (isNaN(val)) val = 0; 
    if(initValue!=undefined)val =initValue;
    if(showInput==undefined)showInput='0';
    var isShowInput=showInput=='0'?true:false;
    if(suffix==undefined)suffix='';
    that.formData[formId][properties['name']]=val+'';
    layui.slider.render({
        elem: '#' + inputId
        , input: isShowInput
        , value: val
        , min: min
        , max: max
        , setTips: function (value) {
            return value+suffix;
        }
        , change: function (val) {
            that.formData[formId][properties['name']]=val;
        }
    });
}

AdminJFormData.prototype.cptRate=function (that,item) {
    that.initRate(that,item,undefined);
    that.resetDataCpt[that.resetDataCpt.length]='rate';
}

AdminJFormData.prototype.initRate=function (that,item,initValue) {
    var divId = item.attr('id'),formId=item.attr(that.formIdName);
    var inputId = divId + '_rate';
    var properties=that.propertiesMap[formId][divId];
    item.find('.layui-form-label').next().children().eq(0).attr('id', inputId);
    var _value = parseInt(properties['defValue']), _rateCount = parseInt(properties['rateCount']);
    if (isNaN(_rateCount)) _rateCount = 5; properties['defValue']=_rateCount+'';
    if (isNaN(_value)) _value = 0;
    if(initValue!=undefined)_value =initValue; 
    properties['defValue']=_value+'';
    that.formData[formId][properties['name']]=properties['defValue'];
    layui.rate.render({
        elem: '#' + inputId,
        value: _value,
        length: _rateCount
        ,choose: function(value){
            that.formData[formId][properties['name']]=value;
        }
    })
}



AdminJFormData.prototype.cptEditor= function (that,item) {
    var divId = item.attr('id');
                var inputId = divId + '_editor';
                item.find('.layui-form-label').next().children().eq(0).attr('id', inputId);
                //document.querySelector('.editor')

                ClassicEditor.create(document.getElementById(inputId), {
                    toolbar: {
                        items: [
                            'heading', '|', 'bold', 'italic', 'blockQuote', 'fontColor', 'link', 'fontBackgroundColor', 'fontSize', '|', 'bulletedList', 'numberedList',
                            'outdent', 'indent', '|', 'findAndReplace', 'imageUpload', 'insertTable', 'mediaEmbed', 'CKFinder', 'undo', 'redo'
                        ]
                    },
                    language: 'zh-cn',
                    image: {
                        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties']
                    },
                    licenseKey: '',
                })
                    .then(editor => {
                        //window.editor = editor;
                        that.editorMap[divId]=editor;
                    })
                    .catch(error => {
                        console.error(error);
                    });
}

//组件部分 end-------------------

AdminJFormData.prototype.uploadSingleFile=function(divId, cptId, item) {
    var that=this;
    var formId=item.attr(that.formIdName);
    var uploadUrl=that.propertiesMap[formId][divId]['uploadUrl']
    var name=that.propertiesMap[formId][divId]['name']
    if(uploadUrl==undefined || uploadUrl=='')uploadUrl='https://httpbin.org/post'
    var uploadTypeArr=that.propertiesMap[formId][divId]['uploadType']
    var uploadType=that.replaceFileSuffix(uploadTypeArr)

    var fileId = divId + 'd_file';
    item.find('button').attr('id', fileId);
    layui.upload.render({
        elem: '#' + fileId
        , url: uploadUrl
        ,exts:uploadType
        , accept: 'file'
        ,field:name
        ,data:{'filename':function () {
                var name = that.propertiesMap[formId][divId]['name']
                var fname = that.formData[formId][name]
                if(fname==undefined)fname='';
                return fname;
            }}
        , done: function (res) {
            layui.layer.msg('上传成功');
            $('#uploaded_div').html('')
            that.updateUploadFilename(formId,divId,'',res,false)
        }, progress: function (n, index, e) {
            $('#uploaded_div').html(n + '%')
            if (n == 100) {
                layer.msg('上传完毕', {icon: 1});
            }
        }
    });
}

AdminJFormData.prototype.uploadFiles=function(divId, cptId, item) {
    var _that=this;
    var formId=item.attr(_that.formIdName);
    var uploadUrl=_that.propertiesMap[formId][divId]['uploadUrl']
    var name=_that.propertiesMap[formId][divId]['name']
    if(uploadUrl==undefined || uploadUrl=='')uploadUrl='https://httpbin.org/post'
    var uploadTypeArr=_that.propertiesMap[formId][divId]['uploadType']
    var uploadType=_that.replaceFileSuffix(uploadTypeArr)

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
                _that.updateUploadFilename(formId,divId,uploadId,res,true)
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


AdminJFormData.prototype.uploadImageFile=function(divId, uploadId, item, isMulti){
    var that=this;
    var formId=item.attr(that.formIdName);
    var uploadUrl=that.propertiesMap[formId][divId]['uploadUrl']
    var name=that.propertiesMap[formId][divId]['name']
    if(uploadUrl==undefined || uploadUrl=='')uploadUrl='https://httpbin.org/post'
    var uploadTypeArr=that.propertiesMap[formId][divId]['uploadType']
    var uploadType=that.replaceFileSuffix(uploadTypeArr)
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
                    var fname = that.propertiesMap[formId][divId]['name']
                    //fname = that.formData[name][uploadId]
                }catch(e){}
                if(fname==undefined)fname='';
                return fname;
            }}
        ,acceptMime: 'image/*'
        ,choose:function (obj) {
            console.log(JSON.stringify(obj))
        }
        ,before: function(obj){
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

            that.updateUploadFilename(formId,divId,uploadId,res,isMulti)

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

AdminJFormData.prototype.updateUploadFilename=function(formId,divId,uploadId, res, isMulti){
    //
    var that=this;
    if(res.filename!=undefined){
        var name=that.propertiesMap[formId][divId]['name']
        if(isMulti){
            var files=that.formData[formId][name]
            if(files==undefined)files={}
            files[uploadId]=res.filename
            that.formData[formId][name]=files
        }else{
            that.formData[formId][name]=res.filename
        }
    }
}

AdminJFormData.prototype.getData=function(formId) {
    var that=this;
    var data = layui.form.val(formId);
    var formMap=that.propertiesMap[formId];
    for(divId in formMap){
        var properties=formMap[divId];
        var cptId=properties['id']
        var name=properties['name'];
        var defValue=properties['defValue'];
        var isReplaceData=false;
        for(var i=0;i<that.resetDataCpt.length;i++){
            var _cptId=that.resetDataCpt[i];
            if(_cptId==cptId){
                isReplaceData=true;
                break;
            }
        }
   
        if(isReplaceData){
            switch(cptId){
                case 'dateRange':
                    var milliscondFormat=properties['milliscondFormat'];
                    var startDate=that.formData[formId][properties['startDateName']],endDate=that.formData[formId][properties['endDateName']];
                    if(!stringIsEmpty(startDate)){
                        if(milliscondFormat=='0'){
                            data[properties['startDateName']]=stringToDate(startDate).getTime();
                            data[properties['endDateName']]=stringToDate(endDate).getTime();
                        }else{
                            data[properties['startDateName']]=startDate;
                            data[properties['endDateName']]=endDate;
                        }
                    }
                    break;
                case 'date':
                    var milliscondFormat=properties['milliscondFormat'];
                    var date=that.formData[formId][properties['name']];
                    if(!stringIsEmpty(date)){
                        if(milliscondFormat=='0'){
                            data[properties['name']]=stringToDate(date).getTime();
                        }else{
                            data[properties['name']]=date;
                        }
                    }
                    break;
                default:
                    data[name]=that.formData[formId][name];
            }
        }

        if(cptId=='editor'){
            data[name]=that.editorMap[divId].getData();
        }

        if(!stringIsEmpty(defValue) && stringIsEmpty(data[name])){
            data[name]=defValue;
        }


        
    }


    return data;

}

AdminJFormData.prototype.setData=function(formId,data) {
    var formMap=this.propertiesMap[formId];
    for(divId in formMap){
        var properties=formMap[divId];
        var cptId=properties['id']
        var name=properties['name'];
        var initValue=data[name];
        //var defValue=properties['defValue'];

        switch(cptId){
            case 'date':
                var milliscondFormat=properties['milliscondFormat'],currentTime=properties['currentTime'];
                var formatArr=properties['dateFormat'].split('|');
                var dateFormat=formatArr[1];
                var val='';
                if(milliscondFormat=='0'&& !isNaN(initValue)){
                    val=new Date(parseInt(initValue)).format(dateFormat);
                }
                if(stringIsEmpty(val) && currentTime=='0'){
                    val=new Date().format(dateFormat) ;
                }
                
                data[name]=val;
                break;
            case 'dateRange':
                var startDateName=properties['startDateName'],endDateName=properties['endDateName'];
                var milliscondFormat=properties['milliscondFormat'],currentTime=properties['currentTime'];
                var startDate=data[startDateName],endDate=data[endDateName];
                var formatArr=properties['dateFormat'].split('|');
                var dateFormat=formatArr[1];
                var val='';
                if(milliscondFormat=='0'){
                     if(!isNaN(startDate)){
                        var sdate=new Date(parseInt(startDate)).format(dateFormat);
                        data[startDateName]=sdate;
                        val=sdate;
                     }
                     if(!isNaN(endDate)){
                        var edate=new Date(parseInt(endDate)).format(dateFormat) ;
                        data[endDateName]=edate;
                        val=val+' - '+edate;
                     }
                }
                
                if(stringIsEmpty(val) && currentTime=='0'){
                    var date=new Date().format(dateFormat) ;
                    val=date+' - '+date;
                }

                data[divId]=val;
                
                break;
            case 'editor':
                $('#'+divId).find('.editor').html(initValue);
                break;
            case 'select2':
                $('#'+divId).find('select').val(initValue).trigger('change');
                break;
            case 'slider':
                var val=parseInt(initValue);
                if(isNaN(val))val=undefined;
                this.initSlider(this,$('#'+divId),val);
                break;
            case 'rate':
                var val=parseInt(initValue);
                if(isNaN(val))val=undefined;
                this.initRate(this,$('#'+divId),val);
                break;
            case 'checkbox':
                if(initValue!=undefined){
                    $('#'+divId).find('[type="checkbox"]').each(function(i,e){
                        var _val=$(this).val();
                        for(var i=0;i<initValue.length;i++){
                            if(_val==initValue[i]){
                                $(this).prop('checked', 'true');
                            }else{
                                $(this).prop('checked', '');
                            }
                        }
                    });
                    
                }
                break;
            case 'switch':
                if (initValue != undefined) {
                var selectedValue=properties['selectedValue'],defValue=properties['defValue'];
                if(initValue==selectedValue){
                    $('#'+divId).find('[type="checkbox"]').prop('checked','true');
                }else{
                    $('#'+divId).find('[type="checkbox"]').prop('checked', '');
                }
                }
                break;
        }

    }

    this.formData[formId]=data;
    layui.form.val(formId,data);
    layui.form.render();

}

AdminJFormData.prototype.replaceFileSuffix=function(arr){
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


layui.define(function(exports){
    exports('adminJFormData',new AdminJFormData() );
  })




