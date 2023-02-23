<template lang="pug">
  // Simplified add-user dialog for venues page
  base-dialog(:show='show', @close="close")
    v-layout(row)
        v-flex(xs10)
          h2.mb-3.dialog-heading {{ $t('monitoring.exportDashboard') }}
    v-layout(row)
      v-flex(xs12)
        h4.pb-4
          | {{ $t('monitoring.exportDescription') }}
    v-layout(row wrap)
      v-flex(xs12 sm3 md3 class="input-wrap")
        v-btn.export-btn(color="primary") {{ $t('monitoring.exportPDF') }}
      v-flex(xs12 sm3 md3 class="input-wrap")
        v-btn.export-btn(color="primary") {{ $t('monitoring.exportXLS') }}
      v-flex(xs12 sm3 md3 class="input-wrap")
        v-btn.export-btn(color="primary") {{ $t('monitoring.exportJPG') }}
      v-flex(xs12 sm3 md3 class="input-wrap")
        v-btn.export-btn(color="primary") {{ $t('monitoring.exportCVS') }}

    template(v-if="canManage")
      v-layout(row)
        v-flex(xs12)
          h2.mt-3.mb-3 {{ $t('monitoring.automaticReport') }}

      v-layout(row wrap)
        v-flex(xs12 sm5 md5 px-3)
          v-text-field.mr-2(
            :label="$t('general.email')"
            :error-messages="getErrors('email')"
            @blur="$v.email.$touch"
            @input="$v.email.$reset"
            @keyup.enter='add'
            required
            v-model="email"
          )
        v-flex(xs12 sm5 md5 px-3)
          v-select(
            :items="scheduleOption"
            :label="$t('monitoring.schedule')"
            v-model="schedule"
          )
        v-flex(xs12 sm2 md2 px-3)
          v-btn(
            :disabled="disableAddButton"
            color="success"
            round
            outline
            large
            @click="add"
          ) {{ $t('general.add') }}
      .report
        v-layout.mt-2.item-row(row, wrap, v-for="(value, index) in reportTo", :key="index")
          v-flex(xs12 sm5 md5 px-3)
            .item-text {{ value.email }}
          v-flex(xs12 sm5 md5 px-3)
            v-select(
              :items="scheduleOption"
              :value="value.schedule"
            )
          v-flex(xs12 sm2 md2 px-3)
            .item-action
              v-btn.divider-vert.mx-0(icon, tabindex='-1', @click="removeItemFromCollection(reportTo, index)")
                v-icon(small, color='grey') close
      v-layout.mt-4(row)
        v-flex.text-xs-right.pb-3(sm-3)
          v-btn.export-save(
            :disabled="disableExportButton"
            :loading="loading"
            @click="exportDashboard"
            color='success'
            large
            round
          ) {{ $t('general.save') }}

</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    canManage: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    ErrorHandlerMixin
  ],
  validations: {
    email: {
      required,
      email
    }
  },
  data () {
    return {
      email: '',
      schedule: 'weekly',
      scheduleOption: [
        { value: 'daily', text: this.$t('monitoring.scheduleOption.daily') },
        { value: 'weekly', text: this.$t('monitoring.scheduleOption.weekly') }
      ],
      loading: false,
      reportTo: []
    }
  },

  computed: {
    disableExportButton () {
      if (this.reportTo.length) {
        return false
      }
      return true
    },
    disableAddButton () {
      return !this.email || this.$v.email.$invalid || this.emailUnique(this.email)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    getTimeText (value) {
      const timeItem = this.scheduleOption.find(item => item.value === value)
      if (timeItem) {
        return timeItem.text
      }
      return ''
    },
    removeItemFromCollection (arr, idx) {
      arr.splice(idx, 1)
    },
    emailUnique (email) {
      if (this.reportTo.find(item => item.email === email)) {
        return true
      }
      return false
    },
    getErrors (fieldName) {
      const vueErrors = this.getVueErrors(fieldName)
      const value = this[fieldName]
      if (value === '') {
        return []
      }
      if (this.emailUnique(value)) {
        vueErrors.push(this.$t('general.emailUnique', { email: this.email }))
      }
      if (vueErrors.length > 0) {
        return vueErrors
      } else {
        return this.getErrorMessages(fieldName)
      }
    },
    add () {
      if (this.$v.email.$invalid || this.emailUnique(this.email)) {
        this.$v.email.$touch()
        return
      }
      this.reportTo.push({ email: this.email, schedule: this.schedule })
      this.email = ''
      this.schedule = 'weekly'
      this.$v.email.$reset()
    },
    exportDashboard () {
      this.$emit('close')
      global.toastr['success'](this.$t('general.dataSaveSuccess'), this.$t('general.success'))
    }
  }
}

</script>

<style lang="scss" scoped>
  .input-wrap {
    padding: 0px 5px;

    &:first-child {
      padding-left: 0px;
    }

    &:last-child {
      padding-right: 0px;
    }

    .export-btn {
      border-radius: 5px;
      width: 100%;
      margin-left: 0px;
      margin-right: 0px;
    }
  }
  .report {
    max-height: 250px;
    overflow-x: hidden;
    .item-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      background-color: #f8fafc;
      border-radius: 5px;

      .item-text {
        flex: 1;
        color: #00082a;
      }
      .item-action {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .export-save {
    width: 175px;
    margin-left: 0px;
    margin-right: 0px;
  }
</style>
