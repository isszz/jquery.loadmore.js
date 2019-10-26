### 用法

```js
var urlData = {},
	listUrl = 'api/list';
	
// add url data
urlData.cid = 1;
$('#J_list').loadmore(function(more, page) {
	urlData.page = page;
	// 获取数据
	$.getJSON(listUrl, urlData).done(function(res) {
		// res = {errno: 0, message: 'more|none', data: { count:10, list: [{}, {}, {}, ...] }};
		if(res.errno == 0) {
			if (res.data.count > 0) {
				more.render(template('J_list_template', res.data), function(wrap, type) {
					// ...
				});
				if (res.message == 'more') {
					more.more();
				} else {
					more.end(!0);
				}
			} else {
				more.notData();
			}
		} else {
			alert(res.message);
		}
		more.end();
	});
}, {notTxt: '暂无XX});
```

### 重置

```js
$('#J_list').data('loadmore').reset();
```

### 带callback方式重置

```js
$('#J_list').data('loadmore').reset(function() {
	$.getJSON();//...
});
```
