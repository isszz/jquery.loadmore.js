/*! jquery.loadmore@0.8 | https://github.com/isszz/jquery.loadmore.js */
define(function (require, exports, module) {

	var defaults = {
		scroll: !0,
		more: null,
		threshold: 50,
		moreTxt: '上拉继续加载',
		loadTxt: '努力加载中...',
		endTxt: '亲，已经到底了！',
		notTxt: '暂无数据',
		notTpl: '<div class="not-data"><i class="icon-data-sad"></i>{notTxt}</div>',
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
		this.runtime = { type: 'first', page: 1, isEnd: !1, isLoad: !0, isLock: !1 };

		this.init();
	}

	Loadmore.prototype = {
		/**
		 * 初始化, 点击加载更多
		 */
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
                _this.next();
			});

			if (this.options.scroll) {
				this.scroll();
			}
			this.first();
		},
		/**
		 * 滚动加载
		 */
		scroll: function() {
			var _this = this;
			$(window).on('scroll.more', function() {
				if ($('body').hasClass('J_hide_scroll')) {
					return !1;
				}
				if(_this.runtime.isEnd == !0 || _this.runtime.isLoad == !0 || _this.runtime.lock == !0) {
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
			            	_this.next();
			            }
			        }
			    }
			});
		},
		/**
		 * 首次加载
		 */
		first: function() {
			this.showLoad();
			this.runtime.type = 'first';
			this.callback(this, 1);
		},
		/**
		 * 加载下一页
		 */
		next: function() {
			this.showLoad();
			this.runtime.type = 'next';
			this.callback(this, this.runtime.page);
		},
		/**
		 * 重载
		 */
		reload: function() {
			this.showLoad();
			this.runtime.type = 'reload';
			this.callback(this, this.runtime.page);
		},
		/**
		 * 渲染列表
		 */
		render: function(template, callback) {
			var res;
			if (this.runtime.type == 'first') {
				res = $(this.element).html(template);
			} else {
				res = $(this.element).append(template);
			}
			var _this = this;
			setTimeout(function() {
				callback && callback(res, _this.runtime.type);
			}, 0);
		},
		/**
		 * 重启
		 */
		reset: function(callback) {
			callback = callback || null;
			this.runtime.page = 1;
			this.runtime.isEnd = !1;
			this.runtime.isLoad = !0;
			this.runtime.type = 'first';
			$(this.element).html('');
			if (callback) {
				callback(this);
				return !1;
			}
			this.callback(this, 1);
		},
		/**
		 * 加载完毕
		 */
		end: function(isOver, endTxt) {
			this.runtime.isLoad = !1;
			if (isOver) {
				this.runtime.isEnd = !0;
				if (endTxt === !1 || endTxt === null) {
					this.options.more.hide();
					return !1;
				}
				var newMore = $('<div class="more-end"><span>' + (endTxt || this.options.endTxt) + '</span></div>');
				this.options.more.replaceWith(newMore);
				this.options.more = newMore;
			}
		},
		/**
		 * 更多ui
		 */
		more: function() {
			this.options.more.html(this.options.moreTxt).show();
		},
		/**
		 * 加载ui
		 */
		showLoad: function() {
			if (this.runtime.type == 'first') {
				return !1;
			}
			this.options.more.html('<i class="icon-spinner icon-spin-anim mr5"></i>' + this.options.loadTxt).show();
		},
		/**
		 * 无数据ui
		 */
		notData: function(notTxt) {
			this.runtime.isLoad = !1;
			this.runtime.isEnd = !0;
			this.runtime.page = 1;
			var tips = notTxt || this.options.notTxt;
			if (this.options.notTpl) {
				if (this.options.notTpl.indexOf('{notTxt}') == -1) {
					tips = this.options.notTpl;
				} else {
					tips = this.options.notTpl.replace('{notTxt}', tips);
				}
			}
			this.options.more.hide();
			$(this.element).html(tips);
		},
		lock: function() {
			this.runtime.lock = !0;
		},
		unLock: function() {
			this.runtime.lock = !1;
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
});
