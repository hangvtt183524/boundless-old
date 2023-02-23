<template lang="pug">
  v-app
    v-content
      v-container.error-container(fluid fill-height)
        v-layout(class="align-center justify-center")
          v-flex(xs12 sm7 md4)
            v-card.pa-4
              v-card-text
                .logo-container
                  img.logo-image(src="@/assets/images/boundless-logo.png")
                  h3.logo-text BOUNDLESS

                v-flex(
                  class="text-xs-center mt-3"
                )
                  h1 {{ errorCode }}
                  h2 {{ shortErrorMessage }}
                  p {{ longErrorMessage }}
                  a.my-5(
                    @click="redirect"
                  ) {{ $t('general.clickHereToContinue') }}

                  small {{ $t('errors.errorRedirect') }}

                  interval-progress(
                    :increment="20"
                    @finish="redirect"
                  )
</template>

<script>
import IntervalProgress from '@/components/common/interval-progress'

export default {
  props: {
    errorCode: {
      type: [Number, String],
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    const validErrorCodes = [
      '404',
      '500'
    ]
    const errorCode = to.params.errorCode.toString()
    if (!validErrorCodes.includes(errorCode) && errorCode !== '404') {
      next({ name: 'error', params: { errorCode: '404' } })
    } else {
      next()
    }
  },
  components: {
    IntervalProgress
  },
  computed: {
    shortErrorMessage () {
      return this.$t(`errors.error${this.errorCode}ShortMessage`)
    },
    longErrorMessage () {
      return this.$t(`errors.error${this.errorCode}LongMessage`)
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss">
@import 'styles/_logo-container.scss';

html {
  overflow-y: auto !important;
}

.error-container {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;

  h1, h2 {
    text-transform: uppercase;
    margin-top: 0;
  }

  h1 {
    font-size: 120px;
    margin-bottom: 0;
    color: #ccc;
  }

  h2 {
    font-size: 32px;
    color: #0D2B3B;
    margin-bottom: 20px;
  }

  p {
    color: #0D2B3B;
    font-size: 16px;
  }

  small {
    margin: 20px;
    font-style: italic;
    font-size: 13px;
    color: #888;
    display: block;
  }
}

</style>
