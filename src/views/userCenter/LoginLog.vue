<template>
  <div id="login-log">
    <basic-container>
      <div class="main_middle_content">
        <div id="search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="用户名:">
              <el-input v-model="formInline.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="登录终端类型:">
              <el-select v-model="formInline.loginType" placeholder="终端类型">
                <el-option v-for="item in loginTypeList" :value="item.value" :key="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Submit" icon="el-icon-search" size="small">查询</el-button>
              <el-button type="success" @click="reset" icon="el-icon-refresh" size="small">清除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div id="logList">
          <el-table
            ref="multipleTable"
            :data="tableData"
            border
            height="411"
            :header-cell-style="{color:'rgba(0,0,0,.85)'}"
            :stripe="true"
          >
            <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
            <el-table-column
              prop="loginType"
              label="登录终端类型"
              align="center"
              :formatter="formatRole1"
            ></el-table-column>
            <el-table-column prop="optTime" label="操作时间" align="center"></el-table-column>
            <el-table-column prop="optType" label="操作类型" align="center" :formatter="formatRole2"></el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[7, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:1%;text-align:right"
          ></el-pagination>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { onSubmit } from "@/api/userCenter/loginLog";
import { getDictionaryValue } from '@/api/userCenter/userControl'
export default {
  name: "LoginLog",
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 7,
      tableData: [],
      loginTypeList:[],
      formInline: {
        userName: "",
        loginType: ""
      }
    };
  },
  mounted: function() {
    this.DictionaryValue("login_type")
    this.Submit();
  },
  methods: {
    //获取字典值
    DictionaryValue(dictKey){
      getDictionaryValue(dictKey).then((result) => {
        this.loginTypeList = result.data.data
      }).catch((err) => {
        
      });
    },
    formatRole1(row, column) {
      for(var j = 0,len = this.loginTypeList.length;j<len;j++){
        //debugger
        if(row.loginType == this.loginTypeList[j].value){
          return this.loginTypeList[j].label
        }else if(row.loginType == null){
          return "未知类型"
        }
      }
      // if (row.loginType == 1) {
      //   return "PC端";
      // } else if (row.loginType == 2) {
      //   return "移动端";
      // } else {
      //   return "未知的终端类型";
      // }
    },

    formatRole2(row, column) {
      if (row.optType == 1) {
        return "登录";
      } else {
        return "登出";
      }
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.Submit();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.Submit();
      // console.log(`当前页: ${val}`);
    },

    //搜索提交
    Submit() {
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      let userName = this.formInline.userName;
      let loginType = this.formInline.loginType;

      onSubmit(currentPage, pageSize, userName, loginType)
        .then(result => {
         
          this.tableData = result.data.data.content;
          this.total = result.data.data.totalElements;
          // console.log(this.tableData)
        })
        .catch(err => {
          this.$message("加载出错，请刷新重试！");
        });
    },

    //清空
    reset() {
      (this.formInline.loginType = ""),
        (this.formInline.userName = ""),
        this.Submit();
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>