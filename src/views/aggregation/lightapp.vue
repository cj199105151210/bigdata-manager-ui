<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="main_middle_content">
        <avue-crud ref="crud"
                    :page="page"
                    :data="tableData"
                    :table-loading="tableLoading"
                    :option="tableOption"
                    @selection-change="selectionChange"
                    @search-change="handleFilter"
                    @on-load="getList"
                    @refresh-change="refreshChange">
            <template slot="menuLeft">
            <el-button type="primary"
                        @click="handleAdd"
                        size="small">新 增</el-button>
            <el-button type="danger"
                        @click="handleBatchDel"
                        size="small">删除</el-button>
            </template>
            <template slot-scope="scope"
                    slot="menu">
            <el-button type="text"
                        icon="el-icon-view"
                        size="small"
                        plain
                        @click="handleSearch(scope.row,scope.index)">查看</el-button>
            <el-button type="text"
                        icon="el-icon-edit"
                        size="small"
                        plain
                        @click="handleEdit(scope.row,scope.index)">编辑</el-button>
            <el-button type="text"
                        icon="el-icon-delete"
                        size="small"
                        plain
                        @click="rowDel(scope.row,scope.index)">删除</el-button>
            </template>
        </avue-crud>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFlag">
          <div class="dialog-main-tree">
            <el-form :model="dialogForm" :rules="dialogFormRules" label-width="80px" ref="dialogForm">
              <el-form-item label="应用图标" prop="photoUrl">
                  <el-upload
                      class="avatar-uploader"
                      :disabled="dialogEdit"
                      action=""
                      :show-file-list="false"
                      :http-request="handlePost">
                      <img v-if="dialogForm.photoUrl" :src="dialogForm.photoUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
              </el-form-item>
              <el-form-item label="应用名称" prop="name">
                  <el-input v-model="dialogForm.name" placeholder="应用名称" :disabled="dialogEdit"></el-input>
              </el-form-item>
              <el-form-item label="应用链接" prop="url">
                  <el-input v-model="dialogForm.url" placeholder="应用链接" :disabled="dialogEdit"></el-input>
              </el-form-item>
              <el-form-item label="编码" prop="code">
                  <el-input v-model="dialogForm.code" placeholder="编码" :disabled="dialogEdit"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                  <el-radio v-model="dialogForm.status" :disabled="dialogEdit" label="1">启用</el-radio>
                  <el-radio v-model="dialogForm.status" :disabled="dialogEdit" label="0">禁用</el-radio>
              </el-form-item>
              <el-form-item label="服务类别" prop="serviceCategory">
                  <el-select class="filter-item" v-model="dialogForm.serviceCategory"
                          placeholder="请选择服务类别" :disabled="dialogEdit" clearable>
                  <el-option v-for="item in  serviceCategory"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="服务专题" prop="serviceTopice">
                  <el-select class="filter-item" v-model="dialogForm.serviceTopice"
                          placeholder="请选择服务专题" :disabled="dialogEdit" clearable >
                  <el-option v-for="item in  serviceTopice"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="服务方式" prop="serviceMode">
                  <el-select class="filter-item" v-model="dialogForm.serviceMode"
                          placeholder="请选择服务方式" :disabled="dialogEdit" clearable >
                  <el-option v-for="item in  serviceMode"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="用户组" prop="groups">
                <treeselect v-model="dialogForm.groups" 
                  :multiple="true" 
                  :options="groupMsgOptions" 
                  value-consists-of="ALL" 
                  placeholder="请选择用户组"
                  :disabled="treeDisabled"/>
              </el-form-item>
              <el-form-item label="办理时间" prop="serviceTime">
                <el-time-picker is-range v-model="dialogForm.serviceTime" 
                  range-separator="至" 
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :disabled="dialogEdit">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="办理地点" prop="processingPlace">
                  <el-input v-model="dialogForm.processingPlace" placeholder="办理地点" :disabled="dialogEdit"></el-input>
              </el-form-item>
              <el-form-item label="服务部门" prop="serviceDpt">
                <treeselect v-model="dialogForm.serviceDpt" 
                  :options="serviceDpt" 
                  value-consists-of="ALL" 
                  placeholder="请选择服务部门"
                  :disabled="treeDisabled"/>
              </el-form-item>
              <el-form-item label="联系人" prop="contacts">
                  <el-input v-model="dialogForm.contacts" placeholder="联系人" :disabled="dialogEdit"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="contactNumber">
                  <el-input v-model="dialogForm.contactNumber" placeholder="联系电话" :disabled="dialogEdit"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="describeMsg">
                    <quill-editor
                      :disabled="dialogEdit"
                      class="quill_editor"
                      ref="textEditor"
                      v-model="dialogForm.describeMsg"
                      :options="editorOption"
                      ></quill-editor>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveOrUpdate()" v-if="!dialogEdit">确 定</el-button>
            <el-button @click="dialogFlag = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </basic-container>
  </div>
</template>

<script>
  import { fetchList, delObj, getDept, upload, batchDelObj, saveOrUpdate, checkName, checkCode } from '@/api/aggregation/aggrlightapp'
  import {getCodeDetailFromDB, getGroupMsg} from '@/api/aggregation/subjectManage'
  import { tableOption } from '@/const/crud/aggregation/aggrlightapp'
  import { mapGetters } from 'vuex'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    name: 'aggrlightapp',
    components: {
      Treeselect 
    },
    data() {
      var validateServiceTime = (rule, value, callback) => {
        var selectedLabel = ''
        for ( var i = 0; i < this.serviceMode.length; i++){
          if(this.serviceMode[i].value ==this.dialogForm.serviceMode) {
            selectedLabel = this.serviceMode[i].label
          }
        }
        if(!value){
          value = []
        }
        if(selectedLabel.indexOf('线下') > -1 && value.length != 2){
          callback(new Error('请输入办理时间'));
        } else {
          callback();
        }
      };
      var validateProcessingPlace = (rule, value, callback) => {
        var selectedLabel = ''
        for ( var i = 0; i < this.serviceMode.length; i++){
          if(this.serviceMode[i].value ==this.dialogForm.serviceMode) {
            selectedLabel = this.serviceMode[i].label
          }
        }
        if(selectedLabel.indexOf('线下') > -1 && !value){
          callback(new Error('请输入办理地点'));
        } else {
          callback();
        }
      };
      var validateCheckName = (rule, value, callback) => {
        if(!value){
          callback(new Error('请输入应用名称'));
          return
        }
        if(value.length > 20 || value.length < 2){
          callback(new Error('名称最小长度为2，最大长度为20'));
          return
        }
        checkName(value, this.dialogForm.lightappId).then(response => {
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
        checkCode(value, this.dialogForm.lightappId).then(response => {
          if (response.data) {
            callback(new Error('该编码已存在！请重新输入'));
          } else {
            callback();
          }
        })
      };
      return {
        search:{
          groups:undefined
        },
        treeDisabled:undefined,
         // 富文本编辑器
        editorOption: {
          modules: {
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote"],
              [{list: "ordered"},{list: "bullet"}],
              [{script: "sub"},{ script: "super"}],
              [{ indent: "-1"},{ indent: "+1"}],
              [{ size: ["small", false, "large", "huge"]}],
              [{ color: []},{ background: [] }],
              ["clean"],
              [{ align: []}],
              ['image','video']    //上传图片、上传视频
            ]
          },
          placeholder: "请输入文章内容 ..."
        },
        param: {},
        serviceDpt: [],
        groupMsgOptions: [],
        serviceTopice:[],
        serviceCategory:[],
        dialogEdit:false,
        dialogForm:{
          lightappId: undefined,
          photoUrl: undefined,
          name: undefined,
          photoName: undefined,
          url: undefined,
          status: undefined,
          code: undefined,
          serviceCategory: undefined,
          serviceTopice: undefined,
          serviceTime: [],
          processingPlace: undefined,
          serviceMode: undefined,
          groups: undefined,
          serviceDpt: undefined,
          contacts: undefined,
          contactNumber: undefined,
          describeMsg: undefined
        },
        dialogFormRules:{
          photoUrl: [
              { required: true, message: '请选择应用图标', trigger: 'blur' },
          ],
          name: [
            { validator: validateCheckName, trigger: 'blur' },
            { required: true, message: '请输入应用名称', trigger: 'blur' },
          ],
          url: [
              { required: true, message: '请填写应用链接', trigger: 'blur' },
          ],
          status: [
              { required: true, message: '请选择状态', trigger: 'blur' },
          ],
          code: [
            { validator: validateCheckCode, trigger: 'blur' },
            { required: true, message: '请输入编码', trigger: 'blur' },
          ],
          serviceCategory: [
              { required: true, message: '请选择服务类别', trigger: 'blur' },
          ],
          serviceTopice: [
              { required: true, message: '请选择服务专题', trigger: 'blur' },
          ],
          serviceTime: [
              { validator: validateServiceTime, trigger: 'blur' },
          ],
          processingPlace: [
              { validator: validateProcessingPlace, trigger: 'blur' },
          ],
          serviceMode: [
              { required: true, message: '请选择服务方式', trigger: 'blur' },
          ],
          groups: [
              { required: true, message: '请选择用户组', trigger: 'blur' },
          ],
          serviceDpt: [
              { required: true, message: '请选择服务部门', trigger: 'blur' },
          ]
        },
        dialogTitle:'',
        dialogFlag: false,
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
      handlePost(file) {
        const isLt5M = file.file.size / 1048576 < 5;
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
          return
        }
        let fd = new FormData();
        fd.append('file', file.file)
        upload(fd).then(response => {
          this.dialogForm.photoUrl = response.data.url;
          this.dialogForm.photoName = response.data.fileName;
        })
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
          this.serviceCategory = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceCategory'){
              this.tableOption.column[i].dicData = this.serviceCategory
            }
          }
        })
        getCodeDetailFromDB("service_topice").then(response => {
          this.serviceTopice = response.data.data;
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceTopice'){
              this.tableOption.column[i].dicData = this.serviceTopice
            }
          }
        })
        getDept().then(response => {
          this.serviceDpt = response.data.data[1]
          let deptOptions = response.data.data[0]
          let serviceDptOpt = []
          for ( var i = 0; i <deptOptions.length; i++){
            serviceDptOpt.push({'label': deptOptions[i].cname, 'value' : deptOptions[i].code })
          }
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'serviceDpt'){
              this.tableOption.column[i].dicData = serviceDptOpt
            }
          }
        })
        getGroupMsg().then(response => {
          this.groupMsgOptions = response.data.data[1]
          let groupOptions = response.data.data[0]
          let groups = []
          for ( var i = 0; i <groupOptions.length; i++){
            groups.push({'label': groupOptions[i].cname, 'value' : groupOptions[i].guid })
          }
          for ( var i = 0; i <this.tableOption.column.length; i++){
            if(this.tableOption.column[i].prop == 'groups'){
              this.tableOption.column[i].dicData = groups
            }
          }
        })
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
        let formName = 'dialogForm'
        this.dialogEdit = false
        this.treeDisabled = undefined
        this.dialogFlag = true
        this.dialogTitle = '新增'
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
        this.dialogForm.lightappId = undefined
        this.dialogForm.photoUrl = undefined
        this.dialogForm.name = undefined
        this.dialogForm.photoName = undefined
        this.dialogForm.url = undefined
        this.dialogForm.status = '1'
        this.dialogForm.code = undefined
        this.dialogForm.serviceCategory = undefined
        this.dialogForm.serviceTopice = undefined
        this.dialogForm.serviceTime = ['','']
        this.dialogForm.processingPlace = undefined
        this.dialogForm.serviceMode = undefined
        this.dialogForm.groups = []
        this.dialogForm.serviceDpt = undefined
        this.dialogForm.contacts = undefined
        this.dialogForm.contactNumber = undefined
        this.dialogForm.describeMsg = undefined
      },
      handleSearch(row, index) {
        this.dialogForm = JSON.parse(JSON.stringify(row))
        this.dialogEdit = true
        this.treeDisabled = 'disabled'
        this.dialogFlag = true
        this.dialogTitle = '查看'
        let formName = 'dialogForm'
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
      },
      handleEdit(row, index) {
        this.dialogForm = JSON.parse(JSON.stringify(row))
        this.dialogEdit = false
        this.treeDisabled = undefined
        this.dialogFlag = true
        this.dialogTitle = '编辑'
        let formName = 'dialogForm'
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
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
          this.getList(this.page, this.param);
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
          this.getList(this.page, this.param);
        }).catch(function(err) { })
      },
      saveOrUpdate: function(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            saveOrUpdate(this.dialogForm).then(data => {
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              this.page.page = 1;
              this.getList(this.page, this.param);
              let formName = 'dialogForm'
              if(this.$refs[formName]){
                this.$refs[formName].resetFields();
              }
              this.dialogFlag = false;
           })
          } else {
            return false;
          }
        });
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

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .quill_editor {
    width: 90%;
    height: 260px;
  }
  .dialog-main-tree .el-form-item__content {
    width: 90%;
  }
</style>
