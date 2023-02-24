export const state = () => ({
  pageScrolled: false,
})

export const mutations = {
  SET_PAGE_SCROLLED(state, value) {
    state.pageScrolled = value
  },
}

export const getters = {
  hasPageScrolled(state) {
    return state.pageScrolled
  },
}
