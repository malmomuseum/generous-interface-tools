<template>
  <div>
    <div class="menu">
      <img :src="logoUrl" alt="logo and information" class="logo" role="button" @click="openModal">

      <span class="left"><span class="no-mobile">{{ $t('nItemsPrefix') }} </span><animated-number :number="numberOfActiveItems" /> {{ $t('nItemsMidfix') }} {{ numberOfItems }} {{ $t('nItemsSuffix') }}</span>

      <div :class="{ active: anyTimeFilterIsActive }" class="menu-btn" role="button" aria-label="Toggle time filter" :aria-pressed="timeFilterOpen" @click="toggleTimeFilter">
        <i aria-hidden="true" class="fas fa-clock" />
      </div>


      <div :class="{ active: labelFilterIsActive }" class="menu-btn" role="button" aria-label="Toggle label filter" :aria-pressed="labelFilterOpen" @click="toggleLabelFilter">
        <i aria-hidden="true" class="fas fa-tag" />
      </div>


    </div>
  <transition name="slide-north">
      <filter-container v-if="timeFilterOpen">
        <time-stack :labels="timeStats" />
        <close-btn @click.native="resetFilters" />
      </filter-container>
    </transition>

    <transition name="slide-north">
      <filter-container v-if="labelFilterOpen">
        <label-stack :labels="labelStats" />
        <close-btn @click.native="resetFilters" />
      </filter-container>
    </transition>
  </div>
</template>

<script>
import fontawesome from '@fortawesome/fontawesome';
import faTag from '@fortawesome/fontawesome-free-solid/faTag';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faPalette from '@fortawesome/fontawesome-free-solid/faPalette';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';
import { mapGetters } from 'vuex';

import FilterContainer from './FilterContainer';
import CloseBtn from './CloseBtn';
import AnimatedNumber from './AnimatedNumber';

import TimeStack from './TimeStack';
import LabelStack from './LabelStack';
import { store } from '../store';
import { logoUrl } from '../main';

fontawesome.library.add(faPalette);
fontawesome.library.add(faTag);
fontawesome.library.add(faSave);
fontawesome.library.add(faClock);

export default {
  name: 'FilterMenu',
  components: {
    FilterContainer,
    AnimatedNumber,
    TimeStack,
    LabelStack,
    CloseBtn,
  },
  data() {
    return {

      labelFilterOpen: false,
      timeFilterOpen: false,

      labelStats: [],
      timeStats: [],
      logoUrl: logoUrl,
      preCalculated: {
        status: false,

        labelStats: [],
        timeStats: [],
      },
    };
  },
  computed: {
    ...mapGetters([

      'labelFilterIsActive',
      'anyTimeFilterIsActive',
      'numberOfActiveItems',
      'numberOfItems',
      'selectedSnappedTimeIds',
      'selectedLabelIds',
    ]),
  },
  mounted() {
    this.$root.$on('triggerFiltering', () => {
      this.executeFiltering();
    });
  },
  methods: {
    openModal() {
      this.$root.$emit('openInfo');
    },
    toggleTimeFilter() {
      this.timeFilterOpen = !this.timeFilterOpen;
    },

    toggleLabelFilter() {
      this.labelFilterOpen = !this.labelFilterOpen;
    },
    resetFilters() {
      store.commit('replaceSnappedTimeIds', []);
      store.commit('replaceLabelIds', []);
      store.commit('resetVisibleLimit');
      this.$root.$emit('triggerFiltering');
    },

    executeFiltering() {
      console.log('debug: executing filtering');
      const t0 = performance.now();
      let finalList = store.state.allItems;

      if (!this.anyTimeFilterIsActive && !this.labelFilterIsActive && this.preCalculated.status) {
        console.log('debug: using cache for filtering.');
        store.commit('addActiveItems', finalList);

      
        this.labelStats = this.preCalculated.labelStats;
        this.timeStats = this.preCalculated.timeStats;

        console.log('debug: reseting visibleLimit');
        store.commit('resetVisibleLimit');
        window.scrollTo(0, 0);
        return;
      }
      this.selectedSnappedTimeIds.forEach(time => {
console.log(this.selectedSnappedTimeIds)
        finalList = finalList.filter(item => item.time.includes(time));
      });

      this.selectedLabelIds.forEach(label => {
        finalList = finalList.filter(item => item.labels.includes(label));
      });

    

    
      let labelStats = [];
      let timeStats = [];
      let remainingLabels = [];
      let remainingTimes = [];
      finalList.forEach(item => {
        remainingLabels = remainingLabels.concat(item.labels);
        remainingTimes = remainingTimes.concat(item.time);
      });
console.log(remainingTimes)
     remainingTimes.forEach(l => {
        timeStats.push([l, remainingTimes.filter(x => x === l).length]);
      });
      timeStats = Array.from(new Set(timeStats.map(JSON.stringify)), JSON.parse).filter(y => y[1] > 2);

      const Tmax = timeStats.reduce((tot, lab) => Math.max(tot, lab[1]), 0);
      this.timeStats = timeStats.map(l => {
        const norm = ((l[1] - 2) / (Tmax - 2));
        l[1] = norm * 30 + 10;
        l[1] += 'px';
        return l;
      });

      remainingLabels.forEach(l => {
        labelStats.push([l, remainingLabels.filter(x => x === l).length]);
      });
      labelStats = Array.from(new Set(labelStats.map(JSON.stringify)), JSON.parse).filter(y => y[1] > 2);

      const max = labelStats.reduce((tot, lab) => Math.max(tot, lab[1]), 0);
      this.labelStats = labelStats.map(l => {
        const norm = ((l[1] - 2) / (max - 2));
        l[1] = norm * 30 + 10;
        l[1] += 'px';
        return l;
      });
console.log(this.timeStats)
      // cache
      if (!this.preCalculated.status) {
        this.preCalculated.labelStats = this.labelStats;
        this.preCalculated.timeStats = this.timeStats;
        this.preCalculated.status = true;
      }

      store.commit('addActiveItems', finalList);
      const t1 = performance.now();
      console.log('Took ' + (t1 - t0) + ' milliseconds.');

      // handle reseting of visibleLimit on filter change
      console.log('debug: reseting visibleLimit');
      store.commit('resetVisibleLimit');
      window.scrollTo(0, 0);
console.log(finalList)
    },

  },
};
</script>

<style scoped>
.menu {
  width: 100vw;
  background: #fff;
  height: 50px;
  z-index: 2;
  text-align: right;
  box-sizing: border-box;
  line-height: 50px;
  position: fixed;
  top: 0;
}

.left {
  float: left;
  padding-left: 7px;
}

.menu-btn {
  display: inline-block;
  cursor: pointer;
  width: 46px;
  height: 46px;
  text-align: center;
  margin: 2px 6px 2px 2px;
  box-sizing: border-box;
  border-radius: 10px;
  background: #dadada;
  border: solid 2px #dadada;
  line-height: 46px;
}

.logo {
  display: block;
  float: left;
  max-height: 100%;
  cursor: pointer;
}

.menu div:last-child {
  margin-right: 10px;
}

.menu-btn:hover {
  background: #fff;
}

.menu-btn.active {
  box-shadow: inset 0 0 0 2px white;
}

@media only screen and (max-width: 410px) {
  .no-mobile {
    display: none;
  }
}
</style>
