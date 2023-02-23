<template lang="pug">
  .sub-panel
    .setting-type
      label {{$t('builder.yourFonts')}}
      ul.font-list.mt-2
        li(v-for="font in pageConfig.settings.fontFamilies") {{ font }}
    .setting-type.mt-4
      label {{$t('builder.AddMoreGoogleFonts')}}
      multiselect.mt-2(
        v-model="selectedFont",
        label="family",
        :options="uniqueGoogleFonts",
        :show-labels="false",
        :placeholder="$t('builder.selectFontFamily')"
      )
      v-btn.ma-0.mt-2(color="success", small, round, @click="loadFont") {{$t('builder.addFont')}}
</template>

<script>
import axios from 'axios'

export default {
  props: ['pageConfig'],
  data () {
    return {
      googleFonts: [],
      selectedFont: ''
    }
  },
  mounted () {
    this.loadGoogleFonts()
  },
  methods: {
    loadGoogleFonts () {
      axios.get('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyCET_JY4tV00Wk7Yrn34ZSKWUlk-4hI3C8').then((res) => {
        this.googleFonts = res.data.items
        // console.log('google fonts loaded')
      })
    },
    loadFont () {
      if (this.selectedFont) {
        global.toastr['success'](this.$t('builder.fontAddedMessage'), this.$t('general.success'))
        this.pageConfig.settings.fontFamilies.push(this.selectedFont.family)

        this.$nextTick(() => {
          this.$eventHub.$emit('load-fonts', this.pageConfig.settings.fontFamilies)
        })
      }
    }
  },
  computed: {
    uniqueGoogleFonts () {
      return this.googleFonts.filter((el) => {
        return this.pageConfig.settings.fontFamilies.indexOf(el.family) < 0
      })
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
  .page-builder {
    .multiselect__option {
      width: 100%;
    }

    .font-list {
      li {
        margin-bottom: 5px;
        font-size: 14px;
        padding: 0;
        background: #9ba9c438;
        padding: 3px 5px;
        border-radius: 4px;
      }
    }
  }
</style>
