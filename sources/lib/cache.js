// 缓存唯一标识
window.CACHE_KEY = '__FF2E__CACHE__';
const CACHE_TARGET = isLocal => {
    return isLocal ? window.localStorage : window.sessionStorage;
};
// 平台所需常量: 用于各模块
const PLAT_KEY_LIST = ['TAOBAO', 'JOS', 'YHD', 'SUNING', 'MGJ', 'YOUZAN', 'OFFLINE', 'DD', 'WX', 'DOUYIN', 'OMNI'];
const PLAT_CODE_LIST = ['taobao', 'jos', 'yhd', 'suning', 'mogujie', 'youzan', 'offline', 'dangdang', 'weixin', 'douyin', 'omni'];
const PLAT_NAME_LIST = ['淘宝', '京东', '一号店', '苏宁', '蘑菇街', '有赞', '线下', '当当', '微信', '抖音', '全渠道'];
const PLAT_MAP = {
	key: PLAT_KEY_LIST,
	code: PLAT_CODE_LIST,
	name: PLAT_NAME_LIST
};
const modulesMap = {
	// 只有portal 可以对 PORTAL_CACHE_KEY项 进行 set操作
	common: {
		name: '公共资源'
	},
	home: {
		name: '首页 2.0'
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
	ebm: {
		name: '事件关怀'
	},
	benefit: {
		name: '权益管理'
	},
	le: {
		name: '忠诚度3'
	},
	dataManager: {
		name: '数据管理'
	},
	wxcrm: {
		name: '微信CRM'
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

/**
 * 验证当前模块是否允许操作[内部方法]
 * @param module
 * @returns {boolean}
 * @private
 */
const checkModule = module => {
    const moduleInfo = modulesMap[module];
    if (!moduleInfo) {
        console.error('当前模块未注册缓存服务, 请联系portal');
        return;
    }

    return true;
};

window[CACHE_KEY] = {
    // 获取服务器时间: 开发环境下本地即是服务器
    getNowDate() {
        return new Promise(resolve => {
            resolve(new Date());
        });
    },

	/**
	 * 获取token信息
	 * @returns {*}
	 */
	getToken() {
		const data = localStorage.getItem('ccmsRequestCredential');
		let token;
		if (data) {
			token = JSON.parse(data).id;
		}
		return token;
	},

	/**
	 * 将url转换为二维码
	 * @param url
	 * @returns {Promise<*>}
	 */
	toQRCode(url) {
		console.warn('toQRCode 在本地环境下调用的是qa-qiushi6租户的接口');
		return fetch(`https://qa-qiushi6-ccms.shuyun.com/qr-code?url=${url}`).then(res => res.json());
	},

	/**
	 * 获取平台信息
	 * @param key
	 * @param value: 字符串或数组，当为数组时返回嵌套map
	 * @returns {{}}
	 */
	getPlatMap(key, value) {
		const keyList = PLAT_MAP[key];
		const map = {};
		// value 非数组
		if (!Array.isArray(value)) {
			const valueList = PLAT_MAP[value];
			keyList.forEach((item, index) => {
				map[item] = valueList[index];
			});
			return map;
		}

		// value 为数组
		keyList.forEach((item, index) => {
			const o = {};
			value.forEach(val => {
				o[val] = PLAT_MAP[val][index];
			});
			map[item] = o;
		});
		return map;
	},

	/**
	 * 获取地址数据
	 * @param platform: top, unification, jos
	 * @returns {Promise<unknown>}
	 */
	getAreaData(platform) {
		// 目前数据未放至统一的位置: 还有其它地方在直接调用原先的存储，等全部替换为该方法后再更新存储位置
		const itemKey = {
			top: 'TB_CCMS_COMPONENTS_AREA_SELECTOR_DATA',
			unification: 'UNIFICATION_CCMS_COMPONENTS_AREA_SELECTOR_DATA',
			jos: 'JD_CCMS_COMPONENTS_AREA_SELECTOR_DATA'
		}[platform];
		const data = localStorage.getItem(itemKey);
		return new Promise(resolve => {
			resolve(JSON.parse(data));
		});
	},

    /**
     * 获取指定模块的缓存
     * @param module: 当前模块的路由
     * @param isLocal: 是否为localStorage存储模式
     * @returns {*}
     */
    get(module, isLocal) {
        if (!checkModule(module)) {
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
        if (!checkModule(module)) {
            return false;
        }
        setModule(module, obj, isLocal);
        return true;
    },

    /**
     * 合并模块数据
     * @param module
     * @param obj
     * @param isLocal
     */
    merge(module, obj, isLocal) {
        const moduleObj = this.get(module, isLocal);
        return this.set(module, Object.assign(moduleObj, obj), isLocal);
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
    }
};
