import * as types from '../mutation-types'
import Service from '../../utilities/services'

const state = {
  feeds: []
}

const mutations = {
  [types.SET_FEED] (state) {
    state.feeds = []
    Service.getState()
  }
}

export default {
  state,
  mutations
}
