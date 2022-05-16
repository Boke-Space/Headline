<template>
  <div>
    <keep-alive exclude="Search,SearchResult,ArticleDetail,UserEdit">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">

</style>
