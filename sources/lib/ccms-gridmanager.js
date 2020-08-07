const ajaxPageTemplate = `<div class="gm-toolbar" grid-manager-toolbar="{{vm.gridManagerName}}">
    <span class="totals-count">
        共<span totals-number-info></span>条
    </span>
    <span class="refresh-action">
        <i class="gm-icon gm-icon-refresh"></i><span class="refresh-label">刷新</span>
    </span>
    <div class="change-size">
        {{ vm.pageSizeOptionTpl }}
    </div>

    <div class="toolbar-info checked-info"></div>
    <div class="pagination">
        <ul pagination-before>
            <li class="first-page">
                <svg class="gm-first-page"><symbol id="icon-lastpage" viewBox="0 0 1024 1024"><path d="M173.067 884.736v-753.664l580.71 376.831-580.71 376.831zM850.954 777.114h-104.243v-538.318h104.243v538.318z"  ></path></symbol><use xlink:href="#icon-lastpage"></use></svg>
            </li>
            <li class="previous-page">
                <svg class="gm-previous-page"><symbol id="icon-nextpage" viewBox="0 0 1024 1024"><path d="M206.864 85.579l659.438 428.751-659.438 428.751v-857.502z"></path></symbol><use xlink:href="#icon-nextpage"></use></svg>
            </li>
        </ul>

        <div class="goto-page">
            <input type="text" class="gp-input" current-page-info/>/共<span totals-page-info></span>页
        </div>
        <ul pagination-after>
            <li class="next-page">
                <svg class="gm-next-page"><symbol id="icon-nextpage" viewBox="0 0 1024 1024"><path d="M206.864 85.579l659.438 428.751-659.438 428.751v-857.502z"></path></symbol><use xlink:href="#icon-nextpage"></use></svg>
            </li>
            <li class="last-page">
                <svg class="gm-last-page"><symbol id="icon-lastpage" viewBox="0 0 1024 1024"><path d="M173.067 884.736v-753.664l580.71 376.831-580.71 376.831zM850.954 777.114h-104.243v-538.318h104.243v538.318z"  ></path></symbol><use xlink:href="#icon-lastpage"></use></svg>
            </li>
        </ul>
    </div>
</div>
`;

function setGridManagerDefault(angularGridManager, ReactGridManager) {
	const defaultOption = {
		// 默认不支持右键菜单
		supportMenu: false,

		// 默认请求参数当页字段
		currentPageKey: 'pageNum',

		// 默认请求参数当页显示数据条数
		pageSizeKey: 'pageSize',

		// 默认不支持自动产生序号
		supportAutoOrder: false,

		// 默认不支持使用复选框选中
		supportCheckbox: false,

		// 默认支持分页
		supportAjaxPage: true,

		// 默认使用表头相关按钮跟随表头文字
		isIconFollowText: true,

		// 默认不支持列宽度调整
		supportAdjust: true,

		// 默认不支持列分割线显示
		disableLine: true,

		// 数据使用后端返回的list数组
		dataKey: 'list',

		// 切换页码
		sizeData: [10, 20, 30, 50]
	};

	// angular
	angularGridManager.defaultOption = {
		width: '100%',
		height: '100%',
		...defaultOption,
		// 页样式名称
		skinClassName: 'ccms-skin',

		// 列配置提示信息
		configInfo: '自定义字段可在列表拖拽调整排序',
		emptyTemplate: '<div class="gm-empty-content init-msg"><span class="iconfont icon-caution warning"></span><span class="msg">暂无数据</span></div>',
		ajaxPageTemplate: ajaxPageTemplate
	};

	// react
	ReactGridManager.mergeDefaultOption(defaultOption);
}
setGridManagerDefault(window.GridManager, window.CloudReact.Table);
