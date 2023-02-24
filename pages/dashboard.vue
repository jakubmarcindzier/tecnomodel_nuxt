<template>
  <section class="pt-4 px-4">
    <b-container fluid>
      <b-row>
        <b-col md="4" class="mb-3">
          <dashboard-card
            title="Il mio profilo"
            text="Visualizza i tuoi dati di profilo"
            icon="user"
            link="profile"
          />
        </b-col>
        <b-col md="4" class="mb-3">
          <dashboard-card
            title="I miei indirizzi"
            text="Potrai modificare gli indirizzi in fase di checkout"
            icon="map-location-dot"
          />
        </b-col>
        <b-col md="4" class="mb-3">
          <dashboard-card
            title="I miei pagamenti"
            text="Visualizza i tuoi pagamenti e crediti"
            icon="credit-card"
            link="payments"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" class="mb-3">
          <dashboard-card
            title="I miei ordini"
            text="Visualizza lo storico dei tuoi ordini e preordini"
            icon="box-open"
            link="order"
          />
        </b-col>
        <b-col md="4" class="mb-3">
          <dashboard-card
            title="Lista dei desideri"
            text="Visualizza la tua lista dei desideri"
            icon="heart"
            link="wishlist"
          />
        </b-col>
        <b-col md="4" class="mb-3">
          <dashboard-card
            title="Aiuto"
            text="Potrai consultare le FAQ e contattare il nostro Help Desk"
            icon="headset"
            link="helpDesk"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'DashboardPage',
  middleware: 'isAuthenticated',
  head() {
    return {
      title: this.$t('title.dashboard'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
}
</script>
