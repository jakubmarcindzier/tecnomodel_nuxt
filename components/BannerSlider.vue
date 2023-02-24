<template>
  <vueper-slides lazy :slide-ratio="1 / ratio" autoplay class="no-shadow">
    <vueper-slide
      v-for="(slide, i) in slides"
      :key="i"
      :image="slide.image"
      :video="slide.video"
      :link="slide.link"
      :style="ratio === 2 && slide.video ? 'background-color: lightgrey' : ''"
      :open-in-new="slide.link && slide.link.search('https://') > -1"
    />
  </vueper-slides>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
  name: 'BannerSlider',
  components: { VueperSlides, VueperSlide },
  data() {
    return {
      slides: [],
      ratio: 4,
    }
  },
  async fetch() {
    await this.getBanner()
  },
  mounted() {
    if (innerWidth < 576) this.ratio = 2
  },
  methods: {
    async getBanner() {
      await this.$axios
        .get('banner_schedule?filter=homepage_primary&schedule=1')
        .then((res) => {
          this.slides = this.getSlide(res.data)
        })
        .catch((err) => {
          this.error = err
        })
    },
    getSlide(data) {
      const result = []
      data.banners.forEach(function (element, index) {
        const row = {}
        if (data.hrefs[index]) row.link = data.hrefs[index]
        if (element.search('.mp4') > -1)
          row.video = {
            mp4: element,
            props: { autoplay: true, loop: true, controls: false, muted: true },
          }
        else row.image = element
        /* not works full screen https://github.com/antoniandre/vueper-slides/issues/157
           has need youtube thumbnail like https://i.ytimg.com/vi/-NUC4-SzZEM/mqdefault.jpg
           not stopping autoplay https://github.com/antoniandre/vueper-slides/issues/174
        if (row.link && (row.link.search('https://youtu') > -1 || row.link.search('https://www.youtube.com/') > -1)){
          row.video = {
            url: row.link,
            props: {
              allow: 'picture-in-picture'
            }
          }
          delete row.link
        } */
        result.push(row)
      })
      return result
    },
  },
}
</script>
