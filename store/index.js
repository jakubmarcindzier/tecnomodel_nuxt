export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
  getUserInfo(state) {
    return state.auth.user
  },
}

export const state = () => ({
  device: {},
})

export const mutations = {
  setDevice(state, value) {
    state.device = value
  },
}
