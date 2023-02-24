<template>
  <span v-if="data">
    <b-card v-if="!showDetail">
      <b-row>
        <b-col> {{ data.length }} ordini </b-col>
        <b-col cols="2">
          <!--<b-form-select v-model="selected" :options="options"></b-form-select>-->
        </b-col>
      </b-row>
    </b-card>
    <div v-for="(order, key) in data" :key="key" class="mt-3">
      <b-card>
        <template #header>
          <b-row>
            <b-col>
              <b-row>
                Ordine # {{ order.orderId }}
                <template v-if="order.error && showError">
                  <b-link :id="'error-' + key">
                    <font-awesome-icon
                      class="main-color"
                      icon="exclamation-triangle"
                      size="lg"
                  /></b-link>
                  <b-popover
                    :target="'error-' + key"
                    triggers="hover"
                    placement="top"
                  >
                    <b-link to="/payments">
                      Controlla se hai almeno un metodo di pagamento.
                    </b-link>
                  </b-popover>
                </template></b-row
              >
              <b-row class="small">
                Del <format-date :date="order.date" />
              </b-row>
            </b-col>
            <b-col>
              <b-row> Totale: <price :amount="order.totalAmount" /> </b-row>
              <b-row v-if="order.shipDate" class="small">
                Spedito il <format-date :date="order.shipDate" />
              </b-row>
            </b-col>
            <b-col>
              <b-row class="text-right"
                ><b-link v-if="!showDetail" :to="'order/' + order.orderId"
                  >Mostra dettagli ordine</b-link
                ></b-row
              >
            </b-col>
            <b-col v-if="order.address">
              Indirizzo:
              <b-link id="popover-address">
                {{ order.address.firstName }} {{ order.address.lastName }}
              </b-link>
              <b-link
                v-if="
                  order.orderStatus !== 'shipped' && order.payment !== 'paypal'
                "
                v-b-modal.address-change
                ><font-awesome-icon class="main-color" icon="pen"
              /></b-link>
              <b-popover
                target="popover-address"
                triggers="hover"
                placement="bottom"
              >
                {{ order.address.firstName }} {{ order.address.lastName }}
                <br />
                {{ order.address.line1 }} <br />
                {{ order.address.line2 }} <br v-if="order.address.line2" />
                {{ order.address.postalCode }} {{ order.address.city }}
                {{ order.address.province }}<br />
                {{ order.address.countryName }}
              </b-popover>
            </b-col>
          </b-row>
        </template>
        <b-card-text>
          <b-row v-for="(item, id) in order.item" :key="id">
            <b-col>
              <b-img
                v-if="item.itemId"
                class="image-thumb"
                :src="thumbImagePath(item.thumbImagePath)"
                :alt="item.brand + ' ' + item.code + ' ' + item.name"
              />
            </b-col>
            <b-col>
              <b-badge v-if="item.quantity > 1" style="margin-right: 6px">{{
                item.quantity
              }}</b-badge>
              <b-link
                v-if="item.itemId"
                :to="
                  '/i/' +
                  toSeoUrl(item.brand + ' ' + item.code + ' ' + item.name) +
                  '/' +
                  item.itemId
                "
                >{{ item.brand }} {{ item.code }} {{ item.name }}</b-link
              >
              <span v-if="!item.itemId && item.brand && item.brand !== '_'"
                >{{ item.brand }}
              </span>
              <span v-if="!item.itemId && item.code">{{ item.code }} </span>
              <span v-if="!item.itemId && item.name">{{ item.name }}</span>
            </b-col>
            <b-col>
              <price :amount="item.price * item.quantity" />
            </b-col>
          </b-row>
        </b-card-text>
        <b-button
          v-if="order.shippingTrackingUrl"
          class="fa-pull-right"
          target="_blank"
          :href="order.shippingTrackingUrl"
          >Traccia spedizione</b-button
        >
      </b-card>
    </div>
    <b-modal
      id="address-change"
      size="lg"
      title="Modifica indirizzo"
      hide-footer
    >
      <address-manager
        :iso-code="isoCode"
        :address-id="addressId"
        :order-id="orderId"
        @changeAddressConfirmed="emitChangeAddressConfirmed"
      />
    </b-modal>
  </span>
</template>

<script>
import { cartMixin } from '@/mixins/cartMixin'
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'OrderList',
  mixins: [cartMixin, urlMixin],
  props: {
    data: {
      type: Array,
      default: null,
    },
    showDetail: {
      type: Boolean,
      default: false,
    },
    showError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: '2021',
      options: [
        { value: 2021, text: '2021' },
        { value: 2020, text: '2020' },
        { value: 2019, text: '2019' },
      ],
    }
  },
  computed: {
    isoCode() {
      return this.data[0] &&
        this.data[0].address &&
        this.data[0].address.isoCode
        ? this.data[0].address.isoCode
        : null
    },
    addressId() {
      return this.data[0] && this.data[0].address && this.data[0].address.id
        ? this.data[0].address.id
        : null
    },
    orderId() {
      return this.data[0] && this.data[0].orderId ? this.data[0].orderId : null
    },
  },
  methods: {
    emitChangeAddressConfirmed() {
      this.$emit('changeAddressConfirmed', true)
    },
  },
}
</script>

<style>
.image-thumb {
  object-fit: contain;
  max-height: 100px;
  max-width: 150px;
}
</style>
