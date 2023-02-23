import * as types from './mutation-types'

const mutations = {

  [types.SET_SYSLOG_SERVERS] (state, items) {
    state.syslogServers = items
  }

}

export default mutations
