<template>
  <section class="flex-fill mt-3">
    <b-container fluid>
      <b-row>
        <b-col cols="12" lg="6" class="mb-3">
          <b-card
            header="Login"
            header-class="bg-white main-color text-uppercase font-weight-bold"
          >
            <b-card-text class="lead"
              >Sono già stato vostro cliente
            </b-card-text>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                class="form-control"
                autocomplete="email"
              />
            </div>
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                name="password"
                class="form-control"
                autocomplete="current-password"
              />
              <a
                v-b-modal.forgot-password
                class="text-decoration-none"
                @click="recoveryPasswordRequested = false"
              >
                <small class="text-muted">Hai dimenticato la password?</small>
              </a>
            </div>
            <div class="form-group">
              <button
                type="submit"
                class="btn main-background text-white"
                @click="login"
              >
                Accedi
                <font-awesome-icon icon="sign-in-alt" />
              </button>
              <div class="mt-4">
                <b-alert v-if="error" show fade variant="danger">
                  {{ error }}
                </b-alert>
              </div>
            </div>
          </b-card>
        </b-col>
        <b-col cols="12" lg="6" class="mb-3">
          <b-card
            header="Nuovo account"
            header-class="bg-white main-color text-uppercase font-weight-bold"
          >
            <b-card-text class="lead">Sono un nuovo cliente</b-card-text>

            <small class="text-muted">
              Creando un nuovo account su
              <strong>tecnomodel-treni.it</strong> sarai in grado di acquistare
              velocemente, essere sempre aggiornato sullo stato dei tuoi ordini
              e prenotazioni, e rivedere la cronologia degli ordini che hai
              effettuato.
            </small>

            <div class="mt-3">
              <b-link to="/register" class="btn main-background text-white">
                Registrati
              </b-link>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      id="forgot-password"
      ref="forgot-password"
      size="lg"
      centered
      title="Recupero password"
      hide-footer
    >
      <div class="my-4">
        <template v-if="!recoveryPasswordRequested">
          <b-form-group
            :for="`$id('email')`"
            label="Per recuperare la tua password, immetti l'indirizzo email del tuo
          account Tecnomodel"
            description="Ti sarà inviata automaticamente un'email con i dati per accesso"
          >
            <b-form-input
              :id="`$id('email')`"
              v-model="$v.email.$model"
              name="email"
              :state="$v.email.$dirty ? !$v.email.$error : null"
              placeholder="email"
              type="email"
            ></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-button @click="recoveryPassword">Richiedi password</b-button>
          </b-form-group>
        </template>
        <b-alert v-else show variant="success"
          >Richiesta inviata, a breve riceverai l'email per il ripristino della
          password.
        </b-alert>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import { cartMixin } from '@/mixins/cartMixin'
const autoLoginToken = '!m1YM78eJ1LtoKrkVLxM'

export default {
  name: 'LoginPage',
  mixins: [validationMixin, cartMixin],
  middleware: 'isGuest',
  data() {
    return {
      email: '',
      password: '',
      recoveryPasswordRequested: false,
      error: null,
    }
  },
  head() {
    return {
      title: this.$t('title.login'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  created() {
    this.autoLogin()
  },
  validations: {
    email: {
      email,
      required,
    },
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        await this.$router.push('/')
      } catch (err) {
        if (err.response && err.response.data) this.error = err.response.data
      }
    },
    recoveryPassword() {
      this.recoveryPasswordRequested = true
      this.$axios
        .post('forgot-password', {
          email: this.email,
        })
        .catch((err) => {
          this.error = err.response.data
        })
    },
    autoLogin() {
      if (
        this.$route.query.t ===
          Buffer.from(autoLoginToken).toString('base64') &&
        this.$route.query.e &&
        this.$route.query.p
      ) {
        this.email = Buffer.from(this.$route.query.e, 'base64').toString()
        this.password = Buffer.from(this.$route.query.p, 'base64').toString()
        this.login()
      }
    },
  },
}
</script>
