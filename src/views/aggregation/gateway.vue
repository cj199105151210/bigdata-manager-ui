<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="main_middle_content">
        <avue-crud ref="crud"
                    :page="page"
                    :data="tableData"
                    :table-loading="tableLoading"
                    :option="tableOption"
                    v-model="obj"
                    @selection-change="selectionChange"
                    @search-change="handleFilter"
                    @on-load="getList"
                    @refresh-change="refreshChange"
                    @row-update="handleUpdate"
                    @row-save="handleSave"
                    @row-del="rowDel">
            <template slot="menuLeft">
            <el-button type="primary"
                        @click="handleAdd"
                        size="small">新增</el-button>
            <el-button type="danger"
                        @click="handleBatchDel"
                        size="small">删除</el-button>
            <el-button type="success"
                        @click="handleBatchEnable"
                        size="small">启用</el-button>
            <el-button type="info"
                        @click="handleBatchDisable"
                        size="small">禁用</el-button>
            </template>
            <template slot-scope="scope"
                    slot="menu">
            <el-button type="text"
                        icon="el-icon-edit"
                        size="small"
                        plain
                        @click="handleEdit(scope.row,scope.index)">编辑</el-button>
            <el-button type="text"
                        icon="el-icon-delete"
                        size="small"
                        plain
                        @click="handleDel(scope.row,scope.index)">删除</el-button>
            <el-button type="text"
                        v-if="scope.row.status == '0'"
                        icon="el-icon-check"
                        size="small"
                        plain
                        @click="handleBatchEnable(scope.row,scope.index)">启用</el-button>
            <el-button type="text"
                        v-if="scope.row.status == '1'"
                        icon="el-icon-close"
                        size="small"
                        plain
                        @click="handleBatchDisable(scope.row,scope.index)">禁用</el-button>
            </template>
        </avue-crud>
      </div>
    </basic-container>
  </div>
</template>

<script>
  import { fetchList, addObj, putObj, delObj, batchDelObj, handleBatchEnable, handleBatchDisable, checkName, checkCode } from '@/api/aggregation/aggrgateway'
  import {getCodeDetailFromDB} from '@/api/aggregation/subjectManage'
  import { tableOption } from '@/const/crud/aggregation/aggrgateway'
  import { mapGetters } from 'vuex'
  export default {
    name: 'aggrgateway',
    data() {
      return {
        param: {},
        obj:{},
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        selectedOptions: []
      }
      
    },
    created() {
        this.getType()
    },
    mounted: function() { },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      selectionChange(list){
        this.selectedOptions = list
      },
      getType(){
        getCodeDetailFromDB("gateway_type").then(response => {
          let gatewayType = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'type'){
              this.tableOption.column[i].dicData = gatewayType
            }
          }
        })
        getCodeDetailFromDB("identity_type").then(response => {
          let identityType = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'identity'){
              this.tableOption.column[i].dicData = identityType
            }
          }
        })
        var validateCheckName = (rule, value, callback) => {
          if(!value){
            callback(new Error('请输入名称'));
            return
          }
          if(value.length > 20 || value.length < 1){
            callback(new Error('名称最小长度为1，最大长度为20'));
            return
          }
          checkName(value, this.obj.gatewayId).then(response => {
            if (response.data) {
              callback(new Error('该名称已存在！请重新输入'));
            } else {
              callback();
            }
          })
        };
        var validateCheckCode = (rule, value, callback) => {
          if(!value){
            callback(new Error('请输入编码'));
            return
          }
          if(value.length > 20 || value.length < 8){
            callback(new Error('编码最小长度为8，最大长度为20'));
            return
          }
          var reg =/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
          if (reg.test(value)){
            callback(new Error('编码中不可包含中文字符'));
            return
          }
          checkCode(value, this.obj.gatewayId).then(response => {
            if (response.data) {
              callback(new Error('该编码已存在！请重新输入'));
            } else {
              callback();
            }
          })
        };
        for ( var i = 0; i <this.tableOption.column.length; i++){
          if(this.tableOption.column[i].prop == 'name'){
            this.tableOption.column[i].rules[0].validator = validateCheckName
          }
        }
        for ( var i = 0; i <this.tableOption.column.length; i++){
          if(this.tableOption.column[i].prop == 'code'){
            this.tableOption.column[i].rules[0].validator = validateCheckCode
          }
        }
      },
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },
      handleFilter(param) {
        this.param = param
        this.page.page = 1;
        this.getList(this.page, param);
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function() {
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      handleBatchDel() {
        var gatewayIds = []
        for ( var i = 0; i <this.selectedOptions.length; i++){
          gatewayIds.push(this.selectedOptions[i].gatewayId)
        }
        if(gatewayIds.length == 0){
            this.$message.error('请至少选中一条门户数据！');
            return false
        }
        var _this = this
        this.$confirm('是否确认删除当前选中的所有门户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return batchDelObj(gatewayIds)
          }).then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.page.page = 1;
          this.getList(this.page, this.param);
        }).catch(function(err) { })
      },
      handleBatchEnable(row, index) {
        var gatewayIds = []
        if(row.gatewayId){
            gatewayIds.push(row.gatewayId)
        } else {
          for ( var i = 0; i <this.selectedOptions.length; i++){
            gatewayIds.push(this.selectedOptions[i].gatewayId)
          }
        }
        if(gatewayIds.length == 0){
            this.$message.error('请至少选中一条门户数据！');
            return false
        }
        var _this = this
        this.$confirm('是否确认启用当前选中的门户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return handleBatchEnable(gatewayIds)
          }).then(data => {
          _this.$message({
            showClose: true,
            message: '启用成功',
            type: 'success'
          })
          this.getList(this.page, this.param);
        }).catch(function(err) { })
      },
      handleBatchDisable(row, index) {
        var gatewayIds = []
        if(row.gatewayId){
            gatewayIds.push(row.gatewayId)
        } else {
          for ( var i = 0; i <this.selectedOptions.length; i++){
            gatewayIds.push(this.selectedOptions[i].gatewayId)
          }
        }
        if(gatewayIds.length == 0){
            this.$message.error('请至少选中一条门户数据！');
            return false
        }
        var _this = this
        this.$confirm('是否确认禁用当前选中的门户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return handleBatchDisable(gatewayIds)
          }).then(data => {
          _this.$message({
            showClose: true,
            message: '禁用成功',
            type: 'success'
          })
          this.getList(this.page, this.param);
        }).catch(function(err) { })
      },
      rowDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除当前门户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return delObj(row.gatewayId)
          }).then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.page.page = 1;
          this.getList(this.page, this.param);
        }).catch(function(err) { })
      },
      /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
      handleUpdate: function(row, index, done) {
        putObj(row).then(data => {
          this.tableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          done()
          this.getList(this.page, this.param);
        })
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function(row, done) {
        addObj(row).then(data => {
          this.tableData.push(Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          done()
          this.getList(this.page, this.param);
        })
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page, this.param);
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
