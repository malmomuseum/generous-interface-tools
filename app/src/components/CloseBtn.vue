<template>
  <div role="button">
    <i aria-label="close" class="fas fa-trash-alt" />
  </div>
</template>

<script>
import fontawesome from '@fortawesome/fontawesome';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';

fontawesome.library.add(faTrashAlt);

export default {
  name: 'CloseBtn',
};
</script>

<style scoped>
div {
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 5px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: #e7e7e7;
  border-radius: 100%;
}

div:hover {
  filter: brightness(.9);
}

</style>
