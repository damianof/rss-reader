import * as types from '../mutation-types'

const state = {
  offline: false
}

const mutations = {
  [types.APP_STATUS] (state, data) {
    state.offline = data
  }
}

export default {
  state,
  mutations
}
