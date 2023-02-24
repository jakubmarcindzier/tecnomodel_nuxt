<template>
  <section class="flex-fill mt-5">
    <b-container>
      <b-row>
        <b-col>
          <div class="text-center">
            <font-awesome-icon
              icon="exclamation-triangle"
              size="3x"
              class="mb-2"
            />
            <h1>404</h1>
            <p>{{ $t('title.notFound') }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { cartMixin } from '~/mixins/cartMixin'

export default {
  name: 'NotFound',
  mixins: [cartMixin],
  head() {
    return {
      title: this.$t('title.notFound'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
      meta: [{ name: 'robots', content: 'noindex' }],
    }
  },
  mounted() {
    if (this.getCartItemsTotalQuantity() === null) this.setCartItemsList()
  },
}
</script>
