<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="main_middle_content">
        <avue-crud ref="crud"
                    :page="page"
                    :data="tableData"
                    :table-loading="tableLoading"
                    :option="tableOption"
                    :upload-before="handlePost"
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
                        size="small">新 增</el-button>
            <el-button type="danger"
                        @click="handleBatchDel"
                        size="small">删除</el-button>
            </template>
        </avue-crud>
      </div>
    </basic-container>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj, getDept, upload, batchDelObj } from '@/api/aggregation/aggrlightapp'
  import {getCodeDetailFromDB, getGroupMsg} from '@/api/aggregation/subjectManage'
  import { tableOption } from '@/const/crud/aggregation/aggrlightapp'
  import { mapGetters } from 'vuex'
  export default {
    name: 'aggrlightapp',
    data() {
      return {
        obj:{},
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        selectedOptions: [],
        serviceMode: []
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
      handlePost(file, done, loading) {
        const isLt5M = file.size / 1048576 < 5;
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
          return
        }
        let fd = new FormData();
        fd.append('file', file)
        upload(fd).then(response => {
          this.obj.photoUrl = response.data.url;
          this.obj.photoName = response.data.fileName;
        })
        loading()
      },
      selectionChange(list){
        this.selectedOptions = list
      },
      getType(){
        getCodeDetailFromDB("service_mode").then(response => {
          this.serviceMode = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceMode'){
              this.tableOption.column[i].dicData = this.serviceMode
            }
          }
        })
        getCodeDetailFromDB("service_type").then(response => {
          let serviceType = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceCategory'){
              this.tableOption.column[i].dicData = serviceType
            }
          }
        })
        getCodeDetailFromDB("service_topice").then(response => {
          let serviceTopice = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceTopice'){
              this.tableOption.column[i].dicData = serviceTopice
            }
          }
        })
        getDept().then(response => {
          let deptOptions = response.data.data
          let serviceDpt = []
          for ( var i = 0; i <deptOptions.length; i++){
            serviceDpt.push({'label': deptOptions[i].cname, 'value' : deptOptions[i].code })
          }
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceDpt'){
              this.tableOption.column[i].dicData = serviceDpt
            }
          }
        })
        getGroupMsg().then(response => {
          let groupOptions = response.data.data
          let groups = []
          for ( var i = 0; i <groupOptions.length; i++){
            groups.push({'label': groupOptions[i].cname, 'value' : groupOptions[i].code })
          }
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'groups'){
              this.tableOption.column[i].dicData = groups
            }
          }
        })
        var validateServiceTime = (rule, value, callback) => {
          var selectedLabel = ''
          for ( var i = 0; i < this.serviceMode.length; i++){
            if(this.serviceMode[i].value ==this.obj.serviceMode) {
              selectedLabel = this.serviceMode[i].label
            }
          }
          if(selectedLabel.indexOf('线下') > -1 && !value){
            callback(new Error('请输入办理时间'));
          } else {
            callback();
          }
        };
        var validateProcessingPlace = (rule, value, callback) => {
          var selectedLabel = ''
          for ( var i = 0; i < this.serviceMode.length; i++){
            if(this.serviceMode[i].value ==this.obj.serviceMode) {
              selectedLabel = this.serviceMode[i].label
            }
          }
          if(selectedLabel.indexOf('线下') > -1 && !value){
            callback(new Error('请输入办理地点'));
          } else {
            callback();
          }
        };
        for ( var i = 0; i <this.tableOption.column.length; i++){
          if(this.tableOption.column[i].prop == 'serviceTime'){
            this.tableOption.column[i].rules[0].validator = validateServiceTime
          }
        }
        for ( var i = 0; i <this.tableOption.column.length; i++){
          if(this.tableOption.column[i].prop == 'processingPlace'){
            this.tableOption.column[i].rules[0].validator = validateProcessingPlace
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
      rowDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除当前轻应用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return delObj(row.lightappId)
          }).then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.page.page = 1;
          this.getList(this.page);
        }).catch(function(err) { })
      },
      handleBatchDel() {
        var lightappIds = []
        for ( var i = 0; i <this.selectedOptions.length; i++){
          lightappIds.push(this.selectedOptions[i].lightappId)
        }
        if(lightappIds.length == 0){
            this.$message.error('请至少选中一条门户数据！');
            return false
        }
        var _this = this
        this.$confirm('是否确认删除当前选中的所有轻应用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return batchDelObj(lightappIds)
          }).then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.page.page = 1;
          this.getList(this.page);
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
          this.page.page = 1;
          this.getList(this.page);
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
          this.page.page = 1;
          this.getList(this.page);
        })
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page);
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
