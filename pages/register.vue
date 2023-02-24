<template>
  <section class="flex-fill mt-3">
    <b-container>
      <b-row>
        <b-col
          v-if="registered === false"
          cols="12"
          md="9"
          lg="5"
          class="mx-auto mb-3"
        >
          <b-card title="Crea un nuovo account">
            <b-form @submit.prevent="onSubmit">
              <b-form-group
                id="form-group-1"
                label="Nome:"
                label-for="form-group-1"
                class="mt-3"
              >
                <b-form-input
                  id="firstName"
                  v-model="$v.form.firstName.$model"
                  type="text"
                  required
                  :state="validateState('firstName')"
                  aria-describedby="firstName-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback id="firstName-feedback">
                  <span v-if="!$v.form.firstName.required"
                    >Campo richiesto</span
                  >
                  <span v-if="!$v.form.firstName.alpha"
                    >Solo caratteri alfabetici</span
                  >
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="form-group-2"
                label="Cognome:"
                label-for="form-group-2"
                class="mt-3"
              >
                <b-form-input
                  id="lastName"
                  v-model="$v.form.lastName.$model"
                  type="text"
                  required
                  :state="validateState('lastName')"
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
              <b-form-group
                id="form-group-3"
                label="Indirizzo email:"
                label-for="form-group-3"
                class="mt-3"
              >
                <b-form-input
                  id="email"
                  v-model="$v.form.email.$model"
                  type="email"
                  required
                  :state="validateState('email')"
                  aria-describedby="email-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback id="email-feedback">
                  <span v-if="!$v.form.email.required">Campo richiesto</span>
                  <span v-if="!$v.form.email.email">Email non valida</span>
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="form-group-4"
                label="Password:"
                label-for="form-group-4"
                class="mt-3"
              >
                <b-form-input
                  id="password"
                  v-model="$v.form.password.$model"
                  type="password"
                  required
                  :state="validateState('password')"
                  aria-describedby="password-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback id="password-feedback">
                  Inserire una password alfanumerica di almeno
                  {{ $v.form.password.$params.minLength.min }} caratteri
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="form-group-5"
                label="Verifica password:"
                label-for="form-group-5"
                class="mt-3"
              >
                <b-form-input
                  id="matchPassword"
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
              <b-form-group
                id="form-group-6"
                label="Paese:"
                label-for="form-group-6"
                class="mt-3"
              >
                <b-form-select
                  id="countryId"
                  v-model="$v.form.countryId.$model"
                  :options="countryList"
                  required
                  :state="validateState('countryId')"
                  aria-describedby="country-id-feedback"
                >
                </b-form-select>
                <b-form-invalid-feedback id="country-id-feedback">
                  Selezionare il paese
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group>
                <b-form-checkbox v-model="form.newsletter"
                  ><div class="text-justify">
                    <small
                      >Acconsento al trattamento dei miei dati personali per
                      l'invio di comunicazioni informative e promozionali
                      (newsletter), buoni sconto e offerte speciali, da parte di
                      Tecnomodel, riferiti a prodotti e servizi forniti da
                      Tecnomodel, via e-mail.</small
                    >
                  </div></b-form-checkbox
                >
              </b-form-group>
              <b-form-group>
                <b-button block type="submit">Crea il tuo account</b-button>
                <div class="text-justify mt-1">
                  <small>
                    Confermando acconsenti al trattamento dei dati in conformità
                    all'art. 13 del Regolamento (UE) 2016/679 (GDPR) nel testo
                    qui di seguito riportato</small
                  >
                </div>
              </b-form-group>
              <b-form-group>
                <div class="overflow-auto border rounded p-2 form-policy">
                  <privacy-policy-text />
                </div>
              </b-form-group>
              <b-form-group>
                <hr />
                Se disponi già di un account,
                <b-link to="/login">accedi</b-link>
              </b-form-group>
              <b-form-group>
                <b-alert
                  class="mt-2 mb-0"
                  :show="registrationError"
                  variant="danger"
                >
                  <small
                    ><strong>{{ registrationError }}</strong></small
                  >
                </b-alert>
              </b-form-group>
            </b-form>
          </b-card>
        </b-col>
        <b-col v-else cols="12" md="9" lg="6" class="mx-auto mb-3">
          <b-card title="Registrazione avvenuta con successo">
            <p>
              Il tuo account con indirizzo <strong>{{ form.email }}</strong> è
              stato creato con successo
            </p>
            <p>
              <b-link to="/login"
                >Clicca qui per effettuare il tuo primo login</b-link
              >
            </p>
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
  helpers,
} from 'vuelidate/lib/validators'
import { validationHelperMixin } from '@/mixins/validationHelperMixin'
import PrivacyPolicyText from '@/components/PrivacyPolicyText'

const alpha = helpers.regex('alpha', /^[a-z ]*$/i)

export default {
  name: 'RegisterPage',
  components: { PrivacyPolicyText },
  mixins: [validationMixin, validationHelperMixin],
  layout: 'minimal',
  middleware: 'isGuest',
  data() {
    return {
      error: null,
      registrationError: null,
      countryList: [],
      registered: false,
      form: {
        firstName: null,
        lastName: null,
        email: null,
        newsletter: true,
        password: null,
        matchPassword: null,
        countryId: null,
      },
    }
  },
  head() {
    return {
      title: this.$t('title.register'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  mounted() {
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
        required,
        minLength: minLength(8),
      },
      matchPassword: {
        required,
        sameAsPassword: sameAs('password'),
      },
      countryId: {
        required,
        numeric,
      },
    },
  },
  methods: {
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return false
      }
      this.registerUser()
    },
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
    registerUser() {
      const data = JSON.parse(JSON.stringify(this.form))
      delete data.matchPassword
      this.registrationError = null
      this.$axios
        .post('user', data)
        .then((res) => {
          if (res.data.success) {
            this.registered = res.data.success
          } else {
            this.registrationError =
              'Registrazione fallita a causa di un problema tecnico. Riprovare più tardi.'
          }
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>

<style>
.form-policy {
  height: 100px;
  border-color: #ced4da;
  background-color: #e9ecef;
  font-size: 12px;
  color: rgba(73, 80, 87, 0.8);
  opacity: 1;
  resize: none;
}
</style>
