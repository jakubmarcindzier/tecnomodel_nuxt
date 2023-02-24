<template>
  <form :id="$id('AddressForm')" method="post">
    <b-form-group class="mb-0">
      <b-form-checkbox
        v-if="type === 'billing'"
        v-model="businessUser"
        class="mb-2"
        switch
        @change="toggleBusinessUser"
      >
        Acquista come azienda
        {{ businessUser ? '(Sarà emessa una fattura)' : '' }}
      </b-form-checkbox>
      <b-form-row>
        <b-col>
          <b-form-group label="Paese:" :for="$id('CountryList')">
            <b-form-select
              :id="$id('CountryList')"
              v-model="$v.form.paesi_id.$model"
              :options="countryList"
              name="paesi_id"
              :state="$v.form.paesi_id.$dirty ? !$v.form.paesi_id.$error : null"
              :aria-describedby="$id('paesi-id-feedback')"
              :disabled="disableCountryField"
            ></b-form-select>
            <b-form-invalid-feedback :id="$id('paesi-id-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row v-if="businessUser">
        <b-col cols="12" md="6">
          <b-form-group label="Ragione Sociale:" :for="$id('Company')">
            <b-form-input
              :id="$id('Company')"
              v-model="$v.form.company.$model"
              name="company"
              :state="$v.form.company.$dirty ? !$v.form.company.$error : null"
              :aria-describedby="$id('company-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('company-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col v-if="businessUser && type === 'billing'" cols="12" md="6">
          <b-form-group label="Partita Iva:" :for="$id('taxCode')">
            <b-form-input
              :id="$id('TaxCode')"
              v-model="$v.form.taxCode.$model"
              name="taxCode"
              :state="$v.form.taxCode.$dirty ? !$v.form.taxCode.$error : null"
              :aria-describedby="$id('taxCode-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('taxCode-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-form-row>
      <template
        v-if="businessUser && type === 'billing' && form.paesi_id === '102'"
      >
        <b-form-row>
          <b-col>
            <b-form-checkbox
              v-model="companyWithPec"
              class="mb-2"
              switch
              @change="toggleCompanyWithPec"
            >
              Non ho un codice SDI, ho un indirizzo PEC
            </b-form-checkbox>
          </b-col>
        </b-form-row>
        <b-form-row v-if="!companyWithPec">
          <b-col>
            <b-form-group label="Codice SDI:" :for="$id('SdiCode')">
              <b-form-input
                :id="$id('SdiCode')"
                v-model="$v.form.sdiCode.$model"
                name="sdiCode"
                :state="$v.form.sdiCode.$dirty ? !$v.form.sdiCode.$error : null"
                :aria-describedby="$id('sdiCode-feedback')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row v-else>
          <b-col>
            <b-form-group label="Indirizzo PEC:" :for="$id('PecAddress')">
              <b-form-input
                :id="$id('PecAddress')"
                v-model="$v.form.pecAddress.$model"
                name="pecAddress"
                :state="
                  $v.form.pecAddress.$dirty ? !$v.form.pecAddress.$error : null
                "
                :aria-describedby="$id('pecAddress-feedback')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
      </template>
      <b-form-row>
        <b-col cols="12" md="6">
          <b-form-group label="Nome:" :for="$id('FirstName')">
            <b-form-input
              :id="$id('FirstName')"
              v-model="$v.form.firstName.$model"
              name="firstName"
              :state="
                $v.form.firstName.$dirty ? !$v.form.firstName.$error : null
              "
              :aria-describedby="$id('first-name-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('first-name-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6">
          <b-form-group label="Cognome:" :for="$id('LastName')">
            <b-form-input
              :id="$id('LastName')"
              v-model="$v.form.lastName.$model"
              name="lastName"
              :state="$v.form.lastName.$dirty ? !$v.form.lastName.$error : null"
              :aria-describedby="$id('last-name-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('last-name-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-form-group label="Indirizzo:" :for="$id('Line1')">
            <b-form-input
              :id="$id('Line1')"
              v-model="$v.form.line1.$model"
              name="line1"
              :state="$v.form.line1.$dirty ? !$v.form.line1.$error : null"
              :aria-describedby="$id('line1-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('line1-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :for="$id('Line2')">
            <b-form-input
              :id="$id('Line2')"
              v-model="$v.form.line2.$model"
              name="line2"
              :state="$v.form.line2.$dirty ? !$v.form.line2.$error : null"
              :aria-describedby="$id('line2-feedback')"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-form-group label="Città:" :for="$id('City')">
            <b-form-input
              :id="$id('City')"
              v-model="$v.form.city.$model"
              name="city"
              :state="$v.form.city.$dirty ? !$v.form.city.$error : null"
              :aria-describedby="$id('city-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('city-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col cols="12" md="6">
          <b-form-group label="Provincia:" :for="$id('Province')">
            <b-form-input
              :id="$id('Province')"
              v-model="$v.form.province.$model"
              name="province"
              :state="$v.form.province.$dirty ? !$v.form.province.$error : null"
              :aria-describedby="$id('province-feedback')"
              maxlength="2"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('province-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6">
          <b-form-group label="CAP:" :for="$id('PostalCode')">
            <b-form-input
              :id="$id('PostalCode')"
              v-model="$v.form.postalCode.$model"
              name="postalCode"
              :state="
                $v.form.postalCode.$dirty ? !$v.form.postalCode.$error : null
              "
              :aria-describedby="$id('postalCode-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('postalCode-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-form-group label="Telefono:" :for="$id('PhoneNumber')">
            <b-form-input
              :id="$id('PhoneNumber')"
              v-model="$v.form.phoneNumber.$model"
              name="phoneNumber"
              :state="
                $v.form.phoneNumber.$dirty ? !$v.form.phoneNumber.$error : null
              "
              :aria-describedby="$id('phoneNumber-feedback')"
            ></b-form-input>
            <b-form-invalid-feedback :id="$id('phoneNumber-feedback')">
              Campo obbligatorio
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-group v-if="defaultAddress">
        <b-form-checkbox switch @change="toggleDefault">
          Utilizza come indirizzo di default
        </b-form-checkbox>
      </b-form-group>
    </b-form-group>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  requiredIf,
  alpha,
  maxLength,
  minLength,
  email,
  helpers,
} from 'vuelidate/lib/validators'
import { checkVAT, countries } from 'jsvat'
import Vue from 'vue'
import VueUniqueId from 'vue-unique-id'
Vue.use(VueUniqueId)
const phone = helpers.regex(
  'phone',
  /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
)
const { postcodeValidator } = require('postcode-validator')

export default {
  name: 'AddressForm',
  mixins: [validationMixin],
  props: {
    type: {
      type: String,
      default: null,
    },
    defaultAddress: {
      type: String,
      default: null,
    },
    countryList: {
      type: Array,
      default: null,
    },
    selectedCountry: {
      type: String,
      default: null,
    },
    address: {
      type: Object,
      default: null,
    },
    confirmEditAddress: {
      type: Boolean,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    disableCountryField: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      form: {
        firstName: this.$store.getters.getUserInfo.firstName,
        lastName: this.$store.getters.getUserInfo.lastName,
        line1: null,
        line2: null,
        company: null,
        taxCode: null,
        city: null,
        province: null,
        postalCode: null,
        phoneNumber: null,
        pecAddress: null,
        sdiCode: null,
        default: null,
        paesi_id: this.$store.getters.getUserInfo.countryId,
      },
      businessUser: false,
      companyWithPec: false,
      showAlert: false,
    }
  },
  watch: {
    confirmEditAddress(value) {
      if (value) this.touch()
    },
  },
  mounted() {
    this.$emit('mountedAddressForm')
    this.$v.form.$reset()
    if (!this.address) {
      this.form.default = Number(!this.defaultAddress)
    } else {
      Object.assign(this.form, this.address)
      delete this.form.id
      this.form.default = this.address.default ? this.address.default : 0
      if (this.address.taxCode || this.address.company) this.businessUser = true
      this.$v.form.$touch()
    }
  },
  methods: {
    toggleBusinessUser() {
      this.$v.form.$reset()
      if (this.businessUser) {
        this.form.company = null
        this.form.taxCode = null
        this.form.pecAddress = null
        this.form.sdiCode = null
      }
    },
    toggleCompanyWithPec() {
      if (this.companyWithPec) this.form.sdiCode = null
      else this.form.pecAddress = null
    },
    toggleDefault() {
      this.form.default = this.form.default === 0 ? 1 : 0
    },
    setForm(data) {
      Object.assign(this.form, data)
    },
    touch() {
      const that = this
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return false
      }
      this.insertAddress(function () {
        that.$v.form.$reset()
      })
      return true
    },
    reset() {
      this.$v.form.$reset()
    },
    insertAddress(callback) {
      const requestBody = this.form
      if (this.address && this.address.id) requestBody.id = this.address.id
      requestBody.paesi_id = parseInt(requestBody.paesi_id)
      if (requestBody.postalCode)
        requestBody.postalCode = requestBody.postalCode.toUpperCase()
      if (requestBody.zipCode)
        requestBody.zipCode = requestBody.zipCode.toUpperCase()
      if (requestBody.pecAddress === '') requestBody.pecAddress = null
      if (this.type === 'shipping') {
        requestBody.taxCode = null
        requestBody.pecAddress = null
        requestBody.sdiCode = null
        requestBody.ipaCode = null
      }
      const that = this
      let urlEndpoint = `user-address?type=${this.type}`
      if (this.orderId) urlEndpoint += `&orderId=${this.orderId}`
      this.$axios
        .post(urlEndpoint, requestBody)
        .then((res) => {
          if (!that.confirmEditAddress)
            this.getAddress(res.data.id, function (addressData) {
              that.$emit('insertedAddress', addressData)
              callback()
            })
          else that.$emit('insertedConfirmedAddress', res.data.id)
        })
        .catch((err) => {
          this.error = err
        })
    },
    getAddress(id, callback) {
      this.$axios
        .get(`address/${id}`)
        .then((res) => {
          callback(res.data)
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
  validations: {
    form: {
      firstName: {
        required,
        minLength: minLength(2),
      },
      lastName: {
        required,
        minLength: minLength(2),
      },
      line1: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(50),
      },
      line2: {
        maxLength: maxLength(50),
      },
      company: {
        required: requiredIf(function () {
          return this.businessUser
        }),
      },
      taxCode: {
        required: requiredIf(function () {
          return this.businessUser
        }),
        vatValidator(value) {
          if (!this.businessUser) return true
          if (!checkVAT(value, countries).isValid) return false
          return this.$axios
            .post(`vat-validator`, {
              value,
            })
            .then((res) => {
              return res.data.valid
            })
        },
      },
      city: {
        required,
        minLength: minLength(3),
      },
      province: {
        required,
        alpha,
        maxLength: maxLength(2),
        minLength: minLength(2),
      },
      postalCode: {
        required,
        postalCode(postalCode) {
          if (this.countryList.length === 0) return true
          // TODO prevent postcodeValidator error if isoCode is unknown
          if (
            this.countryList.filter((x) => x.value === this.form.paesi_id)[0] &&
            this.countryList.filter((x) => x.value === this.form.paesi_id)[0]
              .isoCode !== 'AE' &&
            this.countryList.filter((x) => x.value === this.form.paesi_id)[0]
              .isoCode !== 'HK' &&
            this.countryList.filter((x) => x.value === this.form.paesi_id)[0]
              .isoCode !== 'IC'
          )
            return postcodeValidator(
              postalCode,
              this.countryList.filter((x) => x.value === this.form.paesi_id)[0]
                .isoCode
            )
          return true
        },
      },
      phoneNumber: {
        required,
        phone,
      },
      pecAddress: {
        email,
      },
      sdiCode: {
        maxLength: maxLength(7),
        minLength: minLength(7),
      },
      paesi_id: {
        required,
      },
      default: {
        required,
      },
    },
  },
}
</script>
