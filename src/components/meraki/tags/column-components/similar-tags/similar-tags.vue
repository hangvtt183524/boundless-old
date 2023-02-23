<template>
  <div class="similar-tags">
    <div class="similar-tags__warning" v-show="value.length > 0">!</div>
    <div class="similar-tags__list">
      <span v-for="(tag, index) of value" :key="tag.id" >
        <span v-show="index != editingTag" class="similar-tags__list__item" @click="editingTag=index">{{tag.name}}</span>
        <span v-show="index != editingTag" v-if="index+1 < value.length" class="similar-tags__list__comma">,&nbsp;</span>
        <transition name="slide">
          <div class="base-filter--sections" v-show="index == editingTag">
            <div class="base-filter-ssids">
              <div class="base-filter--ssid base-filter--section-item">
                <v-layout>
                  <v-flex xs8>
                    <base-text-input
                      v-model="tag.name"
                      class="base-text-input--small">
                      <v-icon class="edit-check-icon" @click="clickCheck(tag)">check</v-icon>
                      <v-icon class="edit-close-icon" @click="clickClose(tag)">close</v-icon>
                    </base-text-input>
                  </v-flex>
                  <v-flex xs4>
                    <base-button
                      class="dismiss-button base-button--blue"
                      @click="clickDismiss(tag)"
                      :loading="saving"
                    > {{ dismissLabel }} </base-button>
                  </v-flex>
                </v-layout>
              </div>
            </div>
          </div>
        </transition>
      </span>
    </div>
  </div>
</template>

<script>
import BaseTextInput from '../../../../v2/base-text-input/base-text-input'
import BaseButton from '../../../../v2/base-button/base-button'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'SimilarTags',
  props: {
    value: { // tags list
      required: true,
      type: Array
    },
    item: {
      type: Object
    },
    options: {
      type: Object
    }
  },
  components: {
    BaseTextInput,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      editingTag: -1,
      saving: false
    }
  },
  computed: {
    dismissLabel () {
      try {
        return this.$t('tags.dismiss')
      } catch (err) {
        return 'Dismiss'
      }
    }
  },
  methods: {
    clickDismiss (tag) {
      this.$emit('dismiss', this.editingTag)
      //  Dismiss to accept that its not a misspelling, which removes the suggestion from the list
      this.saving = true
      this.$store.dispatch('workspace/network/dismissSimilarTag', {
        workspaceId: this.workspaceId,
        tagId: this.item.id,
        dismissed_similarity: tag.name
      }).finally(() => {
        this.editingTag = -1
        this.saving = false
      })
    },
    clickCheck (tag) {
      this.$emit('check', this.editingTag)
      // correct the misspelling
      this.saving = true
      this.$store.dispatch('workspace/network/replaceTag', {
        workspaceId: this.workspaceId,
        tags: [tag.id],
        target_tag_name: tag.name
      }).finally(() => {
        this.editingTag = -1
        this.saving = false
      })
    },
    clickClose (tag) {
      this.editingTag = -1
    }
  }
}
</script>

<style src="./similar-tags.scss" lang="scss" scoped></style>
