import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    allItems: [],
    activeItems: [],

    visibleLimit: 30,

    isLoadingImages: false,

    selectedSnappedTimeIds: [],
    selectedLabelIds: [],
  },
  mutations: {
    addAllItems(state, items) {
      state.allItems = items;
    },

    addLabels(state, labels) {
      state.labels = labels;
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

    loadingImages: state => (state.isLoadingImages = true),
    notLoadingImages: state => (state.isLoadingImages = false),

    replaceSnappedTimeIds: (state, ids) => {
      state.selectedSnappedTimeIds = ids;
    },

    setSelectedSnappedTimeId: (state, id) => {
      if (state.selectedSnappedTimeIds.includes(id)) {
        let index = state.selectedSnappedTimeIds.indexOf(id);
        if (index !== -1) state.selectedSnappedTimeIds.splice(index, 1);
      } else {
        state.selectedSnappedTimeIds.push(id);
      }
    },

    replaceLabelIds: (state, ids) => {
      state.selectedLabelIds = ids;
    },

    setSelectedLabelId: (state, id) => {
      if (state.selectedLabelIds.includes(id)) {
        let index = state.selectedLabelIds.indexOf(id);
        if (index !== -1) state.selectedLabelIds.splice(index, 1);
      } else {
        state.selectedLabelIds.push(id);
      }
    },
  },
  getters: {
    anyTimeFilterIsActive: state => {
      if (state.selectedSnappedTimeIds.length < 1) return false;
      return true;
    },

    labelFilterIsActive: state => {
      if (state.selectedLabelIds < 1) return false;
      return true;
    },

    numberOfActiveItems: state => state.activeItems.length,
    numberOfItems: state => state.allItems.length,

    selectedSnappedTimeIds: state => state.selectedSnappedTimeIds,
    selectedLabelIds: state => state.selectedLabelIds,
  },
});
