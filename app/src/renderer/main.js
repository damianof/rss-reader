import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'
import Vuetify from 'vuetify'

import App from './App'
import routes from './routes'

import { remote } from 'electron'
import jetpack from 'fs-jetpack'
import fs from 'fs'

Vue.use(Electron)
Vue.use(Router)
Vue.use(Vuetify)
Vue.config.debug = true

const useDataDir = jetpack.cwd(remote.app.getAppPath()).cwd(remote.app.getPath('userData'))

const dirYes = jetpack.exists(useDataDir.path('articleData'))
const dirFav = jetpack.exists(useDataDir.path('favicons'))

if (!dirYes) {
  fs.mkdir(useDataDir.path('articleData'))
}

if (!dirFav) {
  fs.mkdir(useDataDir.path('favicons'))
}

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
