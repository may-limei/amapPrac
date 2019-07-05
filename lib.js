/**
 * 项目全局库管理
 */
import * as lib from '@/common/lib/index'
import flexible from '@/common/lib/Flexible'
import SQLite from '@/common/lib/sqlite'
import native from '@/common/lib/native'
import request from '@/common/lib/request'
import config from '@/config/index'
import cubeModule from '@/CubeModule.json'
import axios from 'axios'
import service from '@/service.js'
import Vue from 'vue'
import FastClick from 'fastclick'
import mxLoading from '@/components/mx-loading/index' // 加载组件引入
import mxIcon from '@/components/mx-icon/index' // 字体图标组件引入
import { Dialog, Toast, Collapse, CollapseItem, TreeSelect, Button, Row, Col, RadioGroup, Radio } from 'vant' // 弹框组件引入

// 全局注入加载、弹框、字体组件
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(mxLoading)
Vue.use(Collapse).use(CollapseItem)
Vue.use(TreeSelect)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.component('mx-icon', mxIcon)
// Toast.allowMultiple() // 设置为允许多个toast一起展示
Toast.setDefaultOptions({
  loadingType: 'spinner', // 默认为circular
  position: 'middle',
  duration: 3000 // 默认时长为3秒
})
/**
 * 给vue添加prototype属性
 */
Vue.prototype.$cubeModule = cubeModule
Vue.prototype.$nativeApi = native
Vue.prototype.$config = config
Vue.prototype.$service = service
Vue.prototype.$request = request
Vue.prototype.axios = axios // 将第三方axios的服务注入进来
Vue.prototype.$sqlite = SQLite
Vue.prototype.$tools = {}
// 将lib的内容，合并在 $tools
Object.values(lib).forEach(fnObj => {
  Object.assign(Vue.prototype.$tools, fnObj)
})

/**
 * 引入flexible插件
 */
Vue.use(flexible)
FastClick.attach(document.body)

// 重写ios的fastclick focus事件，解决11.3的快速点击输入框不聚焦的问题
FastClick.prototype.focus = targetElement => {
  var length
  // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (
    native.getPlatForm() === 1 &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month'
  ) {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}
