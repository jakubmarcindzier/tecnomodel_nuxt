<template>
  <div style="display: flex">
    <div v-if="cover">
      <b-link
        class="text-decoration-none text-center"
        :to="coverUrl"
        :disabled="!coverUrl"
      >
        <b-card
          :class="coverClass ? coverClass : ''"
          class="border-0 m-3 image"
        >
          <b-card-text class="text-white pt-5 h3 cover-position">
            {{ textCover }}
          </b-card-text>
          <font-awesome-icon
            icon="arrow-alt-circle-right"
            class="text-white pt-4"
            size="4x"
          />
        </b-card>
      </b-link>
    </div>
    <div v-for="(item, index) in element" :key="index">
      <b-link
        class="text-decoration-none text-center"
        :to="item.to"
        :href="item.href"
        :target="item.href ? '_blank' : '_self'"
        :disabled="!item.to && !item.href"
      >
        <div
          class="card border-0 m-3 image"
          :class="bodyClass ? bodyClass : ''"
        >
          <div class="position-relative">
            <nuxt-img
              v-if="!!item.imageUrl"
              :src="item.imageUrl"
              fit="contain"
              format="webp"
              quality="90"
              background="white"
              sizes="lg:150px xl:250px"
              loading="lazy"
              :alt="item.text"
              class="card-img"
              width="250"
              height="300"
            />
            <div
              class="card-body"
              :class="!!item.imageUrl ? 'card-img-overlay' : ''"
            >
              <div class="pt-5 element-position">
                <span class="d-none d-lg-block">
                  <font-awesome-icon
                    v-if="item.icon"
                    :icon="item.icon"
                    class="main-color"
                    size="7x"
                  />
                </span>
                <span class="d-lg-none">
                  <font-awesome-icon
                    v-if="item.icon"
                    :icon="item.icon"
                    class="main-color"
                    size="2x"
                  />
                </span>
              </div>
              <p class="card-text d-lg-none">
                <b-button
                  :variant="buttonVariant ? buttonVariant : ''"
                  size="sm"
                  >{{ item.text }}</b-button
                >
              </p>
              <p class="card-text d-none d-lg-block">
                <b-button :variant="buttonVariant ? buttonVariant : ''">{{
                  item.text
                }}</b-button>
              </p>
            </div>
          </div>
        </div>
      </b-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceCardList',
  props: {
    element: {
      type: Array,
      default: () => [],
    },
    bodyClass: {
      type: String,
      default: null,
    },
    buttonVariant: {
      type: String,
      default: null,
    },
    cover: {
      type: Boolean,
      default: false,
    },
    textCover: {
      type: String,
      default: null,
    },
    coverClass: {
      type: String,
      default: null,
    },
    coverUrl: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped>
.image {
  width: 250px;
  height: 300px;
  object-fit: contain;
  transition: transform 0.2s;
}

.element-position {
  height: 200px;
}

@media screen and (max-width: 992px) {
  .image {
    width: 150px;
    height: 180px;
  }

  .cover-position {
    font-size: 1.25rem;
    padding-top: 1rem !important;
  }

  .element-position {
    height: 80px;
    padding-top: 0.5rem !important;
  }
}
</style>
