<template lang="pug">
  .page-content
    v-layout(row)
      v-card(width='400px')
        v-card-media.pa-5(src="@/../images/logo.png", height='500px')
        v-card-title(primary-title)
          div.px-5
            h3.mb-0 Boundless Ividata
            blockquote this is home page
            br
            small
              em gotcha
</template>

<script>
export default {
  name: 'OrganizationHome'
}
</script>
