import * as types from './mutation-types'

export const setFeed = ({ commit }) => {
  commit(types.SET_FEED)
}

export const setStatus = ({ commit }, data) => {
  commit(types.APP_STATUS, data)
}
