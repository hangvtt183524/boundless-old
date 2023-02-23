<template lang="pug">
  .option-type
    v-layout(row)
      v-flex(xs12) {{$t('builder.loaderStyle')}}
    .loader-list
      .loader-icon(
        v-for="loader in loaders",
        @click="selectLoader(loader)",
        :class="{'active': loader.class === selectedItem.config.loaderType}"
      )
        v-icon {{ loader.class }}
</template>

<script>
export default {
  props: ['selectedItem'],
  data () {
    return {
      loaders: [
        {
          id: 1,
          class: 'fas fa-spinner fa-spin'
        },
        {
          id: 1,
          class: 'fas fa-circle-notch fa-spin'
        },
        {
          id: 1,
          class: 'fas fa-sync fa-spin'
        }
      ]
    }
  },
  methods: {
    selectLoader (loader) {
      this.selectedItem.config.loaderType = loader.class
    }
  }
}
</script>

<style lang="scss" scoped>
.loader-list {
  display: flex;
  margin-left: -5px;
  margin-right: -5px;
}

.loader-icon {
  cursor: pointer;
  padding: 10px 5px;
  background-color: white;
  text-align: center;
  flex: 1;
  margin: 5px;
  border: 1px solid transparent;

  &.active {
    border: 1px solid #9ba9c4;
  }

  .v-icon {
    color: #9ba9c4;
  }
}
</style>
