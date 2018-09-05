var defaults = {
	scroll: !0,
	more: null,
	threshold: 50,
	moreTxt: '上拉继续加载',
	loadTxt: '努力加载中...',
	endTxt: '亲，已经到底了！',
};
function Loadmore (element, options, callback) {
	if (!callback) {
		$(window).off('scroll.more');
		return !1;
	}
	this.options = $.extend( {}, defaults, options);
	this.element = typeof element == 'string' ? $(element) : element;

	if (!this.options.more) {
		this.options.more = $('<p class="p10 tac cp"></p>').insertAfter(this.element);
	}

	if (!this.options.scroll && this.options.moreTxt == defaults.moreTxt) {
		this.options.moreTxt = '点击加载更多';
	}
	this.callback = callback;
	this.runtime = { page: 1, isEnd: !1, isLoad: !0 };
	this.init();
}

Loadmore.prototype = {
	init: function() {
		var _this = this;
		this.options.more.off('click.more').on('click.more', function(e) {
			e.preventDefault();
			if(_this.runtime.isEnd == !0 || _this.runtime.isLoad == !0) {
				return !1;
			}
			_this.runtime.page++;
			_this.runtime.isLoad = !0;
			setTimeout(function() {
				_this.runtime.isLoad = !1;
			}, 3000);
			_this.loadTip();
			_this.callback(_this, 'next', _this.runtime.page);
		});

		if (this.options.scroll) {
			this.scroll();
		}

		this.callback(this, 'first', 1);
	},
	scroll: function() {
		var _this = this;
		$(window).on('scroll.more', function() {
			if(_this.runtime.isEnd == !0 || _this.runtime.isLoad == !0) {
				return !1;
			}
			var h0 = document.documentElement.scrollHeight;
			var h1 = document.documentElement.clientHeight;

			if ((h0 - h1 - $(this).scrollTop()) < _this.options.threshold) {
				if (!_this.runtime.isLoad && !!_this.callback) {
					_this.runtime.isLoad = !0;
					setTimeout(function() {
						_this.runtime.isLoad = !1;
					}, 3000);
					if (_this.options.more.length) {
						_this.runtime.page++;
						_this.loadTip();
						_this.callback(_this, 'next',  _this.runtime.page);
					}
				}
			}
		});
	},
	more: function() {
		this.options.more.html(this.options.moreTxt).show();
	},
	loadTip: function() {
		this.options.more.html('<i class="icon-spinner icon-spin-anim mr5"></i>' + this.options.loadTxt).show();
	},
	rest: function() {
		this.runtime.isEnd = !1;
		this.runtime.isLoad = !0;
		this.runtime.page = 1;
		this.callback(this, 'first', 1);
	},
	end: function(isOver) {
		this.runtime.isLoad = !1;
		if (isOver) {
			this.options.more.html(this.options.endTxt);
			this.runtime.isEnd = !0;
		}
	}
}

$.fn.loadmore = function(callback, options) {
	return this.each(function() {
		if (!$.data(this, 'loadmore')) {
			var instance = new Loadmore(this, options, callback);
			$.data(this, 'loadmore', instance);
		}
	});
}
