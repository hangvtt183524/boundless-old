<template>
  <v-dialog data-test="confirm-dialog" v-model="dialog" :max-width="options.width" @keydown.esc="cancel()" content-class="confirmation">
    <v-toolbar dark :color="options.color" dense>
      <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text v-show="!!message">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" flat="flat" @click.native="agree()" data-test="btn-confirm">Yes</v-btn>
        <v-btn color="grey" flat="flat" @click.native="cancel()" data-test="btn-cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {});
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open;
 * }
 */
export default {
  data () {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        color: 'primary',
        width: 290
      }
    }
  },
  methods: {
    open (title, message, options) {
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign({}, this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree () {
      this.resolve(true)
      this.dialog = false
    },
    cancel () {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>

<style lang="scss">
  .v-dialog.confirmation {
    padding: 0 !important;
    .v-toolbar {
      .v-toolbar__content {
        padding: 0 12px;
      }
    }
    .v-card__text {
      font-size: 16px;
    }
  }
</style>
