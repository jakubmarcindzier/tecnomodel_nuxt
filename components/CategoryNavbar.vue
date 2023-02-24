<template>
  <span class="d-none d-lg-block wrapper-sticky">
    <b-navbar
      type="dark"
      sticky
      class="header-main-background-transparent shadow"
      style="height: 50px"
    >
      <b-navbar-brand
        :class="{ 'hidden-element': !hasScrolled, 'slide-in-top': hasScrolled }"
        to="/"
      >
        <b-img-lazy
          class="p-1 img-fluid"
          style="max-height: 30px"
          alt="Tecnomodel Logo"
          src="@/assets/tecnomodel_white_logo_collapsed.png"
        />
      </b-navbar-brand>
      <b-navbar-nav class="m-auto">
        <template v-for="(category, categoryIdx) in categories">
          <b-nav-item-dropdown
            v-if="category.cols.length > 0"
            :ref="category.id"
            :key="categoryIdx"
            no-caret
            lazy
            class="small font-weight-bold my-auto"
            menu-class="dropdown-mega-menu"
            toggle-class="text-white"
            :text="category.name"
            style="position: static !important"
          >
            <lazy-hydrate when-visible>
              <category-menu
                :category="category"
                @closeDropdown="closeDropdown"
              />
            </lazy-hydrate>
          </b-nav-item-dropdown>
          <b-nav-item
            v-else
            :key="categoryIdx"
            class="small font-weight-bold my-auto"
            link-classes="text-white"
            :to="'/b/' + toSeoUrl(category.name) + '/' + category.id"
            >{{ category.name }}
          </b-nav-item>
        </template>
      </b-navbar-nav>
      <b-navbar-nav
        class="ml-auto"
        :class="{ 'hidden-element': !hasScrolled, 'slide-in-top': hasScrolled }"
      >
        <b-nav-text>
          <b-input-group>
            <b-form-input
              v-model="search"
              size="sm"
              type="search"
              class="border-white"
              placeholder="Ricerca..."
              @keyup.enter.native="enterKeyListener"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="sm"
                class="border-white"
                :disabled="!searchRule"
                @click="onSearch"
                ><font-awesome-icon icon="search" size="sm"
              /></b-button>
            </b-input-group-append>
          </b-input-group>
        </b-nav-text>
        <b-nav-text class="ml-3 text-white">
          <lazy-hydrate when-visible>
            <cart-sidebar-link slide-bar-toggle />
          </lazy-hydrate>
        </b-nav-text>
      </b-navbar-nav>
    </b-navbar>
  </span>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { urlMixin } from '@/mixins/urlMixin'
import { searchMixin } from '@/mixins/searchMixin'

export default {
  name: 'CategoryNavbar',
  components: {
    LazyHydrate,
    CartSidebarLink: () => import('@/components/CartSidebarLink'),
    CategoryMenu: () => import('@/components/CategoryMenu'),
  },
  mixins: [urlMixin, searchMixin],
  props: {
    categories: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    hasScrolled() {
      return this.$store.getters['scroll/hasPageScrolled']
    },
  },
  methods: {
    closeDropdown(categoryId) {
      this.$refs[categoryId][0].hide(true)
    },
  },
}
</script>

<style>
.header-main-background-transparent {
  background-color: rgba(255, 153, 0, 0.9);
}

.dropdown-mega-menu {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  margin-top: 0 !important;
  width: 100% !important;
  height: 490px !important;
  border-radius: 0 0 5px 5px !important;
}

.wrapper-sticky {
  position: sticky;
  top: 0;
  z-index: 1;
}

.nav-link {
  white-space: nowrap;
}
</style>
