<template>
  <div class="px-3 pt-0">
    <div>
      <div class="d-flex flex-row">
        <h4 class="flex-fill">{{ title }}</h4>
        <span v-if="url">
          <b-link
            class="btn btn-sm main-background text-white font-weight-bold"
            :to="url"
            >VEDI TUTTI</b-link
          >
        </span>
      </div>
    </div>
    <div>
      <div
        ref="scroll-box"
        class="scroll-box"
        @mouseover="arrowButton = true"
        @mouseleave="arrowButton = false"
      >
        <slot />
      </div>
      <div v-show="arrowButton" @mouseover="arrowButton = true">
        <div v-show="arrowButtonLeft" class="left-arrow">
          <b-link @click="scrollLeft">
            <font-awesome-icon size="2x" icon="arrow-alt-circle-left" />
          </b-link>
        </div>
        <div v-show="arrowButtonRight" class="right-arrow">
          <b-link @click="scrollRight">
            <font-awesome-icon size="2x" icon="arrow-alt-circle-right" />
          </b-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollerElement',
  props: {
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      arrowButton: false,
      arrowButtonLeft: false,
      arrowButtonRight: true,
    }
  },
  mounted() {
    const scroll = this.$refs['scroll-box']
    scroll.addEventListener(
      'scroll',
      () => {
        this.arrowButtonLeft = this.$refs['scroll-box'].scrollLeft > 0
        this.arrowButtonRight =
          this.$refs['scroll-box'].scrollLeft <
          this.$refs['scroll-box'].scrollWidth -
            this.$refs['scroll-box'].clientWidth
      },
      false
    )
  },
  methods: {
    scrollLeft() {
      this.$refs['scroll-box'].scrollLeft -= innerWidth - 150
    },
    scrollRight() {
      this.$refs['scroll-box'].scrollLeft += innerWidth - 150
    },
  },
}
</script>

<style scoped>
.scroll-box {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  background: lightgrey;
}

::-webkit-scrollbar-track {
  background: lightgrey;
  border: 5px solid #fff;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 153, 0, 1);
  border: 5px solid #fff;
  border-radius: 8px;
  transition: 1s;
}

::-webkit-scrollbar-thumb:hover {
  border: 3px solid #fff;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:active {
  border: 1px solid #fff;
  border-radius: 8px;
}

.left-arrow {
  position: absolute;
  top: 50%;
  z-index: 2000;
}

.right-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  z-index: 2000;
}
</style>
