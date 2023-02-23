import { configure, addDecorator } from '@storybook/vue';
import 'vuetify/dist/vuetify.css';

import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/lib/util/colors';
import 'vuetify/dist/vuetify.min.css'
import JQuery from 'jquery'

window.$ = JQuery

Vue.use(Vuetify, {
  theme: {
    primary: '#4b83f0',
    secondary: '#3260D3',
    accent: colors.purple.base,
    error: '#EC5F59',
    warning: colors.orange.base,
    info: colors.yellow.base,
    success: '#62d862'
  }
});

addDecorator(() => ({
  template: '<v-app><story/></v-app>',
}));


const req = require.context('../src', true, /\.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
