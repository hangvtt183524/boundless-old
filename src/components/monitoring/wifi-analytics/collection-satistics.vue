<template lang="pug">
  .collection-satistics
    .form-card.x3
      v-layout(column, wrap)
        v-flex.mb-3(xs12)
          h4.card-title {{ $t('monitoring.connectionSatistics') }}
        v-flex.mb-4(xs12, text-xs-center)
          span.large {{ this.total }}
          p.medium {{ $t('monitoring.totalConnections') }}
      v-layout(row wrap)
        v-flex.collection-row.mb-4(
            xs6
            v-for="(item, index) in getData"
            :key="item.auth_provider"
          )
          img.social-icon(:src="require(`@/assets/images/social-icons/${item.auth_provider}.png`)" :class="item.auth_provider")
          span.text.pl-2 {{ $t(`social.${item.auth_provider}`) }}
          span.small.px-1 {{ item.total}}
</template>

<script>
export default {
  name: 'CollectionSatistics',
  props: {
    total: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      connectedData: [
        { auth_provider: 'facebook', total: 0 },
        { auth_provider: 'form', total: 0 },
        { auth_provider: 'google', total: 0 },
        { auth_provider: 'instagram', total: 0 },
        { auth_provider: 'linkedin', total: 0 },
        { auth_provider: 'twitter', total: 0 }
      ]
    }
  },
  computed: {
    getData () {
      return this.connectedData.map(cItem => {
        const result = this.data.find(item => item.auth_provider === cItem.auth_provider)
        if (result) {
          return ({
            ...cItem,
            total: result.total || 0
          })
        }
        return cItem
      })
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";

.collection-satistics {
  width: 100%;
  position: relative;

  img.social-icon {
    width: 13px;
    height: 13px;
  }
  .large {
    color: $blue;
    font-size: 36px;
    font-weight: 600;
  }
  .medium {
    color: $blue;
    font-size: 14px;
    margin-bottom: 15px;
  }
  .small {
    color: $blue;
    font-weight: bold;
    margin-right: 10px;
  }
  .collection-row {
    display: flex;
    align-items: center;
    &:nth-child(odd) {
      padding-right: 8px;
      @media (min-width: 1024px) and (max-width: 1100px) {
        padding-right: 2px;
      }
      @media (min-width: 768px) and (max-width: 960px) {
        padding-right: 0px;
      }
      @media (max-width: 767px) {
        padding-right: 12px;
      }
    }
    &:nth-child(even) {
      padding-left: 8px;
      @media (min-width: 1024px) and (max-width: 1100px) {
        padding-left: 2px;
      }
      @media (min-width: 768px) and (max-width: 960px) {
        padding-left: 0px;
      }
      @media (max-width: 767px) {
        padding-left: 12px;
      }
    }
    .text {
      flex: 1
    }
  }
}
</style>
