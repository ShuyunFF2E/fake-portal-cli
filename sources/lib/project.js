
$ProjectProvider.$inject = ['$futureStateProvider'];
function $ProjectProvider($futureStateProvider) {

  /**
   * @param {String} html 项目入口 html 模板
   *
   * @typedef {Object} ProjectInfo
   * @prop {Array} scripts
   * @prop {String} template
   *
   * @returns {ProjectInfo}
   */
  function getProjectInfo(html) {
    var SCRIPT_TAG_REGEX = /<script\s+((?!type=('|")text\/ng-template('|")).)*>.*<\/script>/gi;
    var SCRIPT_SRC_REGEX = /.*\ssrc=("|')(\S+)\1.*/;
    var SCRIPT_SEQ_REGEX = /.*\sseq=("|')(\S+)\1.*/;
    var scripts = [];
    var template = html.replace(SCRIPT_TAG_REGEX, function(match) {
      var matchedScriptSeq = match.match(SCRIPT_SEQ_REGEX);
      var matchedScriptSrc = match.match(SCRIPT_SRC_REGEX);
      var seq = (matchedScriptSeq && matchedScriptSeq[2]) || 0;

      scripts[seq] = scripts[seq] || [];

      if (matchedScriptSrc && matchedScriptSrc[2]) {
        scripts[seq].push(matchedScriptSrc[2]);
      }

      return '<!-- script replaced -->';
    });

    return {
      scripts: scripts.filter(function(script) {return !!script}),
      template: template
    };
  }

  stateFactory.$inject = ['$q', '$http', '$ocLazyLoad', '$log', 'futureState'];
  function stateFactory($q, $http, $ocLazyLoad, $log, futureState) {

    var loadScripts = function(scripts) {
      var errorHandle = function(err) {
        $log.error(err);
        return $q.reject(err);
      };
      var promise = $ocLazyLoad.load(scripts.shift());
      var nextGroup;

      while (scripts.length) {
        nextGroup = scripts.shift();
        promise = promise.then(function() {
          return $ocLazyLoad.load(nextGroup);
        });
      }

      return promise.catch(errorHandle);
    };

    var deferred = $q.defer();

    $http.get(futureState.templateUrl).then(function(response) {
      if (response.status !== 200) {
        deferred.reject();
        return;
      }

      var projectInfo = getProjectInfo(response.data);

      var state = {
        name: futureState.name,
        url: futureState.url,
        template: projectInfo.template
      };

      if (projectInfo.scripts.length) {
        loadScripts(projectInfo.scripts).then(function() {
          deferred.resolve(state);
        });
      } else {
        deferred.resolve(state);
      }
    });

    return deferred.promise;
  }

  $futureStateProvider.stateFactory('project', stateFactory);

  this.state = function(name, definition) {
    $futureStateProvider.futureState({
      type: 'project',
      name: name,
      url: definition.url,
      templateUrl: definition.templateUrl
    });

    return this;
  };

  this.$get = function() {};
}

angular
  .module('ccms.projectRouter', [
    'ui.router',
    'ct.ui.router.extras',
    'oc.lazyLoad'
  ])
  .provider('$project', $ProjectProvider);
