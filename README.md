<p>表格创建流程</p>
<p>1、创建工具栏</p>
<p>2、创建表头</p>
<p>3、通过AJAX取得数据并渲染表格</p>
<p>4、绑定各种事件</p>

<p>加载数据的方式有两种</p>
<p>1、直接加载全部</p>
<p>2、当点击要看的数据时再加载</p>
<pre>
"越秀区":{
    "data": {
        "arry":[50,100,100],        
        "hasData": "yes",
        "id": 123
    },
    "x街":{
        "data": {
            "arry":[50,100,100],            
            "id": 123
        }
    }
}
</pre>
<p>举例，如上JSON数据所示，其中越秀区的数据为data, data里的arry为需要展示的数据, id在创建表格时赋在table上，作为唯一标示符，当点击越秀区需要加载数据时将ID传到后台，取得相对应的数据再渲染表格，这个视情况而定，可自己修改。</p>
<p>hasData代表有需要要加载的数据 在页面表现为+号 点击+号加载数据</p>
<p>如果没有hasData就代表没有要加载的数据了 在页面表现为-号</p>
<p>具体可以看两个DEMO的展示</p>
<pre>
$('.table-tree').tableTree({
    url: 'json/demo.json',
    tableHead: ['地区（降雨量）','1月','2月','3月'],
    width: 600,
    ajax: function() {
        var data;
        $.ajax({
            async: false,
            url: opt.url,
            success: function(obj) {
                data = obj;
            },
            error: function() {

            }
        })
        return data;
    }
})
</pre>
<p>url为后台URL,必填</p>
<p>tableHead为表头数据，必填</p>
<p>width 宽 选填</p>
<p>height 高 选填</p>
<p>ajax函数 最好自己写一个覆盖组件里的 因为组件里的只是一个DEMO 真正跟后台对接需要传什么参数由自己决定。</p>
<p>如果不会布服务器环境，可以下载Hbuilder编辑器将代码文件放进去直接打开html文件观看DEMO。</p>
![img](https://raw.githubusercontent.com/woai3c/table-tree/master/demo.png)

