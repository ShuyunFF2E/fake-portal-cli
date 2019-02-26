(function(fakeConf){
    angular.module('ccms', ['ccms.components', 'ccms.business.components', 'ccms.projectRouter', 'ccms.customerView', 'gridManager'])
	.config(function ($urlRouterProvider, $httpProvider, $projectProvider) {
		$httpProvider.interceptors.push(['$window', '$q', function ($window, $q) {
			return {
				'request': function (config) {
					if (/.html|.css|.js$/.test(config.url)) {
						return config;
					}
					try{
						const ccmsRequestCredential = angular.fromJson($window.localStorage.getItem('ccmsRequestCredential'));
						config.headers['X-TOKEN'] = ccmsRequestCredential.id;
					} catch (e){
						console.error('X-TOKEN 获取异常， 请点击右上角的更新Token');
					}
					return config;
				},
				'response': function (response) {
					return response;
				},
				'responseError': function (rejection) {
					if (rejection.status === 403) {
						console.error('对不起, 您没有权限, 请联系管理员!');
					}

					if (rejection.status === 500) {
						console.error('服务器端出错了 /(ㄒoㄒ)/~~');
					}

					return $q.reject(rejection);
				}
			}
		}]);

		// router: update token
		$projectProvider.state('credential', {
			url: '/credential',
			templateUrl: '/fake-portal/lib/credential.tpl.html'
		});

		// router: iframe
		fakeConf.isIframe && $projectProvider.state(fakeConf.module, {
			url: `/${fakeConf.module}`,
			templateUrl: '/fake-portal/lib/iframe.tpl.html'
		});

		// router: not iframe
		!fakeConf.isIframe && $projectProvider.state(fakeConf.module, {
			url: `/${fakeConf.module}`,
			templateUrl: fakeConf.url
		});

		// default open
		$urlRouterProvider.otherwise(`/${fakeConf.module}`);

	}, ['$urlRouterProvider', '$httpProvider', '$projectProvider',])

	// fakePortalCtrl
	.controller('fakePortalCtrl', function($scope, $http){
		$scope.title = fakeConf.name;

		// 是否为iframe模式
		$scope.isIframe = fakeConf.isIframe;

		// 模块 ui-sref
		$scope.uiSref = fakeConf.module;

		if ($scope.isIframe) {
			$scope.iframeUrl = fakeConf.url;
		}

		// 默认值
		$scope.defaultCredential = `{"id":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6InFpdXNoaTYiLCJ1c2VySWQiOjEwMDExNDA4LCJ1c2VyVHlwZSI6ImJ1aWxkLWluIiwidXNlck5hbWUiOiJjYyIsImV4dCI6MTUzOTcyNzc3NDg3OSwiaWF0IjoxNTM5Njg0NTc0ODc5fQ.DtwXogmCG2fyoRLTb4qJpQ5cAruGDZwiRlAewystFr0","userId":10011408,"username":"cc","sign":"149529a57173fe7bf2f42fa893b339b8","authenticatedTime":"2018-10-16T18:09:34.877+0800","expireTime":"2018-10-17T06:09:34.877+0800","tenantId":"qiushi6","host":"","remark":null,"refreshToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6InFpdXNoaTYiLCJ1c2VySWQiOjEwMDExNDA4LCJ1c2VyVHlwZSI6ImJ1aWxkLWluIiwidXNlck5hbWUiOiJjYyIsImV4dCI6MTUzOTcyNzc3NDg4MSwiaWF0IjoxNTM5Njg0NTc0ODc3fQ.w3LOGAgKk0ijAUZcbcMr-qBddtdj3crc6P6XOLA8uH8","verifyCode":"","mobile":"","redirectURL":"https%3A%2F%2Fqa-qiushi6-ccms.shuyun.com%2Fportal%2FtbLogin.html","appName":"数据赢家","ati":"4844090445468","token":"","authType":"page","expired":false}`;

		// 清空值
		$scope.credential = '';

        // 保存token
        $scope.saveCcmsRequestCredential = function (){
            window.localStorage.setItem('ccmsRequestCredential', this.credential);
            window.location.hash = `#/${$scope.uiSref}`;
        };

        // 重置token为默认值
        $scope.resetCcmsRequestCredential = function (){
            this.credential = $scope.defaultCredential;
        };

        // 在控制台解析
        $scope.parseCcmsRequestCredential = function(){
            let ccmsRequestCredential = null;
            try {
                ccmsRequestCredential = angular.fromJson(this.credential);
            } catch (e) {
                console.warn('鉴权信息无效');
                return;
            }

			// 校验鉴权
			if (!angular.isObject(ccmsRequestCredential)) {
				console.warn('鉴权信息无效');
				return;
			}
			console.group('%c根据你输入的鉴权信息，解析如下:', 'color:#f90');
			for (let key in ccmsRequestCredential) {
				console.log(`%c${key}:`, 'color:#f90', ccmsRequestCredential[key]);
			}
			console.groupEnd();
		};

        // 填充localStorage
        function setFackPortalLocalStorage() {
            // TB_CCMS_COMPONENTS_AREA_SELECTOR_DATA: 淘宝地址信息
            $http.get('./lib/areas-tb.json').then(res => {
                window.localStorage.setItem('TB_CCMS_COMPONENTS_AREA_SELECTOR_DATA', JSON.stringify(res.data));
            });

            // JD_CCMS_COMPONENTS_AREA_SELECTOR_DATA: 京东地址信息
            $http.get('./lib/areas-jd.json').then(res => {
                window.localStorage.setItem('JD_CCMS_COMPONENTS_AREA_SELECTOR_DATA', JSON.stringify(res.data));
            });

            // UNIFICATION_CCMS_COMPONENTS_AREA_SELECTOR_DATA: 全渠道地址信息
            $http.get('./lib/areas-unification.json').then(res => {
                window.localStorage.setItem('UNIFICATION_CCMS_COMPONENTS_AREA_SELECTOR_DATA', JSON.stringify(res.data));
            });

            // UNIFIFCATION_AREA_SELECTOR_DATA: 四层地址信息
            $http.get('./lib/areas-level-4.json').then(res => {
                window.localStorage.setItem('UNIFIFCATION_AREA_SELECTOR_DATA', JSON.stringify(res.data));
            });
        }
        setFackPortalLocalStorage();
	});
})(window.fakeConf);
