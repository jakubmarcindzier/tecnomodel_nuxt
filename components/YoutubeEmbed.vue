<template>
  <b-embed
    type="iframe"
    aspect="16by9"
    :src="`https://www.youtube.com/embed/${youtubeId}?rel=0`"
    allowfullscreen
    :title="altPreview"
    :srcdoc="
      lazy &&
      `<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${youtubeId}?autoplay=1><img src=https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg alt='${altPreview}'><span>▶</span></a>`
    "
  ></b-embed>
</template>

<script>
export default {
  name: 'YoutubeEmbed',
  props: {
    lazy: {
      type: Boolean,
      default: false,
    },
    youtubeId: {
      type: String,
      default: '',
    },
    altPreview: {
      type: String,
      default: '',
    },
  },
}
</script>
