<template>
  <b-container fluid class="p-2 justify-content-center">
    <b-row class="px-2 w-100">
      <b-col
        v-for="(col, idx) in category.cols"
        :key="idx"
        :cols="col.media === false ? 2 : ''"
        class="p-2"
      >
        <b-list-group
          v-for="(content, idy) in col.contents"
          v-show="col.media === false"
          :key="idy"
          flush
          class="mb-2"
        >
          <b-list-group-item
            class="m-0 p-1 border-0 text-capitalize text-dark font-weight-bold"
            :to="
              '/b/' +
              toSeoUrl(category.name) +
              '/' +
              toSeoUrl(content.name) +
              '/' +
              content.id
            "
            @click="emitCloseDropdown(category.id)"
            >{{ content.name }}
            <font-awesome-icon
              v-if="content.children.length > 0"
              icon="angle-right"
              class="text-muted"
            />
          </b-list-group-item>
          <b-list-group flush>
            <b-list-group-item
              v-for="(child, idz) in content.children"
              :key="idz"
              class="m-0 p-0 border-0 ml-3 text-capitalize text-muted font-weight-light"
              :to="
                '/b/' +
                toSeoUrl(category.name) +
                '/' +
                toSeoUrl(content.name) +
                '/' +
                toSeoUrl(child.name) +
                '/' +
                child.id
              "
              @click="emitCloseDropdown(category.id)"
              >{{ child.name }}
            </b-list-group-item>
          </b-list-group>
        </b-list-group>
        <div v-show="col.media === true" class="mb-2">
          <b-link v-if="col.banner_href" :href="col.banner_href">
            <b-img fluid :src="col.banner" />
          </b-link>
          <b-img
            v-if="!col.banner_href & (col.banner !== '')"
            fluid
            :src="col.banner"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { urlMixin } from '~/mixins/urlMixin'

export default {
  name: 'CategoryMenu',
  mixins: [urlMixin],
  props: {
    category: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    emitCloseDropdown(categoryId) {
      this.$emit('closeDropdown', categoryId)
    },
  },
}
</script>
