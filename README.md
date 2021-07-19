# layui-form-render

#### 介绍
基于layui的表单设计器，自己的一个开源项目里提出来的子项目，主要参考了阿狸的那个VUE的 form render，目前此项目处于开始阶段，另外并没有跟layui集成，如果想集成到一起只需要把HTML>body的内容放在变量里在render() 里开头写入即可

#### 软件架构
基于layui开发，基它插件主要是 


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


#### 参与贡献


#### 2开简单说明

在html里找到下面代码
```
<span id="cpts_items" style="display: none">
```
所有的拖动后生成的组件都在这里，可以显示出来进行编辑预览等操作
