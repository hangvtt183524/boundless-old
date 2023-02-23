<template>
  <div class="base-filter" v-click-outside="onClickOutside">
    <div class="base-filter--header">
      <v-layout>
        <v-flex justify-center text-xs-center base-filter--checkbox-container>
          <base-check-box
            class="base-check-box--small select-all-button"
            v-model="value.selected"
            @click="onCheckBoxClick"
          ></base-check-box>
        </v-flex>
        <v-flex @click="onExpandClick">
          <span class="base-filter--header--filter-name">
            {{ value.name }}
          </span>
        </v-flex>
        <v-flex>
          <v-icon v-if="!sectionsExpanded" class="base-filter--header--icon expand-icon">arrow_drop_up</v-icon>
          <v-icon v-if="sectionsExpanded" class="base-filter--header--icon expand-icon">arrow_drop_down</v-icon>
        </v-flex>
      </v-layout>
    </div>

    <transition name="slide">
      <div class="base-filter--sections" v-show="sectionsExpanded">
        <div class="base-filter-ssids">
          <div v-for="ssid of value.ssids" :key="ssid.id"
               class="base-filter--ssid base-filter--section-item"
          >
            <v-layout >
              <v-flex justify-center text-xs-center base-filter--checkbox-container>
                <base-check-box
                  v-model="ssid.selected"
                  @input="onSelectionChange"
                  class="base-check-box--small ssid-checkbox"></base-check-box>
              </v-flex>
              <v-flex class="section-name-container" @click="onClickLabel(ssid)">
                <span class="section-name">
                  {{ ssid.name }}
                </span>
              </v-flex>
            </v-layout>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import BaseCheckBox from '../base-check-box/base-check-box.vue'
import Vue from 'vue'
export default {
  name: 'base-filter',
  components: { BaseCheckBox },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      sectionsExpanded: false
    }
  },
  mounted: function () {
    // Initialize selected fields
    Vue.set(this.value, 'selected', !!this.value.selected)
    this.value.ssids.forEach(ssid => {
      Vue.set(ssid, 'selected', !!ssid.selected)
    })
  },
  methods: {
    onExpandClick: function () {
      this.sectionsExpanded = !this.sectionsExpanded
    },
    onCheckBoxClick: function () {
      if (!this.value.selected) {
        // Select all items
        this.value.selected = true
        this.value.ssids.forEach(ssid => {
          ssid.selected = true
        })
        this.sectionsExpanded = true
        this.value.selected = true
      } else {
        // De-select all
        this.value.selected = false
        this.value.ssids.forEach(ssid => {
          ssid.selected = false
        })
        this.value.selected = false
        this.sectionsExpanded = false
      }

      // Trigger selection change
      this.$emit('input', this.value)
    },
    onClickOutside: function () {
      this.sectionsExpanded = false
    },
    onClickLabel (ssid) {
      ssid.selected = !ssid.selected
      this.onSelectionChange()
    },
    onSelectionChange: function () {
      let subItemSelected = false
      for (let i = 0; i < this.value.ssids.length; i += 1) {
        if (this.value.ssids[i].selected) {
          subItemSelected = true
          break
        }
      }
      if (subItemSelected) {
        this.value.selected = true
      } else {
        this.value.selected = false
      }
      this.$emit('input', this.value)
    }
  }
}
</script>

<style src="./base-filter.scss" lang="scss" scoped></style>
