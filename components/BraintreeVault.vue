<template>
  <div>
    <div v-if="!clientInitialized" class="text-center">
      <b-spinner
        label="Loading..."
        style="width: 3rem; height: 3rem"
        class="m-2"
        variant="secondary"
      />
    </div>
    <div v-if="!clientInitialized" class="text-center text-muted">
      Loading...
    </div>
    <p v-if="error !== ''" class="text-danger">{{ error }}</p>
    <div
      v-if="type === 'credit-card'"
      id="cc-container"
      :class="{ 'd-none': !clientInitialized }"
    >
      <b-card
        :class="{ 'd-none': ccListShown === true }"
        class="border-0"
        body-class="p-0"
      >
        <b-card-text>
          <div v-if="ccList.length > 0" class="d-flex flex-row text-muted">
            <span class="flex-fill"></span>
            <a
              class="main-color"
              href="#"
              @click.prevent="
                ccListShown = true
                setDefaultPaymentMethod()
              "
              >Chiudi</a
            >
          </div>
          <b-row>
            <b-col cols="12" md="6" lg="6" class="mb-3">
              <label for="cc-number"
                >{{ $t('credit_card_number') }}
                <credit-card-icon
                  v-if="ccIcon"
                  :name="ccIcon"
                  style="height: 25px"
                />
              </label>
              <div id="cc-number" class="form-control"></div>
              <div class="invalid-feedback">Credit card number is required</div>
            </b-col>
            <b-col cols="6" md="3" lg="3" class="mb-3">
              <label for="cc-expiration">{{
                $t('credit_card_expiration')
              }}</label>
              <div id="cc-expiration" class="form-control"></div>
              <div class="invalid-feedback">Expiration date required</div>
            </b-col>
            <b-col cols="6" md="3" lg="3" class="mb-3">
              <label for="cc-cvv">{{ ccvLabel }}</label>
              <div id="cc-cvv" class="form-control"></div>
              <div class="invalid-feedback">Security code required</div>
            </b-col>
          </b-row>
          <b-form-checkbox
            id="cc-store"
            v-model="storeCC"
            name="cc-store"
            value="1"
            unchecked-value="0"
          >
            {{ $t('store_credit_card_payment') }}
          </b-form-checkbox>
          <div style="margin-top: 5px; margin-right: 5px">
            <span
              v-for="(creditCard, key) in creditCardsAcceptedIcon"
              :key="key"
            >
              <credit-card-icon
                :name="creditCard"
                style="height: 25px; margin-right: 5px; margin-bottom: 5px"
              />
            </span>
          </div>
          <b-alert variant="warning" :show="forceStorage && storeCC === '0'">
            {{ $t('alert_disable_store_payment') }}
          </b-alert>
          <b-alert
            :show="ccHasValidationError"
            variant="danger"
            class="my-2"
            dismissible
            @dismissed="ccHasValidationError = false"
            >{{ ccValidationErrorMsg }}</b-alert
          >
        </b-card-text>
      </b-card>
      <div
        id="cc-list"
        :class="{ 'd-none': ccListShown === false }"
        class="my-2"
      >
        <b-card>
          <b-card-text>
            <b-form-radio
              v-for="(cc, idx) in ccList"
              :key="idx"
              v-model="ccChecked"
              :value="cc.token"
              @change="emitChoosePayment(cc.token)"
            >
              <nuxt-img
                :src="
                  cc.imageUrl ||
                  require(`~/assets/img/credit_card_type_logo/generic.svg`)
                "
                fit="contain"
                height="25"
                loading="lazy"
                quality="70"
                background="white"
                alt=""
              />
              {{ ' ending in ' + cc.last4 }}
              <b-button
                class="text-muted text-decoration-none p-0 m-0 ml-1"
                variant="link"
                @click="removeCC(idx)"
              >
                <font-awesome-icon icon="times" />
              </b-button>
            </b-form-radio>
            <b-button
              class="mt-2"
              @click="
                ccListShown = false
                resetChosenPaymentMethod()
              "
              >{{ $t('add_new_credit_card') }}</b-button
            >
          </b-card-text>
        </b-card>
      </div>
    </div>
    <div
      v-if="type === 'paypal'"
      id="pp-container"
      :class="{ 'd-none': !clientInitialized }"
    >
      <b-card
        :class="{ 'd-none': payPalAccountListShown === true }"
        class="border-0"
        body-class="p-0"
      >
        <b-card-text>
          <div
            v-if="payPalAccountList.length > 0"
            class="d-flex flex-row text-muted"
          >
            <span class="flex-fill"></span>
            <a
              class="main-color"
              href="#"
              @click.prevent="
                payPalAccountListShown = true
                setDefaultPaymentMethod()
              "
              >Chiudi</a
            >
          </div>
          <b-form-checkbox
            id="pp-store"
            v-model="storePayPalAccount"
            name="pp-store"
            value="1"
            unchecked-value="0"
          >
            {{ $t('store_paypal_payment') }}
          </b-form-checkbox>
          <b-alert
            variant="warning"
            :show="forceStorage && storePayPalAccount === '0'"
          >
            {{ $t('alert_disable_store_payment') }}
          </b-alert>
          <b-button
            :class="{ 'd-none': payPalAccountListShown === false }"
            variant="primary"
            class="mt-2"
            @click="togglePayPalButton"
            >Show my Paypal accounts</b-button
          >
        </b-card-text>
      </b-card>
      <div
        id="pp-account-list"
        :class="{ 'd-none': payPalAccountListShown === false }"
        class="my-2"
      >
        <b-card>
          <b-card-text>
            <b-form-radio
              v-for="(payPalAccount, idx) in payPalAccountList"
              :key="idx"
              v-model="payPalAccountChecked"
              :value="payPalAccount.token"
              @change="emitChoosePayment(payPalAccount.token)"
            >
              <nuxt-img
                v-if="payPalAccount.imageUrl"
                :src="payPalAccount.imageUrl"
                fit="contain"
                height="25"
                loading="lazy"
                quality="70"
                background="white"
                alt=""
              />
              {{ payPalAccount.email }}
              <b-button
                class="text-muted text-decoration-none p-0 m-0 ml-1"
                variant="link"
                @click="removePayPalAccount(idx)"
              >
                <font-awesome-icon icon="times" />
              </b-button>
            </b-form-radio>
            <b-button
              class="mt-2"
              @click="
                payPalAccountListShown = false
                resetChosenPaymentMethod()
              "
              >{{ $t('add_new_paypal_account') }}</b-button
            >
          </b-card-text>
        </b-card>
      </div>
    </div>
    <div
      v-if="type !== 'credit-card' && type !== 'paypal'"
      id="local-payment-container"
      :class="{ 'd-none': !clientInitialized }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BraintreeVault',
  props: {
    type: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    billingAddress: {
      type: Object,
      default: null,
    },
    shippingAddress: {
      type: Object,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    forceStorage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      error: '',
      publicPath: process.env.BASE_URL,
      brTreeToken: null,
      clientInitialized: false,
      clientResetted: false,
      clientInstance: null,
      hostedFieldsInstance: null,
      threeDSecureInstance: null,
      localPaymentInstance: null,
      threeDSecureOpts: {},
      payPalCheckoutInstance: null,
      payPalAccountList: [],
      payPalAccountListShown: false,
      payPalAccountChecked: '',
      storePayPalAccount: 1,
      ccIcon: null,
      ccvLabel: 'CCV',
      ccList: [],
      ccListShown: false,
      ccChecked: '',
      storeCC: 1,
      validatingCC: false,
      ccHasValidationError: false,
      ccValidationErrorMsg: '',
      brainTreeKey: {
        'credit-card': 'cc',
        paypal: 'pp',
      },
      localPaymentAcceptedType: ['sofort', 'mybank'],
      creditCardsAcceptedIcon: ['visa', 'mastercard'],
    }
  },
  watch: {
    async storePayPalAccount(newValue) {
      if (newValue === '1') await this.setPayPalBtn('vault')
      else this.setPayPalBtn('checkout')
    },
    async amount() {
      if (this.storePayPalAccount === '0') await this.setPayPalBtn('checkout')
    },
  },
  mounted() {
    this.$emit('braintreeVaultMounted', this, this.type)
    if (this.type === 'credit-card' || this.type === 'paypal')
      this.getStoredPayments()
  },
  created() {
    try {
      this.getClientAuth()
    } catch (err) {
      this.error = err
    }
  },
  methods: {
    getClientAuth() {
      this.$axios
        .get('bt_token')
        .then((res) => {
          this.brTreeToken = res.data.token
          this.setBraintreeClient()
        })
        .catch((err) => {
          this.error = err
        })
    },
    getStoredPayments() {
      const that = this
      this.$axios
        .get('checkout/brt_payments/user/' + this.type)
        .then((res) => {
          if (that.type === 'credit-card') {
            that.ccList = []
            res.data.forEach((row) => {
              if (!row.expired) that.ccList.push(row)
            })
            that.ccListShown = that.ccList.length > 0
            that.ccChecked = that.ccList.length > 0 ? res.data[0].token : null
            if (that.ccChecked) that.emitChoosePayment(that.ccChecked)
          } else if (that.type === 'paypal') {
            that.payPalAccountList = res.data
            that.payPalAccountListShown = that.payPalAccountList.length > 0
            that.payPalAccountChecked =
              that.payPalAccountList.length > 0 ? res.data[0].token : null
            if (that.payPalAccountChecked)
              that.emitChoosePayment(that.payPalAccountChecked)
          }
        })
        .catch((err) => {
          this.error = err
        })
    },
    emitChoosePayment(token) {
      this.$emit('choosePayment', this.type, token, this.id)
    },
    resetChosenPaymentMethod() {
      this.ccChecked = null
      this.payPalAccountChecked = null
      this.$emit('choosePayment', this.type, null, this.id)
    },
    setDefaultPaymentMethod() {
      if (this.type === 'credit-card' && this.ccList.length > 0) {
        this.ccChecked = this.ccList[0].token
        this.$emit('choosePayment', this.type, this.ccList[0].token, this.id)
      }

      if (this.type === 'paypal' && this.payPalAccountList.length > 0) {
        this.payPalAccountChecked = this.payPalAccountList[0].token
        this.$emit(
          'choosePayment',
          this.type,
          this.payPalAccountList[0].token,
          this.id
        )
      }
    },
    async setBraintreeClient() {
      const that = this
      const client = await import('braintree-web/client')
      client
        .create({
          authorization: this.brTreeToken,
        })
        .then(function (clientInstance) {
          that.clientInstance = clientInstance
          if (that.type === 'credit-card') {
            that.setHostedFieldsInstance()
            that.setThreeDSecureInstance()
          }
          if (that.type === 'paypal') that.setPaypalCheckoutInstance()
          if (that.localPaymentAcceptedType.includes(that.type))
            that.setLocalPaymentInstance()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    async setHostedFieldsInstance() {
      const that = this
      const hostedFields = await import('braintree-web/hosted-fields')
      hostedFields
        .create(this.setHostedFieldsOpts())
        .then(function (hostedFieldsInstance) {
          that.hostedFieldsInstance = hostedFieldsInstance
          that.setHostedFieldsEvents()
          that.setComponentInitialized()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    async setLocalPaymentInstance() {
      const that = this
      const localPayment = await import('braintree-web/local-payment')
      localPayment
        .create({
          client: that.clientInstance,
          merchantAccountId: process.env.VUE_APP_BRAINTREE_MERCHANT_ACCOUNT_ID,
        })
        .then(function (paymentInstance) {
          that.localPaymentInstance = paymentInstance
          that.setComponentInitialized()
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
            selector: '#' + this.brainTreeKey[this.type] + '-number',
            placeholder: '',
          },
          cvv: {
            selector: '#' + this.brainTreeKey[this.type] + '-cvv',
            placeholder: '',
          },
          expirationDate: {
            selector: '#' + this.brainTreeKey[this.type] + '-expiration',
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
          // skip adding classes if the field is
          // not valid, but is potentially valid
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
    async setThreeDSecureInstance() {
      const that = this
      const threeDSecure = await import('braintree-web/three-d-secure')
      threeDSecure
        .create({
          version: 2, // Will use 3DS 2 whenever possible
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
        amount: this.amount,
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
    createLocalPayment(type) {
      const fallbackUrl =
        process.env.VUE_APP_DOMAIN.slice(0, -1) + this.$router.currentRoute.path
      const that = this
      that.localPaymentInstance
        .startPayment({
          paymentType: type,
          amount: that.amount,
          fallback: {
            url: fallbackUrl,
            buttonText: 'Complete Payment',
          },
          currencyCode: 'EUR',
          shippingAddressRequired: true,
          email: that.$store.getters.getUserInfo.email,
          phone: that.billingAddress.phoneNumber,
          givenName: that.billingAddress.firstName,
          surname: that.billingAddress.lastName,
          address: {
            streetAddress: that.billingAddress.line1.substring(0, 50),
            extendedAddress: that.billingAddress.line2
              ? that.billingAddress.line2.substring(0, 50)
              : '',
            locality: that.billingAddress.city,
            postalCode: that.billingAddress.postalCode,
            region: that.billingAddress.province,
            countryCode: that.billingAddress.isoCode,
          },
          onPaymentStart(data, start) {
            // TODO add post to save data.paymentId
            // NOTE: It is critical here to store data.paymentId on your server
            //       so it can be mapped to a webhook sent by Braintree once the
            //       buyer completes their payment. See Start the payment
            //       section for details.

            // Call start to initiate the popup
            start()
          },
        })
        .then(function (payload) {
          that.setLocalPaymentValidationSuccess(payload)
        })
        .catch(function () {
          /* if (err.code === "LOCAL_PAYMENT_POPUP_CLOSED") {
            console.error("Customer closed Local Payment popup.");
          } else {
            console.error("Error!", err);
          } */
        })
    },
    verifyLocalPayment() {
      const that = this
      this.clientInstance.then(function (localPaymentInstance) {
        if (localPaymentInstance.hasTokenizationParams()) {
          localPaymentInstance
            .tokenize()
            .then(function (payload) {
              // console.log(payload);
              that.setLocalPaymentValidationSuccess(payload)
            })
            .catch(function () {
              // console.log(err);
              // that.setCCValidationError(err);
            })
        } else {
          // if this page should only be reached when
          // recovering from a mobile app switch,
          // display an error for not having the
          // correct params in the query string
        }
      })
    },
    setLocalPaymentValidationSuccess(payload) {
      this.$emit('verification-success', {
        id: this.id,
        type: 'nonce',
        value: payload.nonce,
        store: false,
      })
    },
    verifyVaultedCC(callback = null) {
      const that = this
      const paymentDetails = this.ccList.find(function (payment) {
        return payment.token === that.ccChecked
      })
      if (paymentDetails) {
        this.setThreeDSecureOpts(paymentDetails.nonce, paymentDetails.bin)
        this.validatingCC = true
        this.threeDSecureInstance
          .verifyCard(this.threeDSecureOpts)
          .then(function (payload) {
            that.setCCValidationSuccess(payload, that.ccChecked)
            if (callback) callback()
          })
          .catch(function (err) {
            that.setCCValidationError(err)
          })
      }
    },
    verifyCC() {
      this.validatingCC = true
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
    setCCValidationSuccess(payload, token = false) {
      this.validatingCC = false
      this.ccHasValidationError = false
      this.ccValidationErrorMsg = ''

      if (!payload.liabilityShifted) {
        // console.log("Liability did not shift", payload);
        return
      }

      // console.log("verification success:", payload);
      this.$emit('verification-success', {
        id: this.id,
        type: token === false ? 'nonce' : 'token',
        value: token === false ? payload.nonce : token,
        store: token === false ? this.storeCC : false,
      })
    },
    setCCValidationError(err) {
      this.validatingCC = false
      this.ccHasValidationError = true
      this.$emit('error')
      switch (err.code) {
        case 'HOSTED_FIELDS_FIELDS_EMPTY':
          // occurs when none of the fields are filled in
          this.ccValidationErrorMsg =
            'All fields are empty! Please fill out the form.'
          break
        case 'HOSTED_FIELDS_FIELDS_INVALID':
          // occurs when certain fields do not pass client side validation
          this.ccValidationErrorMsg =
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
          this.ccValidationErrorMsg =
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
          this.ccValidationErrorMsg = 'CVV did not pass verification'
          break
        case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
          // occurs for any other tokenization error on the server
          this.ccValidationErrorMsg =
            'Tokenization failed server side. Is the card valid?'
          break
        case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
          // occurs when the Braintree gateway cannot be contacted
          this.ccValidationErrorMsg = 'Network error occurred when tokenizing.'
          break
        default:
          this.ccValidationErrorMsg = 'Something bad happened! ' + err
      }
    },
    async setPaypalCheckoutInstance() {
      const that = this
      const payPalCheckout = await import('braintree-web/paypal-checkout')
      payPalCheckout
        .create({
          client: this.clientInstance,
        })
        .then(function (payPalCheckoutInstance) {
          that.payPalCheckoutInstance = payPalCheckoutInstance
          that.clientResetted = true
          that.setComponentInitialized()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    async setPayPalBtn(flow) {
      if (!document.querySelector('#pp-button')) return false
      const that = this
      const flowType = flow
      this.clientResetted = false
      document.querySelector('#pp-button').innerHTML = ''
      const payPalPaymentObj = {
        flow: flowType, // Required
        enableShippingAddress: true,
        shippingAddressEditable: false,
        shippingAddressOverride: {
          recipientName:
            that.billingAddress.firstName + ' ' + that.billingAddress.lastName,
          line1: that.billingAddress.line1.substring(0, 50),
          line2: that.billingAddress.line2
            ? that.billingAddress.line2.substring(0, 50)
            : '',
          city: that.billingAddress.city,
          countryCode: that.billingAddress.isoCode,
          postalCode: that.billingAddress.postalCode,
          state: that.billingAddress.province,
          phone: that.billingAddress.phoneNumber,
        },
      }

      if (flow === 'checkout') {
        payPalPaymentObj.amount = that.amount // Required
        payPalPaymentObj.currency = 'EUR' // Required
      }

      const payPal = await import('paypal-checkout')

      payPal.Button.render(
        {
          env:
            process.env.NODE_ENV === 'development' ? 'sandbox' : 'production',
          commit: true,
          style: {
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            height: 45,
            size: 'responsive',
          },

          payment() {
            return that.payPalCheckoutInstance.createPayment(payPalPaymentObj)
          },

          onAuthorize(data /*, actions */) {
            return that.payPalCheckoutInstance
              .tokenizePayment(data)
              .then(function (payload) {
                that.$emit('verification-success', {
                  id: that.id,
                  type: 'nonce',
                  value: payload.nonce,
                  store: that.storePayPalAccount,
                })
              })
              .catch(function (err) {
                that.error = err
              })
          },

          onCancel(/* data */) {
            // that.error =
            // "checkout.js payment cancelled" + JSON.stringify(data, 0, 2);
          },

          onError(err) {
            that.error = 'checkout.js error ' + err
          },
        },
        '#pp-button'
      )
        .then(function () {
          that.clientResetted = true
          that.setComponentInitialized()
        })
        .catch(function (err) {
          that.error = err
        })
    },
    togglePayPalButton() {
      this.payPalAccountListShown = !this.payPalAccountListShown
    },
    removePayPalAccount(index) {
      const that = this
      this.deletePaymentMethod(
        this.payPalAccountList[index].token,
        function (success) {
          if (success) {
            that.payPalAccountList.splice(index, 1)
            if (that.payPalAccountList.length === 0)
              that.payPalAccountListShown = false
          }
        }
      )
    },
    removeCC(index) {
      const that = this
      this.deletePaymentMethod(this.ccList[index].token, function (success) {
        if (success) {
          that.ccList.splice(index, 1)
          if (that.ccList.length === 0) that.ccListShown = false
        }
      })
    },
    deletePaymentMethod(token, callback = null) {
      this.$axios
        .delete(`checkout/brt_payments/${token}`)
        .then((res) => {
          callback(res.data.success)
        })
        .catch((err) => {
          this.error = err
        })
      this.resetChosenPaymentMethod()
    },
    normalizeCreditCardLabel(string) {
      return string
        .toLowerCase()
        .replace('american express', 'amex')
        .replace('diners club', 'diners')
    },
    setComponentInitialized() {
      this.clientInitialized = true
    },
  },
}
</script>

<style>
.toast {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 9999;
}

/* Braintree Hosted Fields styling classes*/
.braintree-hosted-fields-focused {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.braintree-hosted-fields-focused.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
