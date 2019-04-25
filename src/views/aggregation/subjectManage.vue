<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-row>
                <el-col :xs="24" :sm="24" :md="5" class="user__tree">
                    <div class="main_left_content">
                        <template v-if="form.subjectId || form.gatewayId">
                            <div class="filter-container">
                                <el-button-group>
                                    <el-button type="primary"
                                                icon="plus"
                                                size="small"
                                                @click="handlerAdd">新增下级
                                    </el-button>
                                    <el-button type="warning"
                                                v-if="form.typeFlag"
                                                icon="edit"
                                                size="small"
                                                @click="handlerEdit">编辑
                                    </el-button>
                                    <el-button type="danger"
                                                v-if="form.typeFlag"
                                                icon="delete"
                                                size="small"
                                                @click="handleDelete">删除
                                    </el-button>
                                </el-button-group>
                            </div>
                        </template>
                        <el-tree class="filter-tree"
                                node-key="id"
                                highlight-current
                                :expand-on-click-node="false"
                                :data="treeData"
                                ref="tree"
                                @node-click="getNodeData">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="19" class="user__main">
                    <div class="main_right_content">
                        <el-card class="box-card">
                            <el-form label-position=right
                                :rules="formRules"
                                label-width="80px"
                                :model="form"
                                ref="form">
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="form.name" :disabled="formEdit"
                                        placeholder="请输入名称"></el-input>
                                </el-form-item>
                                <el-form-item label="编码" prop="code">
                                    <el-input v-model="form.code" :disabled="formEdit"
                                        placeholder="请输入编码"></el-input>
                                </el-form-item>
                                <template v-if="!form.typeFlag">
                                    <el-form-item label="类型" prop="type">
                                        <el-select class="filter-item"
                                                v-model="form.type"
                                                :disabled="formEdit"
                                                placeholder="请选择类型">
                                        <el-option v-for="item in  gatewayTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                                <template v-if="form.typeFlag">
                                    <el-form-item label="类型" prop="typeFlag">
                                        <el-select class="filter-item"
                                                v-model="form.typeFlag"
                                                :disabled="formEdit"
                                                placeholder="请选择类型">
                                        <el-option v-for="item in  typeFlagOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="排序" prop="sort">
                                        <el-input v-model="form.sort" :disabled="formEdit"
                                            type="number" placeholder="请输入排序"></el-input>
                                    </el-form-item>
                                    <el-form-item label="显示性质" prop="showType">
                                        <el-radio-group v-model="form.showType" :disabled="formEdit">
                                            <el-radio v-for="item in showTypeOptions" 
                                                :label="item.value" 
                                                :key="item.value">{{item.label}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </template>
                                <el-form-item label="启用状态" prop="status">
                                    <el-radio v-model="form.status" :disabled="formEdit" label="1">启用</el-radio>
                                    <el-radio v-model="form.status" :disabled="formEdit" label="2">禁用</el-radio>
                                </el-form-item>
                                <template v-if="form.typeFlag">
                                    ------------------------------------------------------------------------------------------------------------------------------
                                </template>
                                <template v-if="form.typeFlag == '14' || form.typeFlag == '15'">
                                    <el-form-item label="链接" prop="url">
                                        <el-input v-model="form.url" :disabled="formEdit"
                                            placeholder="请输入链接"></el-input>
                                    </el-form-item>
                                    <el-form-item label="描述" prop="describeMsg">
                                        <el-input v-model="form.describeMsg" :disabled="formEdit"
                                            type="textarea" :rows="2" placeholder="请输入描述"></el-input>
                                    </el-form-item>
                                </template>
                                <template v-if="form.typeFlag == '15'">
                                    <el-form-item label="打开方式" prop="open_mode">
                                        <el-select class="filter-item" v-model="form.openMode" :disabled="formEdit"
                                                placeholder="请选择打开方式">
                                        <el-option v-for="item in  openModeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                                <template v-if="form.typeFlag == '11'">
                                    <el-form-item label="操作类型" prop="operationType">
                                        <el-radio-group v-model="form.operationType" :disabled="formEdit">
                                            <el-radio v-for="item in operationTypeOptions" 
                                                :label="item.value" 
                                                :key="item.value">{{item.label}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </template>
                                <template v-if="form.typeFlag != '12' && form.typeFlag">
                                    <el-form-item label="用户组" prop="groupMsg">
                                        <el-select class="filter-item" multiple 
                                                v-model="form.groupMsg"
                                                :disabled="formEdit"
                                                placeholder="请输入用户组">
                                        <el-option v-for="item in  groupMsgOptions"
                                                    :key="item.code"
                                                    :label="item.cname"
                                                    :value="item.code"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                                <template v-if="form.typeFlag == '12'">
                                    <el-form-item label="轻应用" prop="lightapp">
                                        <img :src="form.photoUrl" style="width:10%">
                                        <el-button type="primary" @click="selectLightApp" style="margin-left:15px;" v-if="!formEdit">选择应用</el-button>
                                        <div>
                                            <span>{{form.lightappName}}</span>
                                        </div>
                                    </el-form-item>
                                </template>
                                <template v-if="form.typeFlag == '13'">
                                    <el-button type="primary" icon="plus" @click="addSlideShow" v-if="!formEdit">添加</el-button>
                                    <el-table :data="form.slideShowMsg" stripe border style="width: 100%;margin-top:15px;">
                                        <el-table-column prop="sort" label="排序" width="50"></el-table-column>
                                        <el-table-column prop="photo_url" label="图片" width="70">
                                            <template slot-scope="scope">
                                                <img  :src="scope.row.photo_url" alt="" style="width: 50px;height: 50px">
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="名称" width="180"></el-table-column>
                                        <el-table-column prop="url" label="链接" width="200"></el-table-column>
                                        <el-table-column prop="describe_msg" label="描述"></el-table-column>
                                        <el-table-column prop="open_mode" :formatter="openModeFormatter" label="打开方式" width="100"></el-table-column>
                                        <el-table-column label="操作" width="90" v-if="!formEdit">
                                            <template slot-scope="scope">
                                                <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
                                                <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                                <el-dialog title="添加轮播图图片" :visible.sync="addSlideShowFlag">
                                    <el-form :model="slideShowForm" :rules="slideShowDialogRules" label-width="80px" ref="slideShowForm">
                                        <el-form-item label="排序" prop="sort">
                                            <el-input v-model="slideShowForm.sort"
                                                type="number" placeholder="请输入排序"></el-input>
                                        </el-form-item>
                                        <el-form-item label="图片" prop="photo_url">
                                            <el-upload
                                                class="avatar-uploader"
                                                action=""
                                                :show-file-list="false"
                                                :http-request="handlePost">
                                                <img v-if="slideShowForm.photo_url" :src="slideShowForm.photo_url" class="avatar">
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                                        </el-form-item>
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="slideShowForm.name"
                                                placeholder="请输入名称"></el-input>
                                        </el-form-item>
                                        <el-form-item label="链接" prop="url">
                                            <el-input v-model="slideShowForm.url"
                                                placeholder="请输入链接"></el-input>
                                        </el-form-item>
                                        <el-form-item label="描述" prop="describe_msg">
                                            <el-input v-model="slideShowForm.describe_msg"
                                                type="textarea" :rows="2" placeholder="请输入描述"></el-input>
                                        </el-form-item>
                                        <el-form-item label="打开方式" prop="open_mode">
                                            <el-select class="filter-item" v-model="slideShowForm.open_mode"
                                                    placeholder="请选择打开方式">
                                            <el-option v-for="item in  openModeOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="addSlideShowFlag = false">取 消</el-button>
                                        <el-button type="primary" @click="checkValidate('slideShowForm')">确 定</el-button>
                                    </div>
                                </el-dialog>
                                <el-dialog title="选择轻应用" :visible.sync="selectLightAppFlag">
                                    <el-form-item label="名称" label-width="80px">
                                        <el-input v-model="searchAppName" placeholder="请输入名称" @change="searchLightApp"></el-input>
                                    </el-form-item>
                                    <el-table :data="allLightApp" stripe border highlight-current-row @current-change="selectOneApp"
                                        style="width: 100%;margin-top:15px;" v-loading="tableLoading">
                                        <el-table-column prop="name" label="名称"></el-table-column>
                                        <el-table-column prop="photoUrl" label="图片">
                                            <template slot-scope="scope">
                                                <img  :src="scope.row.photoUrl" alt="" style="width: 50px;height: 50px">
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="lightappId" label="ID"></el-table-column>
                                    </el-table>
                                    <br>
                                    <el-pagination
                                        style=" float: right;"
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange"
                                        background
                                        :current-page="page.currentPage"
                                        :page-sizes="[10, 20, 30, 40, 50, 100]"
                                        :page-size="page.pageSize"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total">
                                    </el-pagination>
                                    <br><br>
                                </el-dialog>
                                <el-form-item v-if="!formEdit" style='margin-top:15px;float: right;'>
                                    <el-button type="primary" @click="checkValidate('form')">保存</el-button>
                                    <el-button @click="onCancel">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </basic-container>
    </div>
</template>
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
</style>
<script>
    import {upload, fetchList, addObj, delObj, fetchMenuTree, getCodeDetailFromDB, getGroupMsg, getObj} from '@/api/aggregation/subjectManage'
    import {mapGetters} from 'vuex'
    export default {
        name: 'subject',
        data() {
            return {
                searchAppName:'',
                addSlideShowFlag: false,
                selectLightAppFlag: false,
                gatewayTypeOptions: [],
                typeFlagOptions: [],
                showTypeOptions: [],
                operationTypeOptions: [],
                groupMsgOptions: [],
                openModeOptions: [],
                formEdit: true,
                treeData: [],
                form: {
                    subjectId: undefined,
                    gatewayId: undefined,
                    typeFlag: undefined,
                    name: undefined,
                    sort: undefined,
                    status: undefined,
                    showType: undefined,
                    operationType: undefined,
                    parentSubjectId: undefined,
                    groupMsg: undefined,
                    photoUrl: undefined,
                    lightappId: undefined,
                    lightappName: undefined,
                    url: undefined,
                    describeMsg: undefined,
                    openMode: undefined,
                    code: undefined,
                    type: undefined,
                    slideShowMsg: []
                },
                slideShowForm: {
                    sort: undefined,
                    photo_url: undefined,
                    file_name: undefined,
                    name: undefined,
                    url: undefined,
                    describe_msg: undefined,
                    open_mode: undefined,
                    slideshow_id: undefined,
                    subject_id: undefined,
                    create_user: undefined,
                    create_time: undefined
                },
                allLightApp: [],
                tableLoading: false,
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                slideShowIndex:-1,
                slideShowDialogRules: {
                    sort: [
                        { required: true, message: '请输入排序', trigger: 'blur' },
                    ],
                    photo_url: [
                        { required: true, message: '请选择图片', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '请输入链接', trigger: 'blur' }
                    ],
                    open_mode: [
                        { required: true, message: '请选择打开方式', trigger: 'change' }
                    ]
                },
                formRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    typeFlag: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序', trigger: 'blur' },
                    ],
                    showType: [
                        { required: true, message: '请选择显示性质', trigger: 'change' },
                    ],
                    status: [
                        { required: true, message: '请选择启用状态', trigger: 'change' },
                    ],
                    url: [
                        { required: true, message: '请输入链接', trigger: 'blur' },
                    ],
                    operationType: [
                        { required: true, message: '请选择操作类型', trigger: 'change' },
                    ]
                }
            }
        },
        created() {
            this.getList()
            this.getType()
        },
        methods: {
            getList() {
                // 获取左侧下拉树
                fetchMenuTree().then(response => {
                    this.treeData = response.data.data
                })
            },
            getType() {
                // 获取用户组信息
                getGroupMsg().then(response => {
                    this.groupMsgOptions = response.data.data
                })
                getCodeDetailFromDB("gateway_type").then(response => {
                    this.gatewayTypeOptions = response.data.data
                })
                getCodeDetailFromDB("type_flag").then(response => {
                    this.typeFlagOptions = response.data.data
                })
                getCodeDetailFromDB("show_type").then(response => {
                    this.showTypeOptions = response.data.data
                })
                getCodeDetailFromDB("operation_type").then(response => {
                    this.operationTypeOptions = response.data.data
                })
                getCodeDetailFromDB("open_mode").then(response => {
                    this.openModeOptions = response.data.data
                })
            },
            openModeFormatter(row) {
                for(var i = 0; i < this.openModeOptions.length; i++) {
                    if(this.openModeOptions[i].value == row.open_mode) {
                        return this.openModeOptions[i].label
                    }
                }
            },
            checkValidate(formName) {
                // 表单验证是否通过
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName == 'slideShowForm'){
                            this.submitForm(formName)
                        } else {
                            this.create()
                        }
                    } else {
                        return false;
                    }
                });
            },
            submitForm(formName) {
                // 提交轮播图图片信息表单到页面上
                if(this.slideShowIndex != -1){
                    // 编辑
                    this.$set(this.form.slideShowMsg, this.slideShowIndex, JSON.parse(JSON.stringify(this.slideShowForm)))
                } else {
                    // 新增
                    this.form.slideShowMsg.push(JSON.parse(JSON.stringify(this.slideShowForm)))
                }
                this.addSlideShowFlag = false
                this.$refs[formName].resetFields();
            },
            handleClick(row,index) {
                // 编辑轮播图图片信息
                this.slideShowIndex = index
                this.addSlideShowFlag = true
                this.slideShowForm = JSON.parse(JSON.stringify(row))
            },
            addSlideShow(){
                // 添加轮播图图片信息
                if(this.$refs['slideShowForm']){
                    this.$refs['slideShowForm'].resetFields();
                }
                this.addSlideShowFlag = true
                this.slideShowIndex = -1
            },
            deleteRow(index) {
                // 删除轮播图图片信息
                this.form.slideShowMsg.splice(index, 1);
            },
            getNodeData(data) {
                this.formEdit = true
                // 获取节点详细信息
                let subjectId = -1;
                let gatewayId = -1;
                if(data.parentId == 0){
                    gatewayId = data.id;
                } else {
                    subjectId = data.id;
                }
                getObj(subjectId, gatewayId).then(response => {
                    this.form = response.data.data
                    if(this.form.slideShowMsg){
                        this.slideShowForm.subject_id = this.form.subjectId
                    }
                })
            },
            selectLightApp(){
                // 点击选择轻应用按钮时
                this.selectLightAppFlag = true
                this.searchAppName = ''
                this.page.total = 0
                this.page.currentPage = 1
                this.page.pageSize = 20
                this.searchLightApp()
            },
            searchLightApp() {
                // 条件查询轻应用
                this.tableLoading = true
                fetchList(Object.assign({
                    current: this.page.currentPage,
                    size: this.page.pageSize
                }, {'name':this.searchAppName})).then(response => {
                this.allLightApp = response.data.data.records
                this.page.total = response.data.data.total
                this.tableLoading = false
                })
            },
            handleSizeChange(val) {
                // 轻应用查询弹窗中，每页表格显示条数发生改变时
                this.page.pageSize = val
                this.searchLightApp()
            },
            handleCurrentChange(val) {
                // 轻应用查询弹窗中，当前表格页码发生变化时
                this.page.currentPage = val
                this.searchLightApp()
            },
            selectOneApp(val){
                // 轻应用查询弹窗中，点击表格中的一行数据，将数据信息放到form里
                this.form.photoUrl = val.photoUrl
                this.form.lightappName = val.name
                this.form.lightappId = val.lightappId
                this.selectLightAppFlag = false
            },
            handlerAdd() {
                // 新增节点
                let gatewayId = JSON.parse(JSON.stringify(this.form.gatewayId))
                let parentSubjectId = JSON.parse(JSON.stringify(this.form.subjectId))
                this.formEdit = false
                // 表单重置方法会漏掉某些属性，所以手动再重置一遍
                this.form.subjectId = undefined
                this.form.gatewayId = JSON.parse(JSON.stringify(gatewayId))
                this.form.typeFlag = '11'
                this.form.name = undefined
                this.form.sort = undefined
                this.form.status = '1'
                this.form.showType = '11'
                this.form.operationType = '11'
                this.form.parentSubjectId = JSON.parse(JSON.stringify(parentSubjectId))
                this.form.groupMsg = []
                this.form.photoUrl = undefined
                this.form.lightappId = undefined
                this.form.lightappName = undefined
                this.form.url = undefined
                this.form.describeMsg = undefined
                this.form.openMode = undefined
                this.form.code = undefined
                this.form.type = undefined
                this.form.slideShowMsg = []
            },
            handlerEdit() {
                this.formEdit = false
            },
            handleDelete() {
                if(this.$refs.tree.getCurrentNode().children){
                    this.$message.error('当前节点包含子节点，不可删除！');
                    return false
                }
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(this.form.subjectId).then(() => {
                        this.getList()
                        this.$alert('删除成功！', '成功', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.getNodeData({id: this.form.gatewayId,parentId : 0})
                                this.$refs.tree.setCurrentKey(this.form.gatewayId)
                            }
                        });
                    })
                })
            },
            create() {
                // 保存
                // 如果是轻应用，则判断是否已经选择轻应用
                if(this.form.typeFlag == '12' && !this.form.lightappId) {
                    this.$message.error('请选择轻应用！');
                    return false
                }
                // 如果是轮播图，则至少选择一张图片
                if(this.form.typeFlag == '13' && this.form.slideShowMsg.length < 1) {
                    this.$message.error('请添加至少一张图片！');
                    return false
                }
                addObj(this.form).then(response => {
                    this.getList()
                    this.$alert('保存成功！', '成功', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.getNodeData({id: response.data.data,parentId : 0})
                            this.$refs.tree.setCurrentKey(response.data.data)
                        }
                    });
                })
            },
            onCancel() {
                // 取消表单提交
                this.getNodeData(this.$refs.tree.getCurrentNode())
            },
             handlePost(file) {
                const isLt5M = file.file.size / 1048576 < 5;
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                    return
                }
                let fd = new FormData();
                fd.append('file', file.file)
                upload(fd).then(response => {
                    this.slideShowForm.photo_url = response.data.url;
                    this.slideShowForm.file_name = response.data.fileName;
                })
            }
        }
    }
</script>
