// 缓存唯一标识
window.CACHE_KEY = '__FF2E__CACHE__';
const CACHE_TARGET = isLocal => {
	return isLocal ? window.localStorage : window.sessionStorage;
};

const modulesMap = {
	// 除了portal 可以对common 进行 set操作
	common: {
		name: '公共资源'
	},
	ndashboard: {
		name: '首页'
	},
	customerInsight: {
		name: '客户洞察'
	},
	customerGrouping: {
		name: '客户分群'
	},
	crowdMarketing: {
		name: '人群营销'
	},
	le: {
		name: '忠诚度3'
	},
	dataManager: {
		name: '数据管理'
	}
};

const getModule = (module, isLocal) => {
	return getCache(isLocal)[module] || {};
};

const getCache = isLocal => {
	const cacheSrc = CACHE_TARGET(isLocal).getItem(CACHE_KEY);
	if (!cacheSrc) {
		return {};
	}

	return JSON.parse(cacheSrc);
};

const setModule = (module, obj, isLocal) => {
	const cache = getCache(isLocal);
	cache[module] = obj;
	CACHE_TARGET(isLocal).setItem(CACHE_KEY, JSON.stringify(cache));
};

const clearCache = isLocal => {
	CACHE_TARGET(isLocal).clear();
};

window[CACHE_KEY] = {
	/**
	 * 获取指定模块的缓存
	 * @param module: 当前模块的路由
	 * @param isLocal: 是否为localStorage存储模式
	 * @returns {*}
	 */
	get(module, isLocal) {
		if (!this.__check(module, false)) {
			return {};
		}
		return getModule(module, isLocal);
	},

	/**
	 * 设置指定模块的缓存
	 * @param module: 当前模块的路由
	 * @param obj: 缓存对像
	 * @param isLocal: 是否为localStorage存储模式
	 * @returns {boolean}
	 */
	set(module, obj, isLocal) {
		if (!this.__check(module, true)) {
			return false;
		}
		setModule(module, obj, isLocal);
		return true;
	},

	/**
	 * 清除指定模块
	 * @param module: 当前模块的路由
	 * @param isLocal: 是否为localStorage存储模式
	 */
	clear(module, isLocal) {
		const cache = getCache();
		delete cache[module];
		CACHE_TARGET(isLocal).setItem(CACHE_KEY, JSON.stringify(cache));
	},

	/**
	 * 验证当前模块是否允许操作[内部方法]
	 * @param module
	 * @param isSet: 是否为set操作
	 * @returns {boolean}
	 * @private
	 */
	__check(module, isSet) {
		const hash = window.location.hash;
		const moduleInfo = modulesMap[module];
		if (!moduleInfo) {
			console.error('当前模块未注册缓存服务, 请联系portal');
			return;
		}

		const route = hash.split('/')[1];
		if (module !== route || (module === 'common' && isSet)) {
			console.error(`在${route}模块中不允许操作${module}模块的缓存`);
			return;
		}
		return true;
	}
};
