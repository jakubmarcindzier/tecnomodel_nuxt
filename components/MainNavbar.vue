<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-toggle target="nav-collapse" />
    <b-sidebar
      id="nav-collapse"
      is-nav
      sidebar-class="w-90"
      header-class="main-background"
      backdrop
      lazy
    >
      <template #header="{ hide }">
        <div class="px-3 py-2 w-100">
          <div class="text-right">
            <b-link @click="hide"
              ><font-awesome-icon icon="times" class="text-white"
            /></b-link>
          </div>
          <div style="max-width: 300px">
            <b-link to="/">
              <b-img
                fluid
                alt="Tecnomodel Logo"
                src="@/assets/tecnomodel_white_logo.png"
              />
            </b-link>
          </div>
        </div>
      </template>
      <div>
        <div class="px-3 py-2">
          <div class="mt-2 mb-3">
            <b-list-group>
              <b-list-group-item to="/f/promo"
                ><font-awesome-icon
                  icon="percentage"
                  class="main-color mr-2"
                />Offerte</b-list-group-item
              >
              <b-list-group-item to="/f/preorder"
                ><font-awesome-icon
                  icon="calendar-check"
                  class="main-color mr-2"
                />Articoli in preordine</b-list-group-item
              >
              <b-list-group-item to="/f/news">
                <font-awesome-icon icon="fire" class="main-color mr-2" />Nuovi
                arrivi</b-list-group-item
              >
              <b-list-group-item to="/f/used">
                <font-awesome-icon
                  icon="sync-alt"
                  class="main-color mr-2"
                />Usato</b-list-group-item
              >
              <b-list-group-item to="/f/discount"
                ><font-awesome-icon
                  icon="clock"
                  class="main-color mr-2"
                />Sconti a tempo</b-list-group-item
              >
            </b-list-group>
          </div>
          <div>
            <b-card
              header="Categorie"
              header-class="main-color h4"
              body-class="p-0 pt-1"
            >
              <div v-for="(category, idx) in categories" :key="idx">
                <b-button
                  v-if="
                    category.children &&
                    (Object.keys(category.children).length > 0 ||
                      category.children.length > 0)
                  "
                  v-b-toggle="'dropdown-' + idx"
                  variant="link"
                  class="text-dark text-decoration-none"
                >
                  {{ category.name }}
                  <font-awesome-icon icon="chevron-down" class="ml-2" />
                </b-button>
                <b-collapse
                  v-if="
                    category.children &&
                    (Object.keys(category.children).length > 0 ||
                      category.children.length > 0)
                  "
                  :id="'dropdown-' + idx"
                  class="px-2"
                >
                  <b-card>
                    <div v-for="(child, idy) in category.children" :key="idy">
                      <b-button
                        v-if="
                          child.children &&
                          (Object.keys(child.children).length > 0 ||
                            child.children.length > 0)
                        "
                        v-b-toggle="'dropdown-child' + idy"
                        variant="link"
                        class="pb-0 text-dark text-decoration-none"
                      >
                        {{ child.name }}
                        <font-awesome-icon icon="chevron-down" class="ml-2" />
                      </b-button>
                      <b-collapse
                        v-if="
                          child.children &&
                          (Object.keys(child.children).length > 0 ||
                            child.children.length > 0)
                        "
                        :id="'dropdown-child' + idy"
                      >
                        <b-card class="border-0" body-class="py-2">
                          <div
                            v-for="(innerChild, idz) in child.children"
                            :key="idz"
                          >
                            <b-button
                              variant="link"
                              class="px-0 text-dark text-decoration-none"
                              :to="
                                '/b/' +
                                toSeoUrl(category.name) +
                                '/' +
                                toSeoUrl(child.name) +
                                '/' +
                                toSeoUrl(innerChild.name) +
                                '/' +
                                idz
                              "
                            >
                              {{ innerChild.name }}
                            </b-button>
                          </div>
                        </b-card>
                      </b-collapse>
                      <b-button
                        v-else
                        variant="link"
                        class="text-dark text-decoration-none"
                        :to="
                          '/b/' +
                          toSeoUrl(category.name) +
                          '/' +
                          toSeoUrl(child.name) +
                          '/' +
                          idy
                        "
                      >
                        {{ child.name }}
                      </b-button>
                    </div>
                  </b-card>
                </b-collapse>
                <b-button
                  v-else
                  variant="link"
                  class="text-dark text-decoration-none"
                >
                  {{ category.name }}
                </b-button>
              </div>
            </b-card>
          </div>
        </div>
      </div>
    </b-sidebar>
    <b-collapse is-nav class="small" style="z-index: 1030">
      <b-navbar-nav>
        <b-nav-item to="/f/promo">Offerte</b-nav-item>
        <b-nav-item to="/f/preorder">Articoli in preordine</b-nav-item>
        <b-nav-item to="/f/news">Nuovi arrivi</b-nav-item>
        <b-nav-item to="/f/used">Usato</b-nav-item>
        <b-nav-item to="/f/discount">Sconti a tempo</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-button
            v-if="!isAuthenticated"
            to="/login"
            size="sm"
            variant="outline-secondary"
            >Accedi</b-button
          >
        </b-nav-form>
        <b-navbar-nav>
          <b-dropdown
            v-if="isAuthenticated"
            :text="'Ciao ' + getUserInfo.firstName"
            toggle-class="font-weight-bold"
            size="sm"
            variant="outline-secondary"
            right
            lazy
          >
            <b-dropdown-item to="/dashboard" class="small"
              >Il mio Account</b-dropdown-item
            >
            <b-dropdown-item to="/order" class="small">Ordini</b-dropdown-item>
            <b-dropdown-item to="/wishlist" class="small">
              Lista dei desideri</b-dropdown-item
            >
            <b-dropdown-item class="small" @click="logout"
              >Esci</b-dropdown-item
            >
          </b-dropdown>
        </b-navbar-nav>
        <b-nav-item v-if="!isAuthenticated" to="/register"
          >Registrati</b-nav-item
        >
        <b-nav-item to="/contacts">Contatti</b-nav-item>
        <b-nav-item :href="$config.clsBaseUrl"
          ><span class="main-color font-weight-bold"
            >Torna alla versione classica</span
          ></b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>
    <div class="ml-auto d-lg-none">
      <b-link
        v-if="isAuthenticated"
        v-b-toggle.user-sidebar
        class="text-decoration-none text-muted"
      >
        {{ getUserInfo.firstName }} <font-awesome-icon icon="user" size="2x" />
      </b-link>
      <b-link v-else class="text-decoration-none text-muted" to="/login">
        Accedi <font-awesome-icon icon="user" size="2x" />
      </b-link>
      <span class="text-decoration-none ml-3">
        <cart-sidebar-link class="text-muted" />
      </span>
      <b-sidebar
        v-if="isAuthenticated"
        id="user-sidebar"
        right
        backdrop
        sidebar-class="w-90"
        header-class="main-background"
      >
        <template #header="{ hide }">
          <b-container class="px-3 py-2 w-100 text-white">
            <b-row class="mb-2">
              <b-link class="text-white" @click="hide"
                ><font-awesome-icon icon="times"
              /></b-link>
            </b-row>
            <b-row>
              {{ 'Ciao ' + getUserInfo.firstName }}
            </b-row>
          </b-container>
        </template>
        <div class="px-3 py-2">
          <div class="mb-3">
            <b-list-group>
              <b-list-group-item to="/order"
                ><font-awesome-icon
                  icon="box-open"
                  class="main-color mr-2"
                />Ordini</b-list-group-item
              >
              <b-list-group-item to="/profile"
                ><font-awesome-icon icon="user" class="main-color mr-2" />Il mio
                profilo</b-list-group-item
              >
              <b-list-group-item to="/wishlist">
                <font-awesome-icon icon="heart" class="main-color mr-2" />Lista
                dei desideri</b-list-group-item
              >
              <b-list-group-item to="/payments">
                <font-awesome-icon
                  icon="credit-card"
                  class="main-color mr-2"
                />I miei pagamenti</b-list-group-item
              >
              <b-list-group-item to="/help-desk"
                ><font-awesome-icon
                  icon="headset"
                  class="main-color mr-2"
                />Aiuto</b-list-group-item
              >
              <b-list-group-item @click="logout"
                ><font-awesome-icon
                  icon="sign-out-alt"
                  class="main-color mr-2"
                />Esci</b-list-group-item
              >
            </b-list-group>
          </div>
        </div>
      </b-sidebar>
    </div>
  </b-navbar>
</template>

<script>
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'MainNavbar',
  mixins: [urlMixin],
  props: {
    categories: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    getUserInfo() {
      return this.$store.getters.getUserInfo
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    },
  },
}
</script>

<style>
.w-90 {
  width: 90%;
}
</style>
