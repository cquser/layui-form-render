# AdminJ layui-form-render



![界面图](https://images.gitee.com/uploads/images/2021/0720/001030_f747e566_9463723.jpeg "editor1.jpg")

#### 介绍
基于layui的表单设计器，自己的一个开源项目里提出来的子项目，主要参考了阿狸的那个VUE的 form render，目前此项目处于开始阶段，另外并没有跟layui集成，如果想集成到一起只需要把HTML>body的内容放在变量里在render() 里开头写入即可

演示地址: http://47.244.155.29:13308/editor/editor.html

#### 软件架构
基于layui开发，所使用的插件:


|  插件 | 说明  |
|---|---|
| sortable  |  很COOL的拖动排序功能 |
|  jquery-sortable | 让sortable支持Jquery的插件  |
| select2  |  下拉多选框 |
|  ckeditor5 |  H5的文本编辑器 |




#### 使用说明


```
var formRender = new AdminJLayuiFormRender();
formRender.exportToHTML();//导出html
formRender.importJSON('json');//导入逆向生成html
formRender.exportJSON();//导出JSON
```
| 参数           | 说明      |            |
|--------------|---------|------------|
| id           | 组件ID    | text,image |
|label |   label   |            |
| name |   input的唯一名称   |            |
| labelWidth   | label列宽 | px         |
| rowWidth     | 行宽      | %          |
| inputWidth   | 输入框宽    | %          |
| validateRule | 验证规则    | array      |
| comment      | 输入框后的说明 |            |
| required     | 必填(选)   |            |
| placeholder  | 输入框内的提示 |            |
| defValue     | 默认值     |            |
| minValue|   最小值   |            |
| maxValue |   最大值   |            |
|minLength |  最小长度    |            |
| maxLength |  最大长度    |            |
|options |   array(radio,checkbox select 选择项)   |            |
| layuiSkin|   checkbox以layui样式显示   |            |
|dateFormat |  时间格式化样式    |            |
|currentTime |   当前时间为初始值   |            |
|milliscondFormat |  提交数据时格式化为毫秒    |            |
|startDateName | 时间范围开始时间的name     |            |
|endDateName |  时间范围结束时间的name    |            |
|showInput |   滑块是否显示输入框   |            |
|suffix |  滑块拖动时显示的后缀    |            |
|rateCount |  评分显示的星星总数    |            |
|uploadType |   array 文件上传的类型   |            |
| minSize |  文件上传最小大小   |            |
| maxSize |  文件上传最大大小   |            |
| uploadUrl | 文件上传地址    |            |
| uploadCount | 最大文件上传数量    |            |
| groupCount |  多组布局的例的数量   |            |



#### editor_base.html 功能使用说明
editor_base.html 集成了getData('form lay-filter'),和setData('form lay-filter',{}) 功能， getData拿取form数据，setData 设置form数据, 功能可以在预览里体验


需要导入js:

```
<script src="adminj/adminj_form.js?v=10166"></script>
<script src="adminj/adminj_utils.js"></script>
```


```
layui.use('element', function () {
        var adminJFormData = layui.adminJFormData;
        adminJFormData.init(_json, 'form');

        //初始化form值
        var d={"hidden":"f","text":"123","textarea":"nn","password":"1222333","select":"2","radio":"2","checkbox":["0","2"],,"select2":["0","2"],"color":"#0f3e62","switch":"1"};
        adminJFormData.setData('form',d);

        layui.form.on('submit(postButton)', function (data) {
            var data = adminJFormData.getData('form')
            var val = JSON.stringify(data);
            console.log(val)

            return false;
        });

    });

```



#### 参与贡献


#### 2开简单说明

在html里找到下面代码
```
<span id="cpts_items" style="display: none">
```
所有的拖动后生成的组件都在这里，可以显示出来进行编辑预览等操作

- 8-1 发布基础代码版本

- 7-2? 发布第一个版本

