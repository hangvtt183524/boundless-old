<template lang='pug'>
  v-app
    v-content
      .login-container
        .login-box
            .logo-container
              img.logo-image(src="@/assets/images/boundless-logo.png")
              p.tag-line {{ $t('login.welcomeTo') }}
              h3.logo-text  BOUNDLESS
            router-view(:auth="auth", :authenticated="authenticated")
        .login-bg

    activity-indicator(:show="showActivityIndicator")
</template>

<script>
import { mapGetters } from 'vuex'
import leftNavigation from '../layout/left-navigation.vue'
import toolbar from '../layout/toolbar.vue'
import activityIndicator from '../common/activity-indicator.vue'

export default {
  name: 'LayoutLogin',

  props: ['authenticated', 'auth'],
  mounted () {
    document.body.classList.add('auth')
  },
  beforeDestroy () {
    document.body.classList.remove('auth')
  },
  computed: {
    ...mapGetters(['showActivityIndicator'])
  },

  components: {
    leftNavigation,
    toolbar,
    activityIndicator
  }
}
</script>

<style lang="scss">

@import 'styles/_logo-container.scss';
@import 'styles/auth.scss';
.login-container {
  display: flex;
  height: 100%;
  font-family: 'Fira Sans', sans-serif;
  background-color: #457ef1;
}

.login-bg {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;
}

.login-box {
  max-width: 600px;
  flex: 1;
  background-color: white;
  padding: 60px 150px;
  max-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-text {
  margin: 30px 0;
  color: #8797b3;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

.forgot-link {
  color: #8797b3;
  text-decoration: none;
  margin-top: 10px;
}

.login-layout-link {
  color: #8797b3;
  text-decoration: none;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
}

.separator {
  border-bottom: 1px solid #8797b3;
  margin: 7px 0;
  text-align: center;

  span {
    color: #8797b3;
    font-size: 14px;
    padding: 5px 10px;
    background-color: white;

    position: relative;
    top: 9.5px;
  }
}

.google-sign-in-button {
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
  box-sizing: border-box;
  transition: background-color .218s,border-color .218s,box-shadow .218s;
  background-image: none;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  border: 1px solid transparent;
  width: 100%;
  background-color: #4285f4;
  color: white;

  .icon {
    float: left;
    background-color: #fff;
    border-radius: 1px;
    padding: 15px;
    height: 48px;

    img {
      height: 18px;
      width: 18px;
    }
  }

  .text {
    line-height:48px;
    font-family: Roboto,arial,sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: .21px;
    margin-left: 6px;
    margin-right: 6px;
    vertical-align: top;
  }

  &:hover {
    background-color: #4285f4;
    box-shadow: 0 0 3px 3px rgb(66 133 244 / 30%);
  }

  &:active {
    background-color: #3367d6;
  }
}

</style>
