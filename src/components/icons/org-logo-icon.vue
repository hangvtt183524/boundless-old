<template lang="pug">
  .img
    img(src="@/assets/images/org_logo.png")
</template>
<style lang="scss" scoped>
  .img{
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 20px;
      margin-right: 15px;
      margin-bottom: 5px;
      @media (max-width: 767px) {
        width: 16px;
        height: auto;
        margin-right: 20px;
      }
    }
  }
</style>
