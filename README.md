# AdminJ layui-form-render



![界面图](https://images.gitee.com/uploads/images/2021/0720/001030_f747e566_9463723.jpeg "editor1.jpg")

#### 介绍
基于layui的表单设计器，自己的一个开源项目里提出来的子项目，主要参考了阿狸的那个VUE的 form render，目前此项目处于开始阶段，另外并没有跟layui集成，如果想集成到一起只需要把HTML>body的内容放在变量里在render() 里开头写入即可

AdminJ layui-form-render 不只是生成html form 还另外提供了 AdminJFormData form的数据初始化组件(数据)并生成验证代码功能(参考editor_base.html)，开箱即用。

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



####  **AdminJFormData (editor_base.html) 功能使用说明**
AdminJFormData 是对form render的增强，如果你在导出的html form里选择了长度，最大值 最小值验证等、使用了编辑器、滑块，用AdminJFormData会自动初始化这些组件并且生成验证功能，其节省的时间比 form render要多的多。

- 如何使用：只需要把 form render 导出的html粘到 editor_base.html 的body 内就OK，功能参考 预览 功能


 **AdminJFormData集成说明** 

- 初始化AdminJFormData 导入js：
```
<script src="adminj/adminj_form.js"></script>
<script src="adminj/adminj_utils.js"></script>
```
- 获取AdminJFormData对像
```
var adminJFormData = layui.adminJFormData;
```
- 初始化html form，初始化各种组件和初始值:
```
adminJFormData.init(_json, 'form');//_json 为form render导出 html时自动生成的代码，第2个参数为 form 的 lay-filter 值
```
- 初始化数据:
```
var d={"hidden":"f","text":"123","textarea":"nn","password":"1222333","select":"2","radio":"2","checkbox":["0","2"],"select2":["0","2"],"color":"#0f3e62","switch":"1"};
adminJFormData.setData('form',d);//第一个参数为 form 的 lay-filter 值, 另外checkbox、select2的值必须是array
```
- 取数据：

```
var data = adminJFormData.getData('form');//第一个参数为form 的 lay-filter 值
```




 **关于图片上传结果:** 
需要server返回 resultCode=0,result.filename=上传文件名 的json的数据结构，如果是多文件上传则getData时对应字段拿到的是个array,单文件是string
样例：{resultCode:0,message:"",result:结果}

| resultCode | 0      | 上传成功返回0  |
|----------|--------|----------|
| result.filename | xx.jpg | 上传成功的文件名 |



 **使用例子如下:** 

```
layui.use('element', function () {
        var adminJFormData = layui.adminJFormData;
        adminJFormData.init(_json, 'form');

        //初始化form数据
        var d={"hidden":"f","text":"123","textarea":"nn","password":"1222333","select":"2","radio":"2","checkbox":["0","2"],"select2":["0","2"],"color":"#0f3e62","switch":"1"};
        adminJFormData.setData('form',d);

        layui.form.on('submit(postButton)', function (data) {
            var data = adminJFormData.getData('form');//取form的数据
            var val = JSON.stringify(data);
            console.log(val)

            return false;
        });

    });

```


 **无限级联动 数据API说明** 
 提交数据
| parentId | 上级ID  | 初始化时传值 ,在最顶级时 parentId会传空字符                                                              |
|----------|-------|-----------------------------------------------------------------------|
| selectId | 选中的ID | 在编辑时传值，与parentId只传一个值，传selectId时server必须返回 selectId所在级别的数据和它所有上级的数据列表,传selectId时parentId无效 |

返回数据
| isSelect | 是否选中 | "0" 是 "1" 否 |
|----------|-------|-----------------------------------------------------------------------|
| text | 显示的文本 |  |
| value | select value |  |

传parentId时返回的完整数据样例

```
{"resultCode":0,"result":[{"isSelect":"1","text":"title0","value":"0"},{"isSelect":"1","text":"title1","value":"1"},{"isSelect":"1","text":"title2","value":"2"}]}
```
传selectId时返回的完整数据样例

```
{"resultCode":0,"result":[[{"isSelect":"1","text":"title0","value":"0"},{"isSelect":"1","text":"title1","value":"1"},{"isSelect":"0","text":"title2","value":"2"}],[{"isSelect":"1","text":"title0","value":"0"},{"isSelect":"1","text":"title1","value":"1"},{"isSelect":"0","text":"title2","value":"2"}],[{"isSelect":"1","text":"title0","value":"0"},{"isSelect":"1","text":"title1","value":"1"},{"isSelect":"0","text":"title2","value":"2"}]]}
```


#### 参与贡献


#### 2开简单说明

在html里找到下面代码
```
<span id="cpts_items" style="display: none">
```
所有的拖动后生成的组件都在这里，可以显示出来进行编辑预览等操作

-  **8-2 增加无限级选择联动** 
    修改了ajax请求时返回的结果的key name ，包括数据请求和文件上传 ,标准为{resultCode:0,message:"",result:结果} ,可在 config.ajaxRequestName 自定义

-  **8-1 发布 AdminJFormData 版本** 

-  **2021-7-2? 发布第一个form render版本** 

