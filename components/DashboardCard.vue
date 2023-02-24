<template>
  <b-card :class="{ 'bg-card': link }" class="h-100">
    <b-link
      :to="'/' + link"
      class="card-block text-decoration-none"
      :disabled="link === ''"
    >
      <b-row class="text-dark h-100">
        <b-col sm="4" md="12" lg="2" class="m-auto text-center">
          <font-awesome-icon :icon="icon" size="3x" class="main-color" />
        </b-col>
        <b-col sm="8" md="12" lg="10" class="m-auto">
          <b-card-body :title="title">
            <b-card-text class="text-card">
              {{ text }}
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
    </b-link>
  </b-card>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.bg-card:hover {
  background-color: #f8f9fa;
}
.text-card {
  color: grey;
}
</style>
