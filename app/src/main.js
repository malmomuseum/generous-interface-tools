import Vue from 'vue';
import App from './App.vue';

import AsyncComputed from 'vue-async-computed';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import { VueHammer } from 'vue2-hammer';

Vue.use(VueHammer);
Vue.use(AsyncComputed);
Vue.use(VueResource);
Vue.use(Vuex);

Vue.config.productionTip = false;

export const store = new Vuex.Store({
  state: {
    allItems: [],
    activeItems: [],

    visibleLimit: 30,
    garmentFilter: [],

    colorFilterActive: false,
    colorFilter: [],
    colorFilterDynamic: '#000000',
    colorCount: [],

    isLoadingImages: false,
  },
  mutations: {
    addAllItems(state, items) {
      state.allItems = items;
    },

    addActiveItems(state, items) {
      state.activeItems = items;
    },

    increaseVisibleLimit(state, increase) {
      state.visibleLimit += increase;
    },

    resetVisibleLimit(state) {
      state.visibleLimit = 30;
    },

    toggleGarment(state, garment) {
      let index = state.garmentFilter.indexOf(garment);
      if (index === -1) {
        state.garmentFilter.push(garment);
      } else {
        state.garmentFilter.splice(index, 1);
      }
    },

    loadingImages: state => state.isLoadingImages = true,
    notLoadingImages: state => state.isLoadingImages = false,

    activateColorFilter: state => state.colorFilterActive = true,
    deactivateColorFilter: state => {
      state.colorFilterActive = false;
      state.colorFilter = [];
    },

    updateDynamicColor: (state, color) => state.colorFilterDynamic = color,
    addColorFilter: (state, color) => !state.colorFilter.includes(color) && state.colorFilter.push(color),
    removeColorFilter: (state, colors) => state.colorFilter = state.colorFilter.filter(item => !colors.includes(item)),

    colorCountClear: (state) => state.colorCount = [],
    colorCountAdd: (state, values) => state.colorCount.push(values),
  },
  getters: {
    getColorDegrees: state => {
      let whole = 0;
      state.colorCount.forEach(color => whole += color[0]);

      return state.colorCount.map(color => {
        color[0] = color[0] / whole * 360;
        return color;
      });
    }
  },
});

new Vue({
  render: h => h(App)
}).$mount('#app');
