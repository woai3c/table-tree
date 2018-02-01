;(function($, window, document,undefined) {
    //定义TableTree的构造函数
    var TableTree = function(ele, opt) {
        this.element = ele;
        this.defaults = {
        	width: '98%',
        	height: '98%',
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
        };
        this.options = $.extend({}, this.defaults, opt);
        this.renderHtml = '';
        this.container = null;
        this.toolBar = null;
        this.currentParent = null;
        this.ajaxId = ''; 
        this.tempHtml = '';
    }

    //定义TableTree的方法
    TableTree.prototype = {
        init: function() {    // 初始化		
        	this.element.addClass('tableTree'); 
			this.createTool();
			if (this.options.tableHead) {
				this.createHead();
			}
			this.createTable(this.options.ajax());
			this.events();
        },
        createTool: function() { // 工具栏
        	var data = [{add:'添加'}, {delete:'删除'}, {edit:'编辑'}, {save:'保存'}, {find:'查询'}];
        	var html = '<div><ul class="toolBar">';
        	data.forEach(function(e) {
        		var key = Object.keys(e);
        		html += '<li><button class="' + key[0] + '">';
        		html += e[key[0]];
        		html += '</button></li>';
        	})
			html += '<input class="input_find"></ul></div>';
        	this.element.append(html);
        	this.toolBar = this.element.find('.toolBar');
        },
        createHead: function() { // 表头
        	var html = '<div class="table_head"><table><tr>';
        	var data = this.options.tableHead;
        	data.forEach(function(e) {
        		html += '<td>';
        		html += e;
        		html += '</td>';
        	});
        	html += '</tr></table>';
        	this.element.append(html);     			
        },
        createTable: function(data) { 
        	if (this.element.find('.container_datagrid_tree').length) {
        		this.element.find('.container_datagrid_tree').html('');
        		this.renderHtml = '';
        	} else {
	        	var html = '<div class="level container_datagrid_tree"></div>';
	        	this.element.append(html);  
	        	this.container = this.element.find('.container_datagrid_tree');
        	}
        	for (var key in data) {
        		this.level = 1;
        		this.renderHtml += '<div class="level level' + this.level + '">';
        		this.renderData(data[key], this.level, key); 
        		this.renderHtml += '</div>';
        	}
        	this.container.append(this.renderHtml); 
        },
        renderData: function(data, level, parentKey) { // 渲染表格
        	var length = this.getObjLength(data);
        	var count = 0;
        	for (var key in data) {
        		count++;
        		if (key == 'data') {
        			var tempData = data[key].arry;
        			tempData.unshift(parentKey);
					if (data[key].hasData && data[key].hasData == 'yes') {
						this.renderHtml += '<table class="hasData" data-id="' + data[key].id  + '">';						
					} else {
						this.renderHtml += '<table data-id="' + data[key].id  + '">';
					}	
        			for (var i = 0, len = tempData.length; i < len; i++) {
        				this.renderHtml += '<td>';
        				this.renderHtml += tempData[i];
        				this.renderHtml += '</td>';
        			}
        			this.renderHtml += '</table>';
        		} else {
        			this.level++;
        			this.renderHtml += '<div class="level level' + this.level + '">';
        			this.renderData(data[key], level, key); 
        		}
        		if (count == length) {
        			this.level--;
        		}
        		if (count != 1) {
        			this.renderHtml += '</div>';
        		}
        	}
        	
        },
       	loadData: function() { // 懒加载
            this.element.append('<i class="iconfont icon-loading"></i>');
       		this.level = parseFloat(this.currentParent.attr('class').replace('level level', ''));
       		var data = this.options.ajax();
			this.renderHtml = '';
       		this.renderData(data, this.level); 
       		this.currentParent.append(this.renderHtml);
            this.element.find('.icon-loading').remove();
       		this.extend();
        	this.select();
       	},
        find: function() { // 查找
        	var that = this;
        	var input = this.element.find('.input_find');
        	var btn = this.element.find('.find');
        	btn.on('click', function() {
        		if (that.toolBar.find('.back').length) {
        			return;
        		}
				var value = that.element.find('.input_find').val();
				var fragment = document.createDocumentFragment();
				if (!value) {
					return;
				}
				that.container.find('tr').each(function(i, tr) {
					var isFirst = true;
					$(tr).find('td').each(function(j, td) {
						var str = td.innerHTML;
	    				str = str.replace('<i class="iconfont icon-jianhao"></i>', '');
						str = str.replace('<i class="iconfont icon-iconfontadd"></i>', '');
						if (isFirst) {
							if (str.indexOf(value) != -1) {
								isFirst = false;
								$(tr).clone(true).appendTo(fragment);
							}
						}
					})
				})
				that.tempHtml = that.container.html();
				that.container.html('<div class="level level1"><table></table></div>');
				that.container.find('table').append(fragment);
				that.toolBar.append('<li class="back"><button>返回</button></li>')
				that.toolBar.find('.back button').on('click', function() {
					that.toolBar.find('.back').remove();
					that.container.html(that.tempHtml);
					that.events();
				})
        	});
        },
        add: function() { // 添加
        	var that = this;
        	this.element.find('.add').on('click', function() {
        		if (that.container.find('.check_tr').length) {
					var div = that.container.find('.check_tr').parent().parent().parent();
					var level = parseFloat(div.attr('class').replace('level level', '')) + 1;
					if (isNaN(level)) {
						level = 2;
					}
					var html = '<div class="level level' + level + '"><table><tr class="editing">';
					for (var i = 0, len = that.container.find('.check_tr td').length; i < len; i++) {
						html += '<td><input></td>';
					}
					html += '</tr></table></div>';
					div.append(html);
					that.extend();
        			that.select();
        		}
        	})
        },
        delete: function() { // 删除
     		var that = this;
        	this.toolBar.find('.delete').on('click', function() {
        		if (that.container.find('.check_tr').length) {
        			that.container.find('.check_tr').parent().parent().parent().children().remove();
        		}
        	});
        },
        edit: function() { // 编辑
        	var that = this;
        	this.element.find('.edit').on('click', function() {
        		if (that.container.find('.check_tr').length) {
        			if (that.container.find('.check_tr').hasClass('editing')) {
        				return;
        			}
        			that.container.find('.check_tr').addClass('editing');
        			that.container.find('.check_tr td').each(function(i, e) {
        				var str = e.innerHTML;
        				str = str.replace('<i class="iconfont icon-jianhao"></i>', '');
						str = str.replace('<i class="iconfont icon-iconfontadd"></i>', '');
        				e.innerHTML = '<input value="' + str + '">';
        			})
        		}
        	})
        },
        save: function() { // 保存
        	var that = this;
        	this.element.find('.save').on('click', function() {
        		if (that.container.find('.editing').length) {
        			that.container.find('.editing td').each(function(i, e) {
      					e.innerHTML = $(e).find('input').val();
        			})
        			that.container.find('.editing').removeClass('editing');
        			that.extend();
        			that.select();
        		}
        	})
        },
        extend: function() { // 展开收缩
        	var that = this;
			this.element.find('.level').each(function(i, e) { // 展开 收起
				var td = null;
				var str = '';
				if (e.children.length > 1) {
					td = $(e).find('td:first-child')[0];
					str = td.innerHTML.replace('<i class="iconfont icon-jianhao"></i>', '');
					str = str.replace('<i class="iconfont icon-iconfontadd"></i>', '');
					td.innerHTML = '<i class="iconfont icon-jianhao"></i>' + str;
					$(td).attr('data-show', true);
				} else if ($(e.children[0]).hasClass('hasData')) {
					td = $(e).find('td:first-child')[0];
					str = td.innerHTML.replace('<i class="iconfont icon-jianhao"></i>', '');
					str = str.replace('<i class="iconfont icon-iconfontadd"></i>', '');
					td.innerHTML = '<i class="iconfont icon-iconfontadd"></i>' + str;
					$(td).attr('data-show', false);
				}
				
				if (td) {
					td.onclick = function(event) {
						var target = event.target;
						if (target.nodeName == 'INPUT' || $(target).parent().hasClass('editing')) {
							return;
						}
						if (target.nodeName == 'I') {
							target = $(target).parent()[0];
						}
						var table = $(target.parentNode.parentNode.parentNode);
						that.currentParent = table.parent();
						that.ajaxId = table.attr('data-id');
						if ($(this).attr('data-show') == 'true') {
							$(this).attr('data-show', 'false');
							table.siblings().hide();
							this.innerHTML = '<i class="iconfont icon-iconfontadd"></i>' + str;
						} else {
							$(this).attr('data-show', 'true');
							table.siblings().show();
							this.innerHTML = '<i class="iconfont icon-jianhao"></i>' + str;
							if (!table.siblings().length) {
								that.loadData();
							}
						}
					}
				}
			})
        },
        select: function() { // 选中
        	var that = this;
        	this.container.find('tr').on('click', function() { // 选中      	
				that.container.find('tr').removeClass('check_tr');
				$(this).addClass('check_tr');
				that.currentParent = $(this).parent().parent().parent();
			})
        },
        events: function() { // 事件管理
        	this.extend();
        	this.select();
			this.delete();
			this.find();
			this.edit();
			this.save();
			this.add();
			this.setStyle();
        },
        getObjLength: function(obj) { // 获取对象长度
			return Object.keys(obj).length;
        },
        setStyle: function() { // 设置样式
        	this.options.width += '';
        	this.options.height += '';
        	if (this.options.width.indexOf('%') != -1) {
        		this.element.width(this.options.width)
        	} else {
        		this.element.width(this.options.width + 'px')
        	}
        	
        	if (this.options.height.indexOf('%') != -1) {
        		this.element.height(this.options.height)
        	} else {
        		this.element.height(this.options.height + 'px')
        	}
        	this.element.find('.table_head').width(this.element.width() + 'px')
        }
    }

    //在插件中使用TableTree对象
    $.fn.tableTree = function(options) {
        //创建TableTree的实体
        new TableTree(this, options).init();
    }
})(jQuery, window, document);