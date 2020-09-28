// babel7会根据代码情况去按需引入代码。
// babel-env和vue-router加dynamic import搭配，
// 初始项目中，看编译出来的代码中不会引入array.iterator的模块。（有同学的项目是一模一样的老配置却是好的，因为他那已经是一个完整的项目，不免有涉及es6.array.iterator的显示代码）
// 社区中也有很多遇到这问题的，即使连vue-cli也用了babel插件的方法来修复这个问题，
// 所以，在这手动引入。
// 资料：
// https://github.com/vuejs/vue-cli/commit/bda6dea705e2756aa21180b8d58cbae968f60a1d
// https://github.com/babel/babel/issues/9872
import 'core-js/modules/es.array.iterator.js'

import 'common/scss/index'
import Vue from 'vue'
import './plugins'
import './componentsBase'
import './components'
import router from './router'
import App from './app'
import 'filters'
import 'directives'
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  render: createElement => createElement(App)
})