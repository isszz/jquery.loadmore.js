#基础用法

$('#J_list').loadmore(function(more, page) {
	// 获取数据
	$.getJSON(this.options.listUrl, urlData).done(function(result) {
		if(result.errno == 0) {
			if (result.data.count > 0) {
				more.render(template('J_list_template', result.data), function(wrap, type) {
					wrap.find('img').lazyload({
						effect : 'fadeIn',
						threshold: 100,
						failureLimit: 10,
					});
				});
				if (result.message == 'more') {
					more.more();
				} else {
					more.end(!0);
				}
			} else {
				more.notData();
			}
		} else {
			Q.tips({type: result.type, message: result.message, time: 3});
		}
		more.end();
	});
}, {notTxt: '暂无XX});

#重置
`
$('#J_list').data('loadmore').reset();
`
#带callback方式重置
`
$('#J_list').data('loadmore').reset(function() {
	$.getJSON();//...
});
`
