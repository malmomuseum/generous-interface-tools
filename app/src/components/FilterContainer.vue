<template>
  <div class="filter-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FilterContainer',
};
</script>

<style scoped>
.filter-container {
  position: fixed;
  width: 100%;
  background: #fff;
  padding: 7px;
  box-sizing: border-box;
  z-index: 1;
  max-height: calc(100vh - 60px);
  overflow-y: scroll;
}
</style>
