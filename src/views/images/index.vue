<template>
  <div class="box">
    <el-card>
      <BreadLink menuName="素材管理" />
      <ImgList/>
    </el-card>
  </div>
</template>

<script>
import ImgList from './components/ImgList.vue'
import BreadLink from "../../components/BreadLink.vue";

export default {
  components: { BreadLink,ImgList },
 
};
</script>

<style lang="scss" scoped>

</style>