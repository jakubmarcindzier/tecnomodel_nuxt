<template>
  <header id="main-header" class="main-background border-bottom border-white">
    <b-container>
      <b-row class="mx-auto py-3 d-flex align-items-center">
        <b-col cols="3" md="2" lg="4" class="d-sm-block d-lg-none pl-0">
          <b-link to="/">
            <nuxt-img
              class="img-fluid w-100"
              alt="Tecnomodel Logo"
              src="@/assets/tecnomodel_white_logo_collapsed.png"
              fit="contain"
              height="25"
              loading="lazy"
              quality="70"
              background="white"
            />
          </b-link>
        </b-col>
        <b-col cols="2" class="d-none d-lg-block px-0 text-center text-white">
          <b-link to="/">
            <b-img
              class="img-fluid w-100"
              alt="Tecnomodel Logo"
              src="@/assets/tecnomodel_white_logo.png"
            />
          </b-link>
        </b-col>
        <b-col cols="9" lg="7" offset-lg="1">
          <b-row>
            <b-col cols="12">
              <b-input-group>
                <b-form-input
                  v-model="search"
                  type="search"
                  class="border-white"
                  placeholder="Cerca"
                  @keyup.enter.native="enterKeyListener"
                />
                <b-input-group-append>
                  <b-button
                    :disabled="!searchRule"
                    class="border-white"
                    @click="onSearch"
                    >Cerca
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="1" offset-lg="1" class="d-none d-lg-block px-0">
          <cart-sidebar-link slide-bar-toggle class="text-white" />
          <confirm-add-to-cart />
        </b-col>
      </b-row>
    </b-container>
  </header>
</template>

<script>
import { searchMixin } from '@/mixins/searchMixin'

export default {
  name: 'MainHeader',
  mixins: [searchMixin],
  data() {
    return {
      showCartSidebar: false,
    }
  },
}
</script>
