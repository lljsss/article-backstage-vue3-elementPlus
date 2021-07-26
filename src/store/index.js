import { createStore } from 'vuex'
import { getUserProfile } from "../api/user";
export default createStore({
  state: {
    user: {

    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      console.log(state.user);
    }
  },
  actions: {
    getUser({commit}) {
      getUserProfile().then(res => {
        commit('setUser', res.data)
      })
    }
  },
  modules: {
  }
})
