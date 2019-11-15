import Vue from 'vue';
import VueResource from 'vue-resource';
import vmodal from 'vue-js-modal';
import VueI18n from 'vue-i18n';

import App from './App';
import messages from './i18n';
import { store } from './store';

Vue.use(VueI18n);
Vue.use(vmodal);
Vue.use(VueResource);

Vue.config.productionTip = false;

// the URL to your logo 90x90 pixels are known to work
export const logoUrl = 'https://malmo.se/images/18.7e72b5fc1567efb9afab093/1491302594458/Malmostad_logo_RGB_600px_72dpi.jpg';

let locale = 'en';
// remove these 3 lines to disable Swedish
if (navigator.languages.includes('sv')) {
  locale = 'sv';
}

const i18n = new VueI18n({
  locale: locale,
  messages,
});

new Vue({
  render: h => h(App),
  i18n,
  store,
}).$mount('#app');
