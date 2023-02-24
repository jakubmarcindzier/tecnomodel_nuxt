<template>
  <section class="pt-4 px-4">
    <b-container fluid>
      <breadcrumb
        :category-id="categoryId"
        :add-active-link="brandName"
        :custom-items="breadcrumb"
        @categoryList="setCategoryList"
      ></breadcrumb>
      <b-row>
        <b-col lg="3" class="d-lg-block d-none mb-4">
          <div class="sticky-top sticky-offset" style="z-index: 900">
            <category-navigator
              v-if="categoryId"
              :category-id="categoryId"
              class="mb-3"
            />
            <brand-navigator
              v-if="categoryId || search || filter"
              :brand-id="brandId"
              :category-id="categoryId"
              :search="search"
              :filter="filter"
              @brandName="setBrandName"
            />
          </div>
        </b-col>
        <b-col lg="9">
          <div class="container-fluid d-lg-block d-none">
            <b-row class="mb-3 bg-white border rounded">
              <b-col lg="7" class="align-items-center d-lg-flex d-none">
                <small class="text-muted">
                  {{ itemNumber }} {{ $tc('result', itemNumber) }}
                  {{ search ? $t('for') : '' }}
                  <span v-if="search" class="main-color"
                    >"{{ search }}"</span
                  ></small
                >
              </b-col>
              <b-col
                lg="5"
                class="justify-content-end align-items-center d-lg-flex d-none"
              >
                <b-button
                  class="pr-0"
                  variant="link"
                  @click="toggleTypeItemShow('grid')"
                >
                  <font-awesome-icon
                    icon="th"
                    :class="{
                      'text-muted': typeItemShow === 'list',
                      'main-color': typeItemShow === 'grid',
                    }"
                  />
                </b-button>
                <b-button
                  class="pr-0"
                  variant="link"
                  @click="toggleTypeItemShow('list')"
                >
                  <font-awesome-icon
                    icon="list"
                    :class="{
                      'text-muted': typeItemShow === 'grid',
                      'main-color': typeItemShow === 'list',
                    }"
                  />
                </b-button>
              </b-col>
            </b-row>
          </div>
          <template v-if="typeItemShow === 'list'">
            <div v-for="(item, key) in itemList" :key="key">
              <product
                :type="typeItemShow"
                :item-id="item.itemId"
                :sell-price="item.sellPrice"
                :list-price="item.listPrice"
                :availability="item.availability"
                :discount="item.discount"
                :brand="item.brand"
                :code="item.code"
                :name="item.name"
                :description="item.description"
                :image-path="item.thumbImagePath"
                :logo-path="item.brandLogoImagePath"
                :discount-thru-date="item.discountThruDate"
              />
            </div>
          </template>
          <template v-if="typeItemShow === 'grid'">
            <b-row v-for="(row, id) in itemGrid" :key="id">
              <b-col v-for="(item, key) in row" :key="key">
                <product
                  v-if="item"
                  :type="typeItemShow"
                  :item-id="item.itemId"
                  :sell-price="item.sellPrice"
                  :list-price="item.listPrice"
                  :availability="item.availability"
                  :discount="item.discount"
                  :brand="item.brand"
                  :code="item.code"
                  :name="item.name"
                  :description="item.description"
                  :image-path="item.thumbImagePath"
                  :logo-path="item.brandLogoImagePath"
                  :discount-thru-date="item.discountThruDate"
                />
              </b-col>
            </b-row>
          </template>
          <client-only>
            <infinite-loading
              ref="InfiniteLoading"
              spinner="spiral"
              @infinite="getItemListInfiniteLoading"
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </client-only>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import getItemEndpoint from '~/utils/getItemEndpoint'
import { urlMixin } from '~/mixins/urlMixin'

export default {
  name: 'BrowsePage',
  components: {
    CategoryNavigator: () => import('@/components/CategoryNavigator'),
    InfiniteLoading: () => import('vue-infinite-loading'),
  },
  mixins: [urlMixin],
  asyncData({ $axios, params, query, error }) {
    return $axios
      .get(getItemEndpoint(params, query))
      .then((response) => {
        return {
          itemList: response.data.item,
          pageCurrent: response.data.page.current,
          pageTotal: response.data.page.total,
          itemNumber: response.data.itemNumber,
        }
      })
      .catch(() => {
        error({ statusCode: 404, message: 'Not found' })
      })
  },
  data() {
    return {
      brandId: this.$route.query.id,
      search: this.$route.query.search,
      filter: this.$route.params.filter,
      typeItemShow: 'list',
      itemList: [],
      pageCurrent: null,
      pageTotal: null,
      itemNumber: null,
      brandName: this.$route.query.brand,
      categoryList: null,
      breadcrumb: [],
    }
  },
  head() {
    return {
      title: this.title,
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Acquista articoli ' + this.title,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.getUrl(),
        },
      ],
    }
  },
  computed: {
    itemGrid() {
      const rows = []
      const itemsPerRow = 4
      const arr = this.itemList
      for (let i = 0; i < arr.length; i += itemsPerRow) {
        const row = []
        for (let z = 0; z < itemsPerRow; z++) {
          row.push(arr[i + z])
        }
        rows.push(row)
      }
      return rows
    },
    title() {
      let result = ''
      if (this.search) result = 'Ricerca ' + this.search + ' '
      if (this.filter) result = this.filterName + ' '
      if (this.categoryList && this.categoryId) {
        let categoryPath = ''
        this.categoryList.forEach(function (element) {
          categoryPath += element.name + ' > '
        })
        result = categoryPath
      }
      if (this.brandId) result += this.brandName
      if (this.categoryId && !this.brandId)
        result = result.substring(0, result.length - 3)
      return result
    },
    filterName() {
      if (Object.keys(this.$t('filter')).includes(this.filter))
        return this.$t('filter.' + this.filter)
      return ''
    },
    categoryId() {
      const result = this.$route.path.split('/')
      return result[1] === 'b' ? result[result.length - 1] : null
    },
  },
  watch: {
    categoryId(value) {
      this.categoryId = value
      this.resetItemList()
    },
    brandId(value) {
      if (!value) this.brandName = null
    },
    filter(value) {
      this.filter = value
      this.resetItemList()
      this.setFilterBreadcrumb()
    },
  },
  watchQuery(value, oldValue) {
    if (value.search && oldValue.search) {
      this.search = value.search
      this.resetItemList()
      this.setSearchBreadcrumb()
    }
    if (value.id && oldValue.id) {
      this.brandId = value.id
      this.resetItemList()
      if (this.search) this.setSearchBreadcrumb()
      if (this.filter) this.setFilterBreadcrumb()
    }
  },
  mounted() {
    if (this.search) this.setSearchBreadcrumb()
    if (this.filter) this.setFilterBreadcrumb()
  },
  methods: {
    getItemListInfiniteLoading($state) {
      if (this.pageCurrent && this.pageCurrent === this.pageTotal)
        $state.complete()
      else
        this.$axios.get(this.getItemEndpoint()).then((response) => {
          this.itemList.push(...response.data.item)
          this.pageCurrent = response.data.page.current
          this.pageTotal = response.data.page.total
          this.itemNumber = response.data.itemNumber
          $state.loaded()
        })
    },
    getItemEndpoint() {
      // see '~/utils/getItemEndpoint.js' function not centralized
      let result = 'item'
      let queryParams = ''
      if (this.categoryId) queryParams += `categoryId=${this.categoryId}&`
      if (this.brandId) queryParams += `brandId=${this.brandId}&`
      if (this.search) queryParams += `search=${this.search}&`
      if (this.filter) queryParams += `filter=${this.filter}&`
      if (this.pageCurrent >= 1)
        queryParams += `pageNum=${this.pageCurrent + 1}&`
      if (queryParams !== '') result += '?' + queryParams.slice(0, -1)
      return result
    },
    resetItemList() {
      this.itemList = []
      this.pageTotal = null
      this.pageCurrent = null
      this.$refs.InfiniteLoading.stateChanger.reset()
    },
    toggleTypeItemShow(type) {
      this.typeItemShow = type
      localStorage.setItem('typeItemShow', type)
    },
    setBrandName(name) {
      this.brandName = name
    },
    setCategoryList(list) {
      this.categoryList = list
    },
    setSearchBreadcrumb() {
      this.breadcrumb = [
        {
          text: 'Ricerca',
          to: '?search=' + this.search,
        },
      ]
    },
    setFilterBreadcrumb() {
      this.breadcrumb = [
        {
          text: this.filterName,
          to: {
            name: 'filter',
            params: {
              filter: this.$route.params.filter,
            },
          },
        },
      ]
    },
  },
}
</script>
