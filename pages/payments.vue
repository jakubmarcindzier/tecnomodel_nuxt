<template>
  <section id="userPayments" class="user-payments flex-fill">
    <client-only>
      <b-modal
        v-model="showDeletionModal"
        title="Attenzione"
        ok-title="Prosegui"
        cancel-title="Annulla"
        @ok="confirmCardDeletion"
        @cancel="
          validating = false
          deletionModalToken = null
        "
        @close="
          validating = false
          deletionModalToken = null
        "
      >
        <p>
          Stai cercando di cancellare un metodo di pagamento che ha degli ordini
          collegati e al momento non hai inserito un pagamento alternativo per i
          tuoi acquisti.
        </p>
        <p class="font-weight-bold">
          Confermando la scelta di rimuovere la carta verranno annullati anche
          tutti gli ordini relativi ad essa.
        </p>
        <p>
          In alternativa, puoi aggiungere un altro metodo di pagamento, così che
          il sistema lo utilizzi come saldo per i tuoi ordini.
        </p>
        <p class="m-0">
          Clicca su <strong>Prosegui</strong> per cancellare il metodo di
          pagamento e annullare gli ordini collegati. <br /><br />
          Clicca su <strong>Annulla</strong> per annullare l'operazione.
        </p>
      </b-modal>
      <b-container fluid class="px-4">
        <b-row>
          <b-col v-show="!loaded" cols="12" class="text-muted text-center my-5">
            <b-spinner style="width: 6rem; height: 6rem" /><br />
            <strong class="mt-2">Loading user payments...</strong>
          </b-col>
          <b-col v-show="loaded" cols="12" md="9" lg="6" class="my-3 mx-auto">
            <b-card title="My Payment Methods">
              <div v-show="validating" class="text-muted text-center my-2">
                <b-spinner style="width: 4rem; height: 4rem" /><br />
                <strong class="mt-2">Processing...</strong>
              </div>
              <b-card-text v-show="!validating">
                <div
                  :class="{ 'd-none': billingAddress === null || add === true }"
                >
                  <b-card
                    v-for="(vaultedPayment, idx) in vaultedPayments"
                    :key="idx"
                    :class="{ 'border-danger': vaultedPayment.expired }"
                    class="my-3"
                  >
                    <div class="d-flex flex-row">
                      <b-img
                        style="height: 25px"
                        :src="vaultedPayment.imageUrl"
                      />
                      <span
                        v-if="vaultedPayment.last4"
                        class="flex-fill font-weight-bold ml-2"
                        >xxxxxxxxxxxx{{ vaultedPayment.last4 }}</span
                      >
                      <span
                        v-if="vaultedPayment.email"
                        class="flex-fill font-weight-bold ml-2"
                        >{{ vaultedPayment.email }}</span
                      >
                      <span
                        v-if="vaultedPayment.expired"
                        class="font-weight-bold text-danger"
                        >Carta Scaduta</span
                      >
                      <b-button
                        class="ml-2"
                        :disabled="vaultedPayment.expired"
                        @click="makeDefaultPaymentMethod(vaultedPayment.token)"
                      >
                        <font-awesome-icon
                          v-if="vaultedPayment.default"
                          icon="heart"
                          class="text-white"
                        />
                        <font-awesome-icon
                          v-if="!vaultedPayment.default"
                          :icon="['far', 'heart']"
                          class="text-white"
                        />
                      </b-button>
                      <b-button
                        class="border-0 ml-2"
                        variant="danger"
                        @click="checkForPendingOrders(vaultedPayment.token)"
                      >
                        <font-awesome-icon icon="trash" class="text-white" />
                      </b-button>
                    </div>
                  </b-card>
                  <b-alert
                    fade
                    :show="dismissCountDown"
                    dismissible
                    variant="success"
                    @dismissed="dismissCountDown = 0"
                  >
                    {{ msg }}
                  </b-alert>
                  <b-button variant="success" @click="toggleAddState"
                    >Add Payment</b-button
                  >
                </div>
                <div
                  :class="{ 'd-none': add === false || validating === true }"
                >
                  <b-button
                    class="text-white"
                    variant="warning"
                    @click="toggleAddState"
                    >Go Back</b-button
                  >
                </div>
                <div
                  :class="{ 'd-none': add === false || validating === true }"
                  class="mt-3"
                >
                  <b-form-group>
                    <b-form-radio-group id="paymentType" v-model="paymentType">
                      <b-form-radio value="cc">Credit Card</b-form-radio>
                      <b-form-radio value="pp">PayPal</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                  <div :class="{ 'd-none': paymentType !== 'cc' }" class="mt-3">
                    <b-row>
                      <b-col cols="12" md="6" lg="6" class="mb-3">
                        <label for="cc-number"
                          >Credit Card Number <credit-card-icon :name="ccIcon"
                        /></label>
                        <div id="cc-number" class="form-control"></div>
                        <div class="invalid-feedback">
                          Credit card number is required
                        </div>
                      </b-col>
                      <b-col cols="12" md="3" lg="3" class="mb-3">
                        <label for="cc-expiration">Expiration</label>
                        <div id="cc-expiration" class="form-control"></div>
                        <div class="invalid-feedback">
                          Expiration date required
                        </div>
                      </b-col>
                      <b-col cols="6" md="3" lg="3" class="mb-3">
                        <label for="cc-cvv">{{ ccvLabel }}</label>
                        <div id="cc-cvv" class="form-control"></div>
                        <div class="invalid-feedback">
                          Security code required
                        </div>
                      </b-col>
                      <b-col cols="12">
                        <b-button variant="success" @click="verifyCC"
                          >Store Credit Card</b-button
                        >
                        <b-alert
                          :show="validationError"
                          variant="danger"
                          class="mt-3 mb-0"
                          >{{ validationErrorMsg }}</b-alert
                        >
                      </b-col>
                    </b-row>
                  </div>
                  <div :class="{ 'd-none': paymentType !== 'pp' }" class="mt-3">
                    <b-row>
                      <b-col cols="4">
                        <div id="pp-button"></div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
                <div :class="{ 'd-none': billingAddress !== null }">
                  <b-alert show variant="danger"
                    >You don't have a default billing address. Please add one
                    before storing your payment methods.</b-alert
                  >
                </div>
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </client-only>
  </section>
</template>

<script>
const client = require('braintree-web/client')
const hostedFields = require('braintree-web/hosted-fields')
const threeDSecure = require('braintree-web/three-d-secure')
const payPalCheckout = require('braintree-web/paypal-checkout')
let payPal = null
if (typeof window !== 'undefined') payPal = require('paypal-checkout')

export default {
  name: 'PaymentsPage',
  middleware: 'isAuthenticated',
  data() {
    return {
      loaded: false,
      billingAddress: null,
      vaultedPayments: [],
      add: false,
      paymentType: null,
      verifyAmount: 1.0,
      btToken: null,
      clientInstance: null,
      hostedFieldsInstance: null,
      threeDSecureInstance: null,
      threeDSecureOpts: {},
      payPalCheckoutInstance: null,
      validating: false,
      validationError: false,
      validationErrorMsg: '',
      publicPath: process.env.BASE_URL,
      ccIcon: null,
      ccvLabel: 'CCV',
      showDeletionModal: false,
      deletionModalToken: null,
      msg: '',
      dismissSecs: 5,
      dismissCountDown: 0,
    }
  },
  async fetch() {
    const addresses = await this.$axios.$get('user-address?active=1')
    this.setBillingAddress(addresses)
    this.vaultedPayments = await this.$axios.$get('bt/payments')
    const btTokenData = await this.$axios.$get('bt_token')
    this.btToken = btTokenData.token
  },
  head() {
    return {
      title: this.$t('title.payments'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  computed: {
    getPaymentMethodIcon() {
      return (
        `${this.publicPath}img/credit_card_type_logo/${this.ccIcon}.svg` ||
        `${this.publicPath}img/credit_card_type_logo/generic.svg`
      )
    },
    hasManyPaymentMethods() {
      return this.vaultedPayments.length > 1
    },
  },
  watch: {
    btToken() {
      this.setBtClient()
    },
  },
  methods: {
    getVaultedPaymentMethods() {
      return this.$axios.get('bt/payments')
    },
    setBillingAddress(addresses) {
      for (const addressType in addresses) {
        if (addressType === 'billing') {
          let idx = 0
          for (const address in addresses[addressType]) {
            if (addresses[addressType][address].default === '1' || idx === 0) {
              this.billingAddress = addresses[addressType][address]
              break
            }
            idx++
          }
        }
      }
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    insertPaymentMethod(nonce, callback = null) {
      this.$axios
        .post(`bt/payments/${nonce}/${this.billingAddress.id}`)
        .then((res) => {
          if (res.data.success) {
            const success = res.data.success
            this.getVaultedPaymentMethods()
              .then((res) => {
                this.vaultedPayments = res.data
                if (callback) callback(success)
                else this.validating = false
              })
              .catch((err) => {
                this.validating = false
                this.error = err
              })
          } else {
            this.validating = false
          }
        })
        .catch((err) => {
          this.error = err
        })
    },
    deletePaymentMethod(token, callback = null) {
      this.validating = true
      this.$axios
        .delete(`checkout/brt_payments/${token}`)
        .then((res) => {
          if (res.data.success) {
            this.getVaultedPaymentMethods()
              .then((res) => {
                this.vaultedPayments = res.data
                if (callback) {
                  callback(token)
                } else {
                  this.validating = false
                  this.msg = 'Payment Method successfully deleted'
                  this.showAlert()
                }
              })
              .catch((err) => {
                this.validating = false
                this.error = err
              })
          } else {
            this.validating = false
          }
        })
        .catch((err) => {
          this.validating = false
          this.error = err
        })
    },
    makeDefaultPaymentMethod(token) {
      this.validating = true
      this.$axios
        .post(`checkout/brt_payments/default`, {
          tokenId: token,
        })
        .then((res) => {
          if (res.data.success) {
            this.getVaultedPaymentMethods()
              .then((res) => {
                this.vaultedPayments = res.data
                this.validating = false
              })
              .catch((err) => {
                this.validating = false
                this.error = err
              })
          } else {
            this.validating = false
          }
        })
        .catch((err) => {
          this.validating = false
          this.error = err
        })
    },
    checkForPendingOrders(token) {
      const that = this
      this.validating = true
      this.$axios
        .get(`bt/payments/orders/${token}`)
        .then((res) => {
          if (res.data.hasPendingOrders) {
            if (this.hasManyPaymentMethods) {
              this.deletePaymentMethod(token, function (token) {
                that.updateOrdersByToken(token)
              })
            } else {
              this.deletionModalToken = token
              this.showDeletionModal = true
            }
          } else {
            this.deletePaymentMethod(token)
          }
        })
        .catch((err) => {
          this.validating = false
          this.error = err
        })
    },
    confirmCardDeletion() {
      const that = this
      this.deletePaymentMethod(this.deletionModalToken, function (token) {
        that.deletionModalToken = null
        that.voidOrdersByToken(token)
      })
    },
    voidOrdersByToken(token) {
      this.$axios
        .post(`order/void/token`, {
          paymentToken: token,
        })
        .then((res) => {
          this.validating = false
          if (res.data.success) {
            this.msg =
              'Payment Method successfully deleted and related orders voided'
          } else {
            this.msg =
              'Payment Method successfully deleted but related orders were not voided'
          }
          this.showAlert()
        })
        .catch((err) => {
          this.validating = false
          this.error = err
        })
    },
    updateOrdersByToken(token) {
      this.$axios
        .put(`order/update/token`, {
          paymentToken: token,
        })
        .then((res) => {
          this.validating = false
          if (res.data.success) {
            this.msg =
              'Payment Method successfully deleted and related orders updated'
          } else {
            this.msg =
              'Payment Method successfully deleted but related orders were not updated'
          }
          this.showAlert()
        })
        .catch((err) => {
          this.validating = false
          this.error = err
        })
    },
    addOrdersByToken(token) {
      this.$axios.put(`order/add/token`, {
        paymentToken: token,
      })
    },
    setBtClient() {
      const that = this
      client
        .create({
          authorization: this.btToken,
        })
        .then(function (clientInstance) {
          that.clientInstance = clientInstance
          that.setHostedFieldsInstance()
          that.setThreeDSecureInstance()
          that.setPayPalCheckoutInstance()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    setHostedFieldsInstance() {
      const that = this
      hostedFields
        .create(this.setHostedFieldsOpts())
        .then(function (hostedFieldsInstance) {
          that.hostedFieldsInstance = hostedFieldsInstance
          that.setHostedFieldsEvents()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    setHostedFieldsOpts() {
      return {
        client: this.clientInstance,
        styles: {
          input: {
            'font-size': '1rem',
            color: '#495057',
          },
        },
        fields: {
          number: {
            selector: '#cc-number',
            placeholder: '',
          },
          cvv: {
            selector: '#cc-cvv',
            placeholder: '',
          },
          expirationDate: {
            selector: '#cc-expiration',
            placeholder: 'MM / YY',
          },
        },
      }
    },
    setHostedFieldsEvents() {
      const that = this

      this.hostedFieldsInstance.on('validityChange', function (event) {
        const field = event.fields[event.emittedBy]

        field.container.classList.remove('is-valid')
        field.container.classList.remove('is-invalid')

        if (field.isValid) {
          field.container.classList.add('is-valid')
        } else if (field.isPotentiallyValid) {
          // nothing to do here
        } else {
          field.container.classList.add('is-invalid')
        }
      })

      this.hostedFieldsInstance.on('cardTypeChange', function (event) {
        if (event.cards.length === 1) {
          const card = event.cards[0]
          that.ccIcon = that.normalizeCreditCardLabel(card.niceType)
          that.ccvLabel = card.code.name
        } else {
          that.ccIcon = null
          that.ccvLabel = 'CVV'
        }
      })
    },
    normalizeCreditCardLabel(string) {
      return string
        .toLowerCase()
        .replace('american express', 'amex')
        .replace('diners club', 'diners')
    },
    setThreeDSecureInstance() {
      const that = this
      threeDSecure
        .create({
          version: 2,
          client: this.clientInstance,
        })
        .then(function (threeDSecureInstance) {
          that.threeDSecureInstance = threeDSecureInstance
        })
        .catch(function (err) {
          that.error = err
        })
    },
    setThreeDSecureOpts(nonce, bin) {
      this.threeDSecureOpts = {
        challengeRequested: true,
        amount: this.verifyAmount,
        nonce,
        bin,
        email: this.$store.getters.getUserInfo.email,
        billingAddress: {
          givenName: this.billingAddress.firstName,
          surname: this.billingAddress.lastName,
          phoneNumber: this.billingAddress.phoneNumber,
          streetAddress: this.billingAddress.line1.substring(0, 50),
          extendedAddress: this.billingAddress.line2
            ? this.billingAddress.line2.substring(0, 50)
            : '',
          locality: this.billingAddress.city,
          region: this.billingAddress.province,
          postalCode: this.billingAddress.postalCode,
          countryCodeAlpha2: this.billingAddress.isoCode,
        },
        onLookupComplete(data, next) {
          next()
        },
      }
    },
    verifyCC() {
      this.validating = true
      const that = this
      this.hostedFieldsInstance
        .tokenize()
        .then(function (payload) {
          that.setThreeDSecureOpts(payload.nonce, payload.details.bin)
          return that.threeDSecureInstance.verifyCard(that.threeDSecureOpts)
        })
        .then(function (payload) {
          that.setCCValidationSuccess(payload)
        })
        .catch(function (err) {
          that.setCCValidationError(err)
        })
    },
    setCCValidationSuccess(payload) {
      const that = this

      if (!payload.liabilityShifted) {
        this.validationError = true
        this.validationErrorMsg =
          'Cannot complete 3DSecure. Please choose another credit card.'
        return
      }

      this.insertPaymentMethod(payload.nonce, function (success) {
        that.validating = false
        that.validationError = false
        that.validationErrorMsg = ''
        if (!success) {
          that.validationError = true
          that.validationErrorMsg = 'Something bad happened'
        } else {
          that.toggleAddState()
          that.msg = 'Payment Method successfully inserted'
          that.showAlert()
          if (that.vaultedPayments[0].token)
            that.addOrdersByToken(that.vaultedPayments[0].token)
        }
      })
    },
    setCCValidationError(err) {
      this.validating = false
      this.validationError = true
      switch (err.code) {
        case 'HOSTED_FIELDS_FIELDS_EMPTY':
          // occurs when none of the fields are filled in
          this.validationErrorMsg =
            'All fields are empty! Please fill out the form.'
          break
        case 'HOSTED_FIELDS_FIELDS_INVALID':
          // occurs when certain fields do not pass client side validation
          this.validationErrorMsg =
            'Some fields are invalid: ' + err.details.invalidFieldKeys

          for (const invalidField in err.details.invalidFields) {
            err.details.invalidFields[invalidField].classList.remove('is-valid')
            err.details.invalidFields[invalidField].classList.add('is-invalid')
          }
          break
        case 'HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE':
          // occurs when:
          //   * the client token used for client authorization was generated
          //     with a customer ID and the fail on duplicate payment method
          //     option is set to true
          //   * the card being tokenized has previously been vaulted (with any customer)
          // See: https://developers.braintreepayments.com/reference/request/client-token/generate/#options.fail_on_duplicate_payment_method
          this.validationErrorMsg =
            'This payment method already exists in your vault.'
          break
        case 'HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED':
          // occurs when:
          //   * the client token used for client authorization was generated
          //     with a customer ID and the verify card option is set to true
          //     and you have credit card verification turned on in the Braintree
          //     control panel
          //   * the cvv does not pass verfication (https://developers.braintreepayments.com/reference/general/testing/#avs-and-cvv/cid-responses)
          // See: https://developers.braintreepayments.com/reference/request/client-token/generate/#options.verify_card
          this.validationErrorMsg = 'CVV did not pass verification'
          break
        case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
          // occurs for any other tokenization error on the server
          this.validationErrorMsg =
            'Tokenization failed server side. Is the card valid?'
          break
        case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
          // occurs when the Braintree gateway cannot be contacted
          this.validationErrorMsg = 'Network error occurred when tokenizing.'
          break
        default:
          this.validationErrorMsg = 'Something bad happened! ' + err
      }
    },
    setPayPalCheckoutInstance() {
      const that = this
      payPalCheckout
        .create({
          client: this.clientInstance,
        })
        .then(function (payPalCheckoutInstance) {
          that.payPalCheckoutInstance = payPalCheckoutInstance
          that.setPayPalBtn()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    setPayPalBtn() {
      const that = this

      payPal.Button.render(
        {
          env:
            process.env.NODE_ENV === 'development' ? 'sandbox' : 'production',
          commit: true,
          style: {
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 30,
            size: 'responsive',
          },

          payment() {
            return that.payPalCheckoutInstance.createPayment(
              that.setPayPalCheckoutObj()
            )
          },

          onAuthorize(data /*, actions */) {
            that.validating = true
            return that.payPalCheckoutInstance
              .tokenizePayment(data)
              .then(function (payload) {
                that.insertPaymentMethod(payload.nonce, function (success) {
                  if (!success) {
                    that.validationError = true
                    that.validationErrorMsg = 'Something bad happened'
                  } else {
                    that.validating = false
                    that.toggleAddState()
                    that.msg = 'Payment Method successfully inserted'
                    that.showAlert()
                  }
                })
              })
              .catch(function (err) {
                that.error = err
              })
          },

          onCancel(data) {
            that.error =
              'checkout.js payment cancelled' + JSON.stringify(data, 0, 2)
          },

          onError(err) {
            that.error = 'checkout.js error ' + err
          },
        },
        '#pp-button'
      )
        .then(function () {
          that.loaded = true
        })
        .catch(function (err) {
          that.error = err
        })
    },
    setPayPalCheckoutObj() {
      return {
        flow: 'vault',
        enableShippingAddress: true,
        shippingAddressEditable: false,
        shippingAddressOverride: {
          recipientName:
            this.billingAddress.firstName + ' ' + this.billingAddress.lastName,
          line1: this.billingAddress.line1,
          line2: this.billingAddress.line2 ? this.billingAddress.line2 : '',
          city: this.billingAddress.city,
          countryCode: this.billingAddress.isoCode,
          postalCode: this.billingAddress.postalCode,
          state: this.billingAddress.province,
          phone: this.billingAddress.phoneNumber,
        },
      }
    },
    toggleAddState() {
      this.add = !this.add
      this.paymentType = this.paymentType === null ? this.paymentType : null
      this.hostedFieldsInstance.clear('number')
      this.hostedFieldsInstance.clear('expirationDate')
      this.hostedFieldsInstance.clear('cvv')
      this.validationError = false
      this.validationErrorMsg = ''
    },
  },
}
</script>
