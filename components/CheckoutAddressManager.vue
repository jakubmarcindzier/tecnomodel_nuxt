<template>
  <div>
    <div
      v-if="!edit || addAddress || editAddress"
      class="d-flex flex-row text-muted"
    >
      <div
        v-if="!defaultAddress || addAddress || editAddress"
        class="flex-fill"
      >
        <p v-if="billingAsShipping" class="text-muted m-0">
          Lo stesso di fatturazione
        </p>
        <div
          v-if="addAddress || editAddress"
          class="d-flex flex-row text-muted"
        >
          <span class="flex-fill"></span>
          <a class="main-color" href="#" @click.prevent="closeAddEditAddress"
            >Indietro</a
          >
        </div>
        <AddressForm
          v-if="!billingAsShipping"
          ref="addressForm"
          :type="type"
          :default-address="defaultAddress"
          :address="address"
          :country-list="countryList"
          @insertedAddress="addAddressRefreshAddressList"
          @mountedAddressForm="emitMountedAddressForm"
        />
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <p v-else class="m-0 flex-fill" v-html="addressString" />
      <!--eslint-enable-->
      <a
        v-if="defaultAddress && !addAddress && !editAddress"
        class="main-color"
        href="#"
        @click.prevent="toggleEdit"
        >Modifica</a
      >
    </div>
    <div v-if="edit && !addAddress && !editAddress">
      <div class="d-flex flex-row text-muted">
        <span class="flex-fill"></span>
        <a class="main-color" href="#" @click.prevent="toggleEdit">Chiudi</a>
      </div>
      <div>
        <p v-if="!defaultAddress" class="text-muted">
          {{ noAddressMessage }}
        </p>
        <b-form-group v-if="addressList.length > 0" class="m-0">
          <b-form-radio
            v-for="address in addressList"
            :key="address.id"
            v-model="addressPicked"
            :name="`${camelCaseTitle}RadioGroup${address.id}`"
            :value="address.id"
            class="mb-2"
            @change="enableAddressChangeButton(address.id)"
          >
            <span>{{ radioAddressFormatting(address) }}</span>
            <b-button
              class="main-color p-0 ml-1 m-0"
              variant="link"
              @click="updateAddress(address.id)"
              >Modifica</b-button
            >
            |
            <b-button
              class="main-color p-0 m-0"
              variant="link"
              @click="deleteAddress(address.id)"
              >Elimina</b-button
            >
          </b-form-radio>
        </b-form-group>
      </div>
      <div>
        <b-button
          href="#"
          class="main-color p-0 m-0"
          variant="link"
          @click.prevent="insertAddress"
          >Aggiungi un nuovo indirizzo</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutAddressManager',
  props: {
    id: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    step: {
      type: Number,
      default: null,
    },
    countryList: {
      type: Array,
      default: null,
    },
    addressList: {
      type: Array,
      default: null,
    },
    defaultAddress: {
      type: String,
      default: null,
    },
    billingAsShipping: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      env: process.env,
      edit: false,
      addAddress: false,
      editAddress: false,
      addAddressVisible: false,
      canChangeAddress: false,
      selectedCountry: null,
      addressPicked: null,
      addressString: '',
      addressForm: null,
      address: null,
    }
  },
  computed: {
    noAddressMessage() {
      return `Nessun ${this.title.toLowerCase()} salvato`
    },
    camelCaseTitle() {
      return this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    },
  },
  watch: {
    addAddress() {
      if (this.addAddress) this.emitAddAddressFormIsVisible()
      else this.emitAddAddressFormIsNotVisible()
    },
    editAddress() {
      if (this.editAddress) this.emitEditAddressFormIsVisible()
      else this.emitEditAddressFormIsNotVisible()
    },
    defaultAddress() {
      const foundAddress = this.searchAddressIndex(this.defaultAddress)
      if (foundAddress !== -1) {
        this.emitAddAddressFormIsNotVisible()
        this.emitEditAddressFormIsNotVisible()
        this.addressString = this.addressFormatter(
          this.addressList[foundAddress]
        )
        this.setAddressPickedData(this.addressList[foundAddress].id)
      } else {
        this.emitAddAddressFormIsVisible()
        this.emitEditAddressFormIsVisible()
      }
    },
    edit() {
      if (this.edit) this.emitAddressManagerIsVisible()
      else this.emitAddressManagerIsNotVisible()
    },
  },
  mounted() {
    if (this.defaultAddress === null) {
      this.emitAddAddressFormIsVisible()
      // this.emitEditAddressFormIsNotVisible();
    } else {
      this.emitAddAddressFormIsNotVisible()
      this.emitEditAddressFormIsNotVisible()
    }
  },
  methods: {
    emitAddAddressFormIsVisible() {
      this.$emit('checkoutAddAddressFormIsVisible', this.type)
    },
    emitAddAddressFormIsNotVisible() {
      this.$emit('checkoutAddAddressFormIsNotVisible', this.type)
    },
    emitEditAddressFormIsVisible() {
      this.$emit('checkoutEditAddressFormIsVisible', this.type)
    },
    emitEditAddressFormIsNotVisible() {
      this.$emit('checkoutEditAddressFormIsNotVisible', this.type)
    },
    emitMountedAddressForm() {
      this.addressForm = this.$refs.addressForm
      this.$emit('mountedAddressForm', this.$refs.addressForm, this.type)
    },
    emitAddressManagerIsVisible() {
      this.$emit('checkoutAddressManagerIsVisible', this.type)
    },
    emitAddressManagerIsNotVisible() {
      this.$emit('checkoutAddressManagerIsNotVisible', this.type)
    },
    toggleAddAddress() {
      this.addAddress = !this.addAddress
    },
    toggleEditAddress() {
      this.editAddress = !this.editAddress
    },
    closeAddEditAddress() {
      this.addAddress = false
      this.editAddress = false
      this.$emit('toggleBillingAsShipping', false)
    },
    addAddressRefreshAddressList(data) {
      const that = this
      const addressId = data.id
      const setDefault = Boolean(data.default)
      this.$emit('refreshAddressList', setDefault, function () {
        that.setAddressPickedData(addressId)
        that.updateDefaultAddress()
        that.closeEdit()
      })
    },
    insertAddress() {
      this.address = null
      this.addAddress = true
    },
    deleteAddress(addressId) {
      this.$axios
        .delete(`user-address`, {
          data: {
            address_id: Number(addressId),
            type: this.type,
          },
        })
        .then(() => {
          const setDefault = this.addressPicked === addressId
          const that = this
          this.$emit(
            'refreshAddressList',
            setDefault,
            function () {
              if (that.addressList.length === 0) {
                that.address = null
                that.setEditData(false)
              }
            },
            1
          )
        })
        .catch((err) => {
          this.error = err
        })
    },
    updateAddress(addressId) {
      const addressIndex = this.searchAddressIndex(addressId)
      this.address = this.addressList[addressIndex]
      this.editAddress = true
    },
    searchAddressIndex(addressId) {
      return this.addressList.findIndex((address) => address.id === addressId)
    },
    defaultAddressFormatting() {
      return this.addressFormatter(this.defaultAddress)
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
    toggleEdit() {
      if (this.addressList.length === 0 && !this.addAddressVisible)
        this.setAddAddressVisibleData(true)
      this.setEditData(!this.edit)
      this.setCanChangeAddress(false)
      if (this.edit === true) this.$emit('toggleAddressEdit', this.step)
      else this.$emit('toggleAddressEdit')
    },
    enableAddressChangeButton(index) {
      this.setAddressPickedData(index)
      this.setCanChangeAddress(true)
    },
    updateDefaultAddress() {
      if (this.defaultAddress) {
        const foundAddress = this.searchAddressIndex(this.defaultAddress)
        this.addressString = this.addressFormatter(
          this.addressList[foundAddress]
        )
      }
      this.$emit('changeDefaultAddress', this.type, this.addressPicked)
    },
    closeEdit() {
      this.setEditData(false)
      this.setAddAddressData(false)
      this.setEditAddressData(false)
    },
    setEditData(value) {
      this.edit = value
    },
    setAddAddressData(value) {
      this.addAddress = value
    },
    setEditAddressData(value) {
      this.editAddress = value
    },
    setAddAddressVisibleData(value) {
      this.addAddressVisible = value
    },
    setCanChangeAddress(value) {
      this.canChangeAddress = value
    },
    setAddressPickedData(value) {
      this.addressPicked = value
    },
  },
}
</script>
