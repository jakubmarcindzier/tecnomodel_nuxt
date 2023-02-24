<template>
  <section class="flex-fill mt-3">
    <b-container>
      <b-row>
        <b-col cols="12" md="9" lg="5" class="mx-auto mb-3">
          <b-card title="Profilo">
            <b-form-group label="Nome:">
              <b-form-input
                v-model="$v.form.firstName.$model"
                type="text"
                required
                :state="!$v.form.firstName.$error"
                aria-describedby="firstName-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="firstName-feedback">
                <span v-if="!$v.form.firstName.required">Campo richiesto</span>
                <span v-if="!$v.form.firstName.alpha"
                  >Solo caratteri alfabetici</span
                >
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Cognome:">
              <b-form-input
                v-model="$v.form.lastName.$model"
                type="text"
                required
                :state="!$v.form.lastName.$error"
                aria-describedby="lastName-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="lastName-feedback">
                <span v-if="!$v.form.lastName.required">Campo richiesto</span>
                <span v-if="!$v.form.lastName.alpha"
                  >Solo caratteri alfabetici</span
                >
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Indirizzo email:">
              <b-form-input
                v-model="$v.form.email.$model"
                type="email"
                required
                :state="!$v.form.email.$error"
                aria-describedby="email-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="email-feedback">
                <span v-if="!$v.form.email.required">Campo richiesto</span>
                <span v-if="!$v.form.email.email">Email non valida</span>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-form-checkbox v-model="form.newsletter"
                >Ricezione newsletter
              </b-form-checkbox>
            </b-form-group>
            <b-form-group>
              <b-form-checkbox v-model="editPassword" switch
                >Modifica Password
              </b-form-checkbox>
            </b-form-group>
            <template v-if="editPassword">
              <b-form-group label="Password:">
                <b-form-input
                  v-model="$v.form.password.$model"
                  type="password"
                  :state="validateState('password')"
                  aria-describedby="password-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback id="password-feedback">
                  Inserire una password alfanumerica di almeno
                  {{ $v.form.password.$params.minLength.min }} caratteri
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Verifica password:">
                <b-form-input
                  v-model="$v.form.matchPassword.$model"
                  type="password"
                  required
                  :state="validateState('matchPassword')"
                  aria-describedby="match-password-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback id="match-password-feedback">
                  Le due password non coincidono
                </b-form-invalid-feedback>
              </b-form-group>
            </template>
            <b-form-group label="Paese:">
              <b-form-select
                v-model.number="$v.form.countryId.$model"
                :options="countryList"
                required
                :state="!$v.form.countryId.$error"
                aria-describedby="country-id-feedback"
              >
              </b-form-select>
              <b-form-invalid-feedback id="country-id-feedback">
                Selezionare il paese
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-button block :disabled="$v.form.$invalid" @click="updateUser"
                >Modifica Account</b-button
              >
            </b-form-group>
            <b-alert :show="registrationError" variant="danger">
              <strong>{{ registrationError }}</strong>
            </b-alert>
            <b-alert :show="registered" variant="success">
              <strong>dati modificati con successo</strong>
            </b-alert>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  email,
  sameAs,
  numeric,
  requiredIf,
  helpers,
} from 'vuelidate/lib/validators'
import { validationHelperMixin } from '@/mixins/validationHelperMixin'

const alpha = helpers.regex('alpha', /^[a-z ]*$/i)

export default {
  name: 'ProfilePage',
  mixins: [validationMixin, validationHelperMixin],
  middleware: 'isAuthenticated',
  data() {
    return {
      error: null,
      registrationError: null,
      countryList: [],
      registered: false,
      editPassword: false,
      form: {
        firstName: null,
        lastName: null,
        email: null,
        newsletter: null,
        password: null,
        matchPassword: null,
        countryId: null,
      },
    }
  },
  head() {
    return {
      title: this.$t('title.profile'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  watch: {
    editPassword(value) {
      if (value) this.resetForm()
    },
  },
  beforeMount() {
    this.getUser()
    this.getCountryList()
  },
  validations: {
    form: {
      firstName: {
        required,
        alpha,
      },
      lastName: {
        required,
        alpha,
      },
      email: {
        required,
        email,
      },
      password: {
        required: requiredIf(function () {
          return this.editPassword
        }),
        minLength: minLength(8),
      },
      matchPassword: {
        required: requiredIf(function () {
          return this.editPassword
        }),
        sameAsPassword: sameAs('password'),
      },
      countryId: {
        required,
        numeric,
      },
    },
  },
  methods: {
    getCountryList() {
      this.$axios
        .get('user/country?active=1')
        .then((res) => {
          this.countryList = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
    updateUser() {
      const data = JSON.parse(JSON.stringify(this.form))
      delete data.matchPassword
      if (!this.editPassword) delete data.password
      this.registrationError = null
      this.$axios
        .put('user/account', data)
        .then((res) => {
          this.registered = res.data.success
          this.editPassword = false
        })
        .catch((err) => {
          this.error = err
        })
    },
    getUser() {
      return this.$axios
        .get('user/account')
        .then((res) => {
          this.form.firstName = res.data.firstName
          this.form.lastName = res.data.lastName
          this.form.email = res.data.email
          this.form.newsletter = res.data.newsletter === '1'
          this.form.countryId = res.data.countryId
        })
        .catch((err) => {
          this.error = err
        })
    },
    resetForm() {
      this.form.password = null
      this.$v.form.password.$reset()
      this.form.matchPassword = null
      this.$v.form.matchPassword.$reset()
    },
  },
}
</script>
