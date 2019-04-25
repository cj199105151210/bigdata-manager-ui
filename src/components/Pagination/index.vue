<template>
  <div class="paging-box clearfix">
    <el-pagination
    class="right"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper"
      :total="totalNum"
    ></el-pagination>
    
  </div>
</template>
<script>
export default {
  name: "Pagination",
  data() {
    return {
      totalNum: 100,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style lane="scss">
.paging-box{
    /* float: right; */
}
</style>


