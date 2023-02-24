<template>
  <section class="pt-4 px-4">
    <b-container fluid>
      <b-breadcrumb class="bg-white border m-0">
        <b-breadcrumb-item to="/home">
          <font-awesome-icon class="main-color" icon="home" size="lg" />
        </b-breadcrumb-item>
        <b-breadcrumb-item :active="!orderId" to="/order"
          >Ordini</b-breadcrumb-item
        >
        <b-breadcrumb-item v-if="orderId" active>{{
          orderId
        }}</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row v-if="orderDetail" class="py-3">
        <b-col>
          <b-card>
            <b-card-text>
              <div>
                <b>{{ $t('payment.' + orderDetail.payment) }}</b>
              </div>
              <template
                v-if="
                  orderDetail.orderStatus === 'pending' &&
                  orderDetail.payment === 'bank-transfer'
                "
              >
                <ul>
                  <li>
                    Beneficiario: <b><i>TECNOMODEL SRL</i></b>
                  </li>
                  <li>
                    IBAN: <b><i>IT28N0200813909000103772213</i></b>
                  </li>
                  <li>
                    Causale:
                    <b
                      ><i>Ordine n. {{ orderId }}</i></b
                    >
                  </li>
                  <li>
                    BIC SWIFT: <b><i>UNCRITMM</i></b>
                    <small>
                      Select "OUR" code for bank transfer not SEPA.</small
                    >
                  </li>
                </ul>
                <small
                  >NOTA: Raccomandiamo di aggiungere sempre nella causale il
                  numero di ordine in modo da rendere più veloce l'associazione
                  del pagamento con il tuo ordine.</small
                >
              </template>
              <template
                v-if="
                  orderDetail.orderStatus === 'pending' &&
                  orderDetail.payment === 'financing'
                "
              >
                <form
                  method="post"
                  action="https://secure.sellapersonalcredit.it/econsel/public/entry/pf"
                  target="_blank"
                >
                  <input
                    type="hidden"
                    name="tabella-finanziaria"
                    :value="orderDetail.totalAmount >= 300 ? 'MPF' : 'WIN'"
                  />
                  <input type="hidden" name="ordine" :value="orderId" />
                  <input type="hidden" name="anticipo" value="0" />
                  <input
                    type="hidden"
                    name="descrizione-bene"
                    :value="
                      orderDetail.item[0].brand +
                      ' ' +
                      orderDetail.item[0].code +
                      ' ' +
                      orderDetail.item[0].name
                    "
                  />
                  <input
                    type="hidden"
                    name="importo-da-finanziare"
                    :value="orderDetail.totalAmount"
                  />
                  <input type="hidden" name="commissioni" value="0" />
                  <input type="hidden" name="codice-merce" value="MS" />
                  <input type="hidden" name="codice-prodotto" value="52" />
                  <input
                    type="hidden"
                    name="codice-convenzionato"
                    value="0033135"
                  />
                  <b-button block type="submit"
                    >Richiedi Finanziamento</b-button
                  >
                </form>
              </template>
              <template
                v-if="
                  orderDetail.orderStatus === 'pending' &&
                  orderDetail.payment === 'revolve-payment-card'
                "
              >
                <form
                  method="post"
                  action="https://reserved.e-consel.it/DOL/faces/frmECAcquistiSuccessiviRichiestaAcquisto.jsp"
                >
                  <input name="das" value="NO" type="hidden" />
                  <input name="campagna" value="WIN" type="hidden" />
                  <input name="tcampagna" value="WIN" type="hidden" />
                  <input name="convenz" value="0033135" type="hidden" />
                  <input name="utenome" value="EC0033135" type="hidden" />
                  <input
                    name="convnome"
                    value="www.tecnomodel-treni.it"
                    type="hidden"
                  />
                  <input
                    name="impdafin"
                    :value="
                      orderDetail.totalAmount.toLocaleString(lang, {
                        style: 'currency',
                        currency: 'EUR',
                      })
                    "
                    type="hidden"
                  />
                  <input
                    name="ordine"
                    :value="orderDetail.orderId"
                    type="hidden"
                  />
                  <input
                    type="hidden"
                    name="descr"
                    :value="
                      orderDetail.item[0].brand +
                      ' ' +
                      orderDetail.item[0].code +
                      ' ' +
                      orderDetail.item[0].name
                    "
                  />
                  <b-button block type="submit"
                    >Richiedi Finanziamento CARTE in RETE</b-button
                  >
                </form>
              </template>
              <template
                v-if="
                  orderDetail.orderStatus === 'pending' &&
                  (orderDetail.payment === 'credit-card' ||
                    orderDetail.payment === 'paypal') &&
                  orderDetail.error === 'missing_payment_token' &&
                  vaultedPaymentMethods &&
                  vaultedPaymentMethods.length === 0
                "
              >
                Puoi pagare questo ordine con carta di credito o con paypal
                aggiungendo un metodo di pagamento sulla pagina
                <b-link to="/payments"> I miei pagamenti </b-link>
              </template>
            </b-card-text>
          </b-card>
          <order-list
            :data="[orderDetail]"
            show-detail
            :show-error="
              vaultedPaymentMethods && vaultedPaymentMethods.length === 0
            "
            @changeAddressConfirmed="getOrder(orderDetail.orderId)"
          />
        </b-col>
      </b-row>
      <b-row v-else class="py-3">
        <b-col lg="9">
          <b-tabs content-class="mt-3" lazy>
            <b-tab title="Ordini">
              <b-col v-if="!orderList" class="text-center">
                <b-spinner style="width: 6rem; height: 6rem"></b-spinner>
              </b-col>
              <order-list :data="orderList" />
            </b-tab>
            <b-tab title="Preordini" :active="$route.hash === '#backorder'">
              <b-col v-if="!backorderOrderList" class="text-center">
                <b-spinner style="width: 6rem; height: 6rem"></b-spinner>
              </b-col>
              <order-list :data="backorderOrderList" />
            </b-tab>
            <b-tab title="Annullati">
              <b-col v-if="!voidedOrderList" class="text-center">
                <b-spinner style="width: 6rem; height: 6rem"></b-spinner>
              </b-col>
              <order-list :data="voidedOrderList" />
            </b-tab>
          </b-tabs>
        </b-col>
        <b-col lg="3" class="d-lg-block d-none mb-4">
          <div class="sticky-top sticky-offset">
            <b-card></b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'OrderPage',
  data() {
    return {
      orderList: null,
      backorderOrderList: null,
      voidedOrderList: null,
      orderId: null,
      orderDetail: null,
      vaultedPaymentMethods: null,
    }
  },
  head() {
    return {
      title: this.$t('title.order'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  watch: {
    '$route.params.orderId'(value) {
      if (value) {
        this.getOrder(value)
        this.orderId = value
      } else {
        this.orderDetail = null
        this.getOrders()
        this.getOrders(true)
        this.getOrders(false, true)
      }
    },
    'orderDetail.error'(value) {
      if (value === 'missing_payment_token') this.getVaultedPaymentMethods()
    },
  },
  beforeMount() {
    if (this.$route.params.orderId) {
      this.getOrder(this.$route.params.orderId)
      this.orderId = this.$route.params.orderId
    } else this.getOrders()
  },
  mounted() {
    if (!this.orderList) this.getOrders()
    this.getOrders(true)
    this.getOrders(false, true)
  },
  methods: {
    getOrders(backorder = false, voided = false) {
      let endPoint = `order`
      if (backorder) endPoint += '?backorder=1'
      if (voided) endPoint += '?voided=1'
      this.$axios
        .get(endPoint)
        .then((res) => {
          if (backorder) this.backorderOrderList = res.data
          else if (voided) this.voidedOrderList = res.data
          else this.orderList = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
    getOrder(orderId) {
      this.$axios
        .get(`order/${orderId}`)
        .then((res) => {
          this.orderDetail = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
    getVaultedPaymentMethods() {
      this.$axios
        .get('bt/payments')
        .then((res) => {
          this.vaultedPaymentMethods = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>
