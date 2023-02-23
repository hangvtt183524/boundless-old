<template lang="pug">
  .visited-sites
    .form-card.x3
      v-layout(row)
        v-flex.mb-3(xs12)
          h4.card-title {{ $t('monitoring.visitedSites') }}
      v-layout(row, align-end)
        .chart-container(xs6, md2 v-for="(item, index) in siteData" :key="index")
          .chart
            .chart-bar(
              :style="'height: ' + (item.total * 115 / maxTotal) + 'px; background:' + lineColors[index] "
            )
          p.medium {{ item.total }}
          .chart-title {{ item.site__name }}
</template>

<script>
import { rgbToHex, hexToRgb } from '@/utils/functions'
import * as $ from 'jquery'

export default {
  name: 'VisitedSites',
  props: {
    sites: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created () {
    this.lineColors = [0, 1, 2, 3, 4].map(i => {
      const rgbInfo1 = hexToRgb('#4b83f0')
      const rgbInfo2 = hexToRgb('#65d866')
      const newRGBInfo = Object.assign({}, rgbInfo1)

      if (rgbInfo1 && rgbInfo2) {
        newRGBInfo.r = Math.min(rgbInfo1.r, rgbInfo2.r) + parseInt(Math.abs(rgbInfo1.r - rgbInfo2.r) / 5 * i)
        newRGBInfo.g = Math.min(rgbInfo1.g, rgbInfo2.g) + parseInt(Math.abs(rgbInfo1.g - rgbInfo2.g) / 5 * i)
        newRGBInfo.b = Math.min(rgbInfo1.b, rgbInfo2.b) + parseInt(Math.abs(rgbInfo1.b - rgbInfo2.b) / 5 * i)
      }

      return rgbToHex(newRGBInfo.r, newRGBInfo.g, newRGBInfo.b)
    })
  },
  mounted () {
    const temp = parseInt($('.form-card').css('font-size').replace(/\D+$/g, ''))
    this.lineBaseUnit = temp / 17
  },
  computed: {
    siteData () {
      const _this = this
      const data = this.defaultData.slice()
      this.sites.forEach((item, idx) => {
        if (item.site__name && item.total > 0) {
          _this.maxTotal = item.total > this.maxTotal ? item.total : this.maxTotal
          data[idx] = item
        }
      })
      return data
    }
  },
  methods: {
    truncate (str) {
      if (str) {
        return str.length > 12 ? str.substring(0, 9) + '...' : str
      }
      return ''
    }
  },
  data () {
    return {
      lineColors: [
        '#65d866',
        '#65d866',
        '#65d866',
        '#65d866',
        '#65d866'
      ],
      lineBaseUnit: 0.85,
      defaultData: [
        { site: '-', site__name: '-', total: 0 },
        { site: '-', site__name: '-', total: 0 },
        { site: '-', site__name: '-', total: 0 },
        { site: '-', site__name: '-', total: 0 },
        { site: '-', site__name: '-', total: 0 }
      ],
      maxTotal: 1,
      lineHeight: 115
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.visited-sites {
  width: 100%;

  .chart-container {
    text-align: center;
    align-items: end;
    width: 100%;
    max-width: 20%;
    .chart {
      position: relative;
      width: 5px;
      height: 115px;
      margin: auto;
      margin-bottom: 20px;
      background-color: $gray-xlight;
      border-radius: 4px;
      .chart-bar {
        bottom: 0;
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }

    .chart-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 8px;
      color: #000;
    }
  }
  .medium {
    color: #000;
    font-size: 14px;
  }

}

</style>
