function Pagination (domId, callback) {
    this.totalPage = 0;     //总页数
    this.startPage = 0;     //开始显示页
    this.endPage = 0;       //结束显示页
    this.curPage = 0;       //当前页
    this.pageRange = 2;     //当前页码两侧显示的页码个数
    this.even = false;      //在页码数足够的情况下，是否显示偶数个页码
    this.domId = domId;     //分页容器id
    this.callback = callback;   //点击页码时的回调函数

    this.init();
};
Pagination.prototype = {
    // 初始化
    init: function () {
        this.addEvent();
    },
    // 设置页码
    setPage: function (option) {
        this.totalPage = option.totalPage || this.totalPage;
        this.curPage = option.curPage || this.curPage;      //当前页数
        this.pageRange = option.pageRange || this.pageRange;        //当前页码两侧显示的页码个数
        this.even = option.even || this.even;       //在页码数足够的情况下，是否显示偶数个页码
        if (this.totalPage > 0) {
            this.renderPage();
        }
    },
    // 显示页码
    renderPage: function () {
        var i, str = '';
        if (this.curPage - this.pageRange < 1) {
            this.startPage = 1;
            this.endPage = this.even ? this.startPage + this.pageRange * 2 - 1 : this.startPage + this.pageRange * 2;
            this.endPage = this.endPage > this.totalPage ? this.totalPage : this.endPage;
        } else if (this.curPage + this.pageRange > this.totalPage){
            this.endPage = this.totalPage;
            this.startPage = this.even ? this.endPage - (this.pageRange * 2) + 1 : this.endPage - (this.pageRange * 2);
            this.startPage = this.endPage < 1 ? 1 : this.startPage;
        } else {
            this.startPage = this.even ? this.curPage - this.pageRange + 1 : this.curPage - this.pageRange;
            this.endPage = this.curPage + this.pageRange;
        }
        str += '<a href="javascript:void(0);" class="last '+ (this.curPage == 1 ? 'disabled' : '') +'"></a>';
        for (i = this.startPage; i <= this.endPage; i++) {
            str += '<a href="javascript:void(0);" class="page-num '+(this.curPage == i ? 'active' : '')+'" >'+i+'</a>';
        }
        str += '<a href="javascript:void(0);" class="next '+ (this.curPage == this.totalPage ? 'disabled' : '') +'"></a>';
        str += '<p class="skip-tip">跳转到:</p><input type="text" class="jump-num" onkeyup="value=value.replace(/[^/0-9]/g,\'\') ">'+
            '<input type="button" class="skip-to-page" name="确定" value="确定">';
        $('#' + this.domId).html(str);
    },
    // 添加事件
    addEvent: function () {
        var _this = this;
        // 上一页
        $("#" + _this.domId).on("click", ".last", function () {
            if (_this.curPage > 1 && _this.totalPage > 0) {
                _this.curPage -= 1;
                _this.renderPage();
                _this.callback(_this.curPage, _this.totalPage);
            }
        });
        // 下一页
        $("#" + _this.domId).on("click", ".next", function () {
            if (_this.curPage < _this.totalPage && _this.totalPage > 0) {
                _this.curPage += 1;
                _this.renderPage();
                _this.callback(_this.curPage, _this.totalPage);
            }
        });
        // 点击页码
        $("#" + _this.domId).on("click", ".page-num", function () {
            _this.curPage = parseInt($(this).html());
            _this.renderPage();
            _this.callback(_this.curPage, _this.totalPage);
        });
        // 跳转到指定页
        $("#" + _this.domId).on("click", ".skip-to-page", function () {
            var skipNum = parseInt($(this).siblings(".jump-num").val());
            if (skipNum >= 1 && skipNum <= _this.totalPage) {
                _this.curPage = skipNum;
                _this.renderPage();
                _this.callback(_this.curPage, _this.totalPage);
            }
        });
    }
}