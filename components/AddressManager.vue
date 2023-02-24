<template>
  <div>
    <address-form
      v-if="editAddress"
      type="shipping"
      :default-address="selectedAddressId"
      :address="getSelectedAddress"
      :country-list="countryList"
      :confirm-edit-address="confirmEditAddress"
      :order-id="orderId"
      :disable-country-field="true"
      @insertedConfirmedAddress="setInsertedConfirmedAddress"
    />
    <b-form-group v-else class="m-0">
      <b-form-radio
        v-for="(address, index) in addressList"
        :key="index"
        v-model="selectedAddressId"
        class="mb-2"
        name="addess"
        :value="address.id"
      >
        <span>{{ radioAddressFormatting(address) }}</span>
        <b-link class="main-color p-0 ml-1 m-0" @click="editAddress = true"
          >Modifica</b-link
        >
      </b-form-radio>
    </b-form-group>
    <div class="text-right mt-3">
      <b-button variant="outline-secondary" class="mr-3" @click="hideModal"
        >Annulla</b-button
      >
      <b-button @click="confirm">Conferma</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressManager',
  props: {
    isoCode: {
      type: String,
      default: null,
    },
    addressId: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    confirmEditAddress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addressList: [],
      selectedAddressId: this.addressId,
      editAddress: false,
      countryList: [],
      error: null,
    }
  },
  computed: {
    getSelectedAddress() {
      let result
      const selectedAddressId = this.selectedAddressId
      this.addressList.forEach(function (element) {
        if (element.id === selectedAddressId) result = element
      })
      return result
    },
  },
  mounted() {
    this.getAddress()
    this.getCountryList()
  },
  methods: {
    getAddress() {
      this.$axios
        .get(`user-address?active=1`)
        .then((res) => {
          this.addressList = this.filterIsoCode(res.data.shipping)
        })
        .catch((err) => {
          this.error = err
        })
    },
    filterIsoCode(data) {
      const isoCode = this.isoCode
      const result = []
      Object.values(data).forEach(function (element) {
        if (element.isoCode === isoCode) result.push(element)
      })
      return result
    },
    radioAddressFormatting(address) {
      return this.addressFormatter(address, '')
    },
    addressFormatter(address, lineTerminator = '<br>') {
      const fullName = `${address.firstName} ${address.lastName}`
      const line2 = address.line2 ? `${address.line2}` : ''
      const company = address.company ? address.company : ''
      const taxCode = address.taxCode ? address.taxCode : ''
      const business = company + ' ' + taxCode
      const firstLine = `${fullName} ${line2} ${lineTerminator}`
      const secondLine = business !== ' ' ? `${business} ${lineTerminator}` : ''
      const thirdLine = `${address.line1} ${lineTerminator}`
      const province = address.province
        ? address.province
        : address.state
        ? address.state
        : ''
      const postalCode = address.postalCode
        ? address.postalCode
        : address.zipCode
        ? address.zipCode
        : ''
      const defaultAddress =
        address.default === '1' && lineTerminator !== '<br>'
          ? '(Predefinito)'
          : ''
      const fourthLine = `${address.city} ${province} ${postalCode} ${lineTerminator}`
      return `${firstLine} ${secondLine} ${thirdLine} ${fourthLine} ${address.countryName} ${defaultAddress}`
    },
    hideModal() {
      this.$root.$emit('bv::hide::modal', 'address-change', '#btnShow')
    },
    confirm() {
      // eslint-disable-next-line vue/no-mutating-props
      if (this.editAddress) this.confirmEditAddress = true
      else this.confirmChangeAddress()
    },
    confirmChangeAddress() {
      return this.$axios
        .post(`order/change-address`, {
          orderId: this.orderId,
          addressId: this.selectedAddressId,
        })
        .then((res) => {
          if (res.data.success || !res.data.success)
            this.emitChangeAddressConfirmed()
          this.hideModal()
        })
        .catch((err) => {
          this.error = err
        })
    },
    emitChangeAddressConfirmed() {
      this.$emit('changeAddressConfirmed', true)
    },
    getCountryList() {
      this.$axios
        .get(`country?active=1`)
        .then((res) => {
          this.countryList = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
    setInsertedConfirmedAddress(value) {
      this.selectedAddressId = value
      this.confirmChangeAddress()
    },
  },
}
</script>
