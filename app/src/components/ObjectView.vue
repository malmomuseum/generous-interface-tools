<template>
  <div class="object">
    <img :src="object.image" :alt="object.title" @click="toggle()">

    <modal :name="object.url" :classes="['v--modal details']" height="auto" transition="slide-north">
      <close-btn @click.native="toggle" />

      <img :src="object.image" :alt="object.title">

 

      <div class="image-labels">
        <label-btn v-for="label in object.labels" :key="label" :label="label" />
      </div>

      <p>{{ object.title }}</p>

      <p class="fine-print">{{ $t('imageProvidedBy') }} {{ object.provider }} {{ $t('underLicense') }} <a :href="object.rights" target="_blank">{{ resolveLicense(object.rights) }} <i aria-hidden="true" class="fas fa-external-link-alt" /></a>. {{ $t('moreObjectDetails') }} <a :href="object.url" target="_blank">{{ object.provider }} <i aria-hidden="true" class="fas fa-external-link-alt" /></a></p>
    </modal>
  </div>
</template>

<script>
import LabelBtn from './LabelBtn';
import CloseBtn from './CloseBtn';
import { store } from '../store';
import fontawesome from '@fortawesome/fontawesome';
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt';

fontawesome.library.add(faExternalLinkAlt);

export default {
  name: 'ObjectView',
  components: {
    LabelBtn,
    CloseBtn,
  },
  props: {
    object: {
      type: [Object, Boolean],
      default: false,
    },
  },
  data() {
    return {
      isShown: false,
    };
  },
  computed: {
    showWallDetails() {
      return store.state.wallDetails;
    },
  },
  methods: {
    toggle() {
      if (!this.isShown) this.$modal.show(this.object.url);
      if (this.isShown) this.$modal.hide(this.object.url);
      this.isShown = !this.isShown;
    },

    resolveLicense(licence) {
      if (licence === 'http://creativecommons.org/licenses/by-nc-nd/2.5/') return 'Attribution-NonCommercial-NoDerivs 2.5 Generic';
      if (licence === 'http://creativecommons.org/licenses/by-nc-nd/4.0/') return 'Attribution-NonCommercial-NoDerivs 4.0 Generic';
      if (licence === 'http://creativecommons.org/licenses/by/2.5/') return 'Attribution 2.5 Generic';
      if (licence === 'http://creativecommons.org/licenses/by-sa/4.0/') return 'Attribution-ShareAlike 4.0 International';
      if (licence === 'http://creativecommons.org/licenses/by-sa/3.0/') return 'Attribution-ShareAlike 3.0 International';
      if (licence === 'http://creativecommons.org/publicdomain/mark/1.0/') return 'Public Domain Mark 1.0';
    },

    filterByColor(color) {
      store.commit('setSelectedSnappedColorId', color);
      this.$root.$emit('triggerFiltering');
      this.toggle();
    },

    setSelectedLabelId(id) {
      store.commit('setSelectedLabelId', id);
      this.$root.$emit('triggerFiltering');
    },

    labelActive(label) {
      return store.state.selectedLabelIds.includes(label);
    },

  },
};
</script>

<style>
.details {
  text-align: center !important;
  padding: 7px !important;
  max-width: 100vw;
  max-height: 100vh;
}
</style>

<style scoped>
.object {
  /* float: left; */
  overflow: hidden;
  height: auto;
  max-width: 50vw;
  transition: 0 ease-in-out;
}

.object > img {
  vertical-align: bottom;
  cursor: pointer;
  object-fit: cover;
  width: 50vw;
  height: 50vw;
  transform: scale(1);
  transition: s ease-in-out;
  box-sizing: border-box;
  border: 2px solid #e9e9e9;
}

.details img {
  max-height: calc(100vh - 240px);
  margin: auto;
  display: block;
  max-width: 30vw;
  margin-bottom: 5px;
}

.image-colors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 5px;
}

.image-labels {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.fine-print {
  font-size: .8em;
}

@media only screen and (min-width: 600px) {
  .object {
    max-width: 25vw;
  }

  .object > img {
    width: 25vw;
    height: 25vw;
  }
}

@media only screen and (min-width: 1200px) {
  .object {
    max-width: 20vw;
  }

  .object > img {
    width: 20vw;
    height: 20vw;
  }
}
</style>
