export const searchMixin = {
  data() {
    return {
      search: '',
    }
  },
  watch: {
    '$route.params.search'(search) {
      this.search = search
    },
  },
  computed: {
    searchRule() {
      return this.search && this.search.length >= 3
    },
  },
  mounted() {
    this.search = this.$route.params.search
  },
  methods: {
    enterKeyListener(e) {
      if (e.keyCode === 13 && this.searchRule) {
        this.onSearch()
      }
    },
    onSearch() {
      this.$router.push('/s?search=' + this.search.toString())
    },
  },
}
