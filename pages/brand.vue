<template>
  <section class="pt-4 px-4">
    <b-container fluid>
      <b-breadcrumb class="bg-white border">
        <b-breadcrumb-item to="/">
          <font-awesome-icon class="main-color" icon="home" size="lg" />
        </b-breadcrumb-item>
        <b-breadcrumb-item active>Produttori</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row>
        <b-col class="text-center">
          <b-spinner
            v-if="
              Object.keys(brandList).length === 0 &&
              brandList.constructor === Object
            "
            style="width: 6rem; height: 6rem"
            class="mb-2"
          ></b-spinner>
          <b-button-group v-if="brandList" class="mb-3 flex-wrap">
            <b-button
              v-for="(element, char) in brandList"
              :key="char"
              :href="'#' + char"
              >{{ char }}
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <div
        v-for="(elements, char) in brandList"
        :id="char"
        :key="char"
        class="mb-4 anchor"
      >
        <b-card :header="char">
          <ul class="list-unstyled card-columns text-left">
            <li v-for="(element, id) in elements" :key="id">
              <p>
                <b-link
                  class="text-dark"
                  :to="'/p?brand' + element.name + '&id=' + element.id"
                  >{{ element.name }}
                  <b-badge>{{ element.itemsNumber }}</b-badge>
                </b-link>
              </p>
            </li>
          </ul>
        </b-card>
      </div>
    </b-container>
  </section>
</template>

<script>
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'BrandPage',
  mixins: [urlMixin],
  data() {
    return {
      brandList: {},
    }
  },
  async fetch() {
    await this.getBrand()
  },
  head() {
    return {
      title: this.$t('title.brand'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('description.brand'),
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.getUrl(),
        },
      ],
    }
  },
  methods: {
    async getBrand() {
      await this.$axios.get('brand').then((response) => {
        this.brandList = this.getSplitByFirstChar(response.data)
      })
    },
    getSplitByFirstChar(data) {
      const result = {}
      data.forEach(function (element) {
        const firstCharName = element.name.substring(0, 1).toUpperCase()
        if (result[firstCharName] === undefined) result[firstCharName] = []
        result[firstCharName].push(element)
      })
      return result
    },
  },
}
</script>

<style>
.card-columns {
  -webkit-column-count: 4;
  -moz-column-count: 4;
  column-count: 4;
}

.anchor {
  scroll-margin-top: 100px;
}

@media (min-width: 576px) and (max-width: 991.98px) {
  .card-columns {
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
  }

  .anchor {
    scroll-margin-top: 10px;
  }
}

@media (max-width: 575.98px) {
  .card-columns {
    -webkit-column-count: 1;
    -moz-column-count: 1;
    column-count: 1;
  }

  .anchor {
    scroll-margin-top: 10px;
  }
}
</style>
