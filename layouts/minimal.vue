<template>
  <div>
    <header
      id="checkout-header"
      class="main-background border-bottom border-white"
    >
      <b-container fluid>
        <b-row class="mx-auto py-3 d-flex align-items-center">
          <b-col cols="3" md="2" lg="4" class="d-sm-block d-lg-none pl-0">
            <b-link to="/">
              <nuxt-img
                class="img-fluid w-100"
                alt="Tecnomodel Logo"
                src="@/assets/tecnomodel_white_logo_collapsed.png"
                fit="contain"
                loading="lazy"
                quality="70"
                background="white"
              />
            </b-link>
          </b-col>
          <b-col cols="2" class="d-none d-lg-block px-0 text-center text-white">
            <b-link to="/">
              <nuxt-img
                class="img-fluid w-100"
                alt="Tecnomodel Logo"
                src="@/assets/tecnomodel_white_logo.png"
                fit="contain"
                loading="lazy"
                quality="70"
                background="white"
              />
            </b-link>
          </b-col>
          <b-col cols="10" class="d-none d-lg-block px-0 text-right text-white">
            <font-awesome-icon icon="phone" size="lg" />
            <!--<font-awesome-icon :icon="['fab', 'whatsapp']" size="lg" />-->
            <b><i>+39 0586 407 558</i></b>
          </b-col>
          <b-col
            cols="9"
            md="2"
            lg="4"
            class="d-sm-block d-lg-none pl-0 text-right text-white"
          >
            <font-awesome-icon icon="phone" />
            <!--<font-awesome-icon :icon="['fab', 'whatsapp']" />-->
            <b><i>+39 0586 407 558</i></b>
          </b-col>
        </b-row>
      </b-container>
    </header>
    <nuxt />
  </div>
</template>

<script>
import { cartMixin } from '~/mixins/cartMixin'

export default {
  name: 'MinimalLayout',
  mixins: [cartMixin],
  mounted() {
    if (this.getCartItemsTotalQuantity() === null) this.setCartItemsList()
  },
}
</script>
