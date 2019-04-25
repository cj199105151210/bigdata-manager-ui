<template>
  <!-- 流程岗位管理 -->
  <div id="flowPosition">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="7" class="user__tree">
          <div class="main_left_content">
            <!--操作按钮展示-->
            <el-button-group>
              <el-button type="primary" size="small" @click="insertNode()">增加</el-button>
              <el-button type="warning" size="small" @click="updateNode()">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteNode()">删除</el-button>
              <el-button type="primary" size="small" @click="crewManage()">人员管理</el-button>
            </el-button-group>
            <!--左侧树展示-->
            <div>
              <el-scrollbar style="height:460px;width:100%;" wrap-style="overflow-x: hidden;">
                <el-tree class="filter-tree" ref="myTree"
                  :data="treeData" 
                  node-key="id"
                  :props="defaultProps"
                  highlight-current
                  check-strictly
                  @node-click="handleNodeClick">
                </el-tree>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="17" class="user__main">
          <!--右侧详情展示-->
          <div class="main_right_content">
            <el-form :model="showForm" ref="showForm"  label-width="100px" style="height:100%;">
              <el-form-item label="名称" prop="cname">
                <el-input v-model="showForm.cname" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="简称" prop="shortName">
                <el-input v-model="showForm.shortName" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="编码" prop="code">
                <el-input v-model="showForm.code" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="sortNo">
                <el-input v-model="showForm.sortNo" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-input v-model="showForm.createTime" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="创建人" prop="createUser">
                <el-input v-model="showForm.createUser" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="showForm.description" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </basic-container>



    <!--增加子节点弹窗数据-->
    <el-dialog :title="userGroupTitle" :visible.sync="dialogAddForm" :close-on-click-modal="false" :modal="false" :before-close="closeDialog">
      <el-form :model="addForm" :rules="rules" ref="addForm" :hide-required-asterisk="ast" label-width="150px">
        <el-form-item label="流程岗位名称" prop="cname">
          <el-input v-model="addForm.cname" auto-complete="off" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="流程岗位Code" prop="code">
          <el-input v-model="addForm.code" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="节点Id" prop="parentId" hidden>
          <el-input v-model="addForm.parentId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="主键Id" prop="guid" hidden>
          <el-input v-model="addForm.guid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新增修改标识" prop="flag" hidden>
          <el-input v-model="addForm.flag" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitAddForm('addForm')">保存</el-button>
        <el-button @click="resetAddForm('addForm')">取消</el-button>
      </div>
    </el-dialog>

    <!--人员管理弹窗数据-->
    <el-dialog :visible.sync="dialogCrewForm" :close-on-click-modal="false">
      <el-row style="text-align:center;line-height:40px;" id="buttonRow">
        <el-button type="text" id="buttonType1" :class="{'activeClass':isStart1 }" size="medium" @click="getDataByType('1')">|按组织机构</el-button>
        <el-button type="text" id="buttonType2" :class="{'activeClass':isStart2 }" size="medium" @click="getDataByType('2')">|按用户组</el-button>
        <el-button type="text" id="buttonType3" :class="{'activeClass':isStart3 }" size="medium" @click="getDataByType('3')">|按流程岗位</el-button>
        <!-- <el-button type="text" id="buttonType4" :class="{'activeClass':isStart4 }" size="medium" @click="getDataByType('4')">|个人组</el-button> -->
      </el-row>
      <!-- 查询框 -->
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="21">
          <el-input v-model="xmCondition" placeholder="请输入姓名"></el-input>
          <input v-model="treeType" hidden/>
        </el-col>
        <el-col :xs="24" :sm="24" :md="3">
          <el-button type="primary" size="medium" @click="searchByXM()">搜索</el-button>
        </el-col>
      </el-row> 

      <div id="dialogMain">
        <div id="dialogLeft" style="width:42%;">
          <!-- 左侧树 -->
          <div v-if="showLeftTree" style="height:100%;width:100%;">
            <el-scrollbar style="height:100%;width:100%;" wrap-style="overflow-x: hidden;">
              <el-tree class="filter-tree" ref="dialogTree" style="width:100%;height:450px;"
                :data="dialogTreeData" 
                node-key="id"
                :props="defaultProps"
                default-expand-all
                highlight-current
                check-strictly
                @node-click="handleNodeClickDialog">
              </el-tree>
            </el-scrollbar>
          </div>
          <div v-if="showLeftTable" style="height:100%;width:100%;">
            <el-table ref="leftTable" :data="leftTableData" height="420" border :header-cell-style="{color:'rgba(0,0,0,.85)'}"
              highlight-current-row  @current-change="handleCurrentLeftRow">
              <el-table-column prop="loginName" label="登录名" align="center" width="105px"></el-table-column>
              <el-table-column prop="xm" label="姓名" align="center" width="105px"></el-table-column>
              <el-table-column prop="orgName" label="所在机构" align="center" width="150px"></el-table-column>
            </el-table>
          </div>

          <div v-if="showPrivateGroup" style="height:100%;width:100%;">
            <!--个人组树形控件-->
            <el-scrollbar style="height:100%;width:100%;" wrap-style="overflow-x: hidden;">
              <el-tree ref="privateTree" style="width:100%;height:450px;"
                  :data="privateTreeData"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                  highlight-current
                  default-expand-all
                  check-strictly
                  :render-content="renderContent"
                  :check-on-click-node="checkOnClickNode"
                  :expand-on-click-node="expandClick">
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
        <!--箭头操作按钮-->
        <div id="dialogCenter" style="width:10%;">
          <div style="text-align:center;margin-top:150px;width:100%;height:200px">
            <div style="height:100px;width:90%;" @click="addCrew()">
              <img :src="rightArrow" style="width:80%;height:auto;margin-left:5px;"/>
            </div>
            <div style="height:100px;width:90%;" @click="removeCrew()">
              <img :src="leftArrow" style="width:78%;height:auto;margin-left:5px;;"/>
            </div>
          </div>
        </div>
        <div id="dialogRight" style="width:47.3%;">
          <div id="checkedUser" style="width:100%;height:7%;text-align:left;">
            <div><span style="margin-left:10px;font-size:15px;line-height:30px;">已选用户</span></div>
          </div>
          <!--右侧节点下人员展示区-->
          <div style="width:100%;height:93%;">
            <el-table ref="cacheTable" :data="cacheTableData" height="420"  :header-cell-style="{color:'rgba(0,0,0,.85)'}"
              highlight-current-row @current-change="handleCurrentCacheRow">
              <el-table-column prop="loginName" label="登录名" align="center" width="100px"></el-table-column>
              <el-table-column prop="xm" label="姓名" align="center" width="100px"></el-table-column>
              <el-table-column prop="orgName" label="所在机构" align="center" width="195px"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>

    <!--新增个人组节点弹窗-->
    <el-dialog :modal='false' width="27%" :visible.sync="addPrivatedialogVisible" 
            :close-on-click-modal="false" :before-close="closePirvateDialog" center>
      <el-form ref="addPrivateForm" :model="addPrivateForm" :rules="addPrivateNodeRules" label-width="120px" :hide-required-asterisk="ast">
        <el-form-item label="个人组名称" prop="cname">
          <el-input v-model="addPrivateForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="个人组code" prop="code">
          <el-input v-model="addPrivateForm.code" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="节点Id" prop="parentId" hidden>
        <el-input v-model="addPrivateForm.parentId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="主键Id" prop="guid" hidden>
          <el-input v-model="addPrivateForm.guid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新增修改标识" prop="flag" hidden>
          <el-input v-model="addPrivateForm.flag" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align:right;display: block;">
        <el-button type="primary" @click="submitPrivateAddForm('addPrivateForm')">保存</el-button>
        <el-button @click="resetPrivateAddForm('addPrivateForm')">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import TreeRender from '@/views/userCenter/tree_render';
  import { getTreeList } from "@/api/userCenter/organizationManage";
  import { getTableList,getAllUserList,getShowForm,getCacheTableList,insertNode,getNodeById,updateNode,deleteNode,
    getUserByTypeXM,adjustRelation,insertPrivateNode,updatePrivateNode,deletePrivateNode } from "@/api/userCenter/flowPositionManage";

  export default {
    name: 'flowPositionManage',
    data() {     
      return {
        rightArrow: require('@/assets/tree_images/rightArrow.png'),
        leftArrow: require('@/assets/tree_images/leftArrow.png'),
        treeData:[],
        expandClick:false,
        checkOnClickNode:true,
        defaultProps: {
            children: "children",
            label: "name"
        },
        editCheckId:'',
        tableData:[],
        total:0,
        pageSize:10,
        currentPage:1,
        dialogAddForm:false,
        dialogCrewForm:false,
        ast:true,
        addForm: {
          cname: '',
          code: '',
          parentId:'',
          id:'',
          flag:''
        },
        userGroupTitle:'',
        rules: {
          cname: [{ required: true, message: '请填写流程岗位名称', trigger: 'blur' }]
        },
        showForm: {
          cname: '',
          shortName: '',
          code: '',
          sortNo: '',
          createTime: '',
          createUser: '',
          description: ''
        },
        xmCondition:'',
        treeType:'',
        isStart1:false,
        isStart2:false,
        isStart3:false,
        isStart4:false,
        dialogTreeData:[],
        cacheTableData:[],
        leftTableData:[],
        currentCacheRow:null,
        currentLeftRow:null,
        oldOrgId:'',
        showLeftTree:true,
        showLeftTable:false,
        showPrivateGroup:false,
        privateTreeData:[],
        addPrivatedialogVisible:false,
        /*触发的当前的节点，放到全局，方便调用*/
        triggerCurrenNodeData:{},
        /*触发的当前节点*/
        triggerCurrenNode:{},
        /*新增个人组节点弹窗的输入框数据*/
        addPrivateForm:{
          cname: '',
          code: '',
          parentId:'',
          id:'',
          flag:''
        },
        addPrivateNodeRules: {
          cname: [{ required: true, message: '请填写个人组名称', trigger: 'blur' }]
        },
      }
    },
    mounted : function () {
      this.getTreeData("3","1");
    },
    methods:{
      getTreeData(type,isShowCrew){
        getTreeList(type,isShowCrew).then(res => {
          if (isShowCrew == "1") {
            // 给树赋值
            this.treeData = [];
            this.treeData = res.data.data;
            //给form表单赋值
            if (res.data.data != null && res.data.data.length !=0){
              let formData = res.data.data[0];
              getShowForm(formData.id).then(response => {
                this.showForm = response.data.data;
              })
            }
          } else {
            //给树赋值
            if (type === "4") {
              this.privateTreeData = [];
              this.privateTreeData = res.data.data;
            } else {
              this.dialogTreeData = [];
              this.dialogTreeData = res.data.data;
            }
          }
        })
      },
      handleNodeClick(item, node) {
        //点击勾选
        this.editCheckId = item.id;
        this.$refs.myTree.setCheckedKeys([item.id]);
        //给表格赋值
        this.getShowFormData(item.id);
        this.oldOrgId = item .id;
      },
      checkChange(item, node, self) {
        if (node==true) {//点击未选中复选框
          this.editCheckId = item.id;
          this.$refs.myTree.setCheckedKeys([item.id]);
          //显示人员管理界面
          this.showInfo=false;
          this.showCrewManage=true;
          //给表格赋值
          this.currentPage = 1;
          this.pageSize = 10;
          this.getTableData(item.id, this.currentPage, this.pageSize);
          this.oldOrgId = item.id;
        } else {
          if (this.editCheckId == item.id) {//点击已选中复选框，保证至少一个选中
            this.$refs.myTree.setCheckedKeys([item.id]);
          }
        }
      },
      getShowFormData(nodeId){
        getShowForm(nodeId).then(response => {
          this.showForm = response.data.data;
        })
        getAllUserList(nodeId).then(response => {
          this.tableData = response.data.data;
        })
      },
      getTableData(nodeId, currentPage, pageSize ){
        getTableList(nodeId, currentPage, pageSize).then(response => {
          this.tableData = response.data.data.list;
          //总记录数
          this.total = response.data.data.total;
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.currentPage = 1;
        this.getTableData(this.editCheckId, 1, val);
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val){
        this.currentPage = val;
         this.getTableData(this.editCheckId,val, this.pageSize);
        // console.log(`当前页: ${val}`);
      },
      insertNode(){
        var checkNode = this.$refs.myTree.getCheckedNodes();
        let parentId;
        let isLeaf;
        let codeData;
        if (checkNode.length === 0) {
          parentId = "0";
          isLeaf = false;
          codeData = this.treeData;
        } else {
          if (checkNode.length == 1) {
            isLeaf = true;
            parentId = checkNode[0].id;
            codeData = checkNode[0];
          } else {
            this.$message('请选取一个节点进行操作！');
            return;
          }
        }
        //动态获取code
        this.createDynamicCode(codeData,isLeaf);
        //显示弹窗
        this.dialogAddForm=true;
        this.userGroupTitle="新增";
        //表单赋值
        this.$nextTick(() => {
          this.addForm.parentId = parentId;
          this.addForm.flag = "add";
        });

        // var checkNode = this.$refs.myTree.getCheckedNodes();
        // if (checkNode.length === 1) {
        //   //动态获取code
        //   this.createDynamicCode(checkNode[0]);
        //   //显示弹窗
        //   this.dialogAddForm=true;
        //   //表单赋值
        //   this.$nextTick(() => {
        //     this.addForm.parentId = checkNode[0].id;
        //     this.addForm.flag = "add";
        //   });
        // } else {
        //   this.$message('请选取一个节点进行操作！');
        //   //关闭弹窗
        //   this.dialogAddForm=false;
        // }
      }, 
      createDynamicCode(node,isLeaf){
        var code;
        if (!isLeaf) {//如果是根节点，那么要找出最后一个根节点
          code = node.length + 1;
        } else {//如果不是根节点
          var childs = node.children;
          var max = 0;
          if (childs != null) {
            for (var i = 0; i < childs.length; i++) {
              var childNode = childs[i];
              var lastValue = childNode.code.split('-')[childNode.code.split('-').length - 1];
              if (max <= parseInt(lastValue)) {
                  max = parseInt(lastValue);
              }
            }
          }
          code = node.code + '-' + (max + 1);
        }

        // 给code赋值
        this.addForm.code = code;
      },
      submitAddForm(formName){
        let _this = this;
        var flag = _this.addForm.flag;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (flag == "add") {
              insertNode(this.addForm).then(res => {
                if (res.data.msg == "success") {
                  _this.$message({
                    message: '成功增加节点',
                    type: 'success'
                  });
                  // 关闭弹窗
                  _this.dialogAddForm = false;
                  // 重置form
                  _this.$refs[formName].resetFields();
                  // 刷新树
                  _this.getTreeData("3","1");
                } else if (res.data.msg == "is_exist") {
                  _this.$message({
                    showClose: true,
                    message: '流程岗位名称重复！',
                    type: 'warning'
                  });
                } else {
                  _this.$message.error('出现错误，请重新操作！');
                }
              })
            } else {
              var checkNode = _this.$refs.myTree.getCheckedNodes();
              if (checkNode[0].name == this.addForm.cname) {
                _this.$message({
                  message: '成功修改节点',
                  type: 'success'
                });
                // 关闭弹窗
                _this.dialogAddForm = false;
                // 重置form
                _this.$refs[formName].resetFields();
              } else {
                updateNode(this.addForm).then(res => {
                  if (res.data.msg == "success") {
                    _this.$message({
                      message: '成功修改节点',
                      type: 'success'
                    });
                    // 关闭弹窗
                    _this.dialogAddForm = false;
                    // 重置form
                    _this.$refs[formName].resetFields();
                    // 刷新树
                    _this.getTreeData("3","1");
                  } else if (res.data.msg == "is_exist") {
                    _this.$message({
                      showClose: true,
                      message: '流程岗位名称重复！',
                      type: 'warning'
                    });
                  } else {
                    _this.$message.error('出现错误，请重新操作！');
                  }
                })
              }
            }
          } else {
            return false;
          }
        });
      }, 
      resetAddForm(formName){
        // 重置form
        this.$refs[formName].resetFields();
        // 关闭弹窗
        this.dialogAddForm = false;
      },
      updateNode(){
        var checkNode = this.$refs.myTree.getCheckedNodes();
        if (checkNode.length === 1) {
          //显示弹窗
          this.dialogAddForm=true;
          this.userGroupTitle="编辑";
          //表单赋值
          this.$nextTick(() => {
            this.addForm.guid = checkNode[0].id;
            this.addForm.cname = checkNode[0].name;
            this.addForm.code = checkNode[0].code;
            this.addForm.flag = "update";
          });
        } else {
           this.$message('请选取一个节点进行操作！');
        }
      }, 
      deleteNode(){
        let _this = this;
        var checkNode = this.$refs.myTree.getCheckedNodes();
         if (checkNode.length === 1) {
          var nodeId = checkNode[0].id;
          if (checkNode[0].children == null) {
            this.$confirm('是否确定执行删除操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              deleteNode(nodeId).then(res => {
                if (res.data.msg == "success") {
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  // 刷新树
                  _this.getTreeData("3","1");
                } else {
                  _this.$message.error('出现错误，请重新操作！');
                }
              })
            }).catch(() => {
              _this.$message("已取消删除");
            });
          } else {
            this.$message({
              message: '该节点有子节点，不可删除！',
              type: 'warning'
            });
          }
        } else {
          this.$message('请选取一个节点进行操作！');
        }
      }, 
      crewManage(){
        let checkNode = this.$refs.myTree.getCheckedNodes();
        if (checkNode.length === 0) {
          this.$message('请选择一个节点进行操作！');
          return;
        }
        this.dialogCrewForm=true;
        //按钮变灰
        this.treeType="1";
        this.isStart1=true;
        this.isStart2=false;
        this.isStart3=false;
        this.isStart4=false;
        //调用方法给树赋值
        this.getTreeData("1","0");
        //给右侧表格赋值
        this.cacheTableData = [];
        this.cacheTableData = this.tableData;
        //左侧显示树
        this.showLeftTree = true;
        this.showLeftTable = false;
        this.showPrivateGroup = false;
        //清空查询框
        this.xmCondition=null;
      },
      getDataByType(type){
        if (type=='1') {
          //按钮变灰
          this.treeType="1";
          this.isStart1=true;
          this.isStart2=false;
          this.isStart3=false;
          this.isStart4=false;
          //调用方法给树赋值
          this.getTreeData(type,"0");
          //显示树
          this.showLeftTree=true;
          this.showLeftTable=false;
          this.showPrivateGroup=false;
        }
        if (type=='2') {
          this.treeType="2";
          this.isStart1=false;
          this.isStart2=true;
          this.isStart3=false;
          this.isStart4=false;
          //调用方法给树赋值
          this.getTreeData(type,"0");
          //显示树
          this.showLeftTree=true;
          this.showLeftTable=false;
          this.showPrivateGroup=false;
        }
        if (type=='3') {
          this.treeType="3";
          this.isStart1=false;
          this.isStart2=false;
          this.isStart3=true;
          this.isStart4=false;
          //调用方法给树赋值
          this.getTreeData(type,"0");
          //显示树
          this.showLeftTree=true;
          this.showLeftTable=false;
          this.showPrivateGroup=false;
        }
        if (type=='4') {
          this.treeType="4";
          this.isStart1=false;
          this.isStart2=false;
          this.isStart3=false;
          this.isStart4=true;
          //调用方法给树赋值
          this.getTreeData(type,"0");
          //显示树
          this.showPrivateGroup=true;
          this.showLeftTree=false;
          this.showLeftTable=false;
        }
      },
      handleNodeClickDialog(item, node) {
        this.$refs.dialogTree.setCheckedKeys([item.id]);
      },
      searchByXM(){
        let _this =this;
        if (this.xmCondition != '') {
          getUserByTypeXM(this.treeType, this.xmCondition).then(res => {
            if (res.data.msg == "success") {
              // 给左侧表格赋值
              _this.showLeftTree=false;
              _this.showLeftTable=true;
              _this.leftTableData=res.data.data;
            }
          }).catch(function(error){
            _this.$message.error('出现错误，请重新操作！');
          })
        }
      },
      addCrew(){
        let _this = this;
        let flag = false;
        let userId;
        let orgId;
        //判断是树还是表格
        if (!this.showLeftTable) {
          if (this.treeType != "4") {
            var checkNode = this.$refs.dialogTree.getCheckedNodes();
          } else {
            var checkNode = this.$refs.privateTree.getCheckedNodes();
          }
          if (checkNode.length != 1) {
            this.$message('请选取一个节点进行操作！');
            return;
          } else {
            if (checkNode[0].nodeType != "0") {
              this.$message({
                message:"请选择人员!",
                type:"warning"
              });
              return;
            } else {
              //赋值
              userId = checkNode[0].id;
              orgId = checkNode[0].pid;
            }
          }
        } else {
          if (this.currentLeftRow != null) {
            //赋值
            userId = this.currentLeftRow.guid;
            orgId = this.currentLeftRow.orgId;
          } else {
            this.$message('请在左侧表格中选取一条数据！');
            return;
          }
        }
       
        // 检查表格中是否已存在该人员，存在不允许再次加入
        for (let i = 0; i < this.cacheTableData.length; i++) {
          var element = this.cacheTableData[i];
          if (element.guid === userId) {
            this.$message({
              message:"已存在该人员，请选择其他人员!",
              type:"warning"
            });
            flag = true;
            break;
          }
        }
        //调用后台方法调整数据
        if (!flag) {
          adjustRelation("0", this.treeType, "3", this.oldOrgId, userId, orgId).then(res => {
            if (res.data.msg === "success") {
              _this.$message({
                message: '已新增该人员',
                type: 'success'
              });
              if (_this.showLeftTable) { 
                // 刷新左侧表格
                _this.searchByXM();
              } else {
                // 刷新树
                _this.getTreeData(_this.treeType,"0");
              }
              // 刷新右侧表格
              _this.cacheTableData = res.data.data;
              _this.tableData = res.data.data;
            } else {
              _this.$message.error('出现错误，请重新操作！');
            }
          }).catch(function(error){
            _this.$message.error('出现错误，请重新操作！');
          })
        }  
      },
      removeCrew(){
        let _this = this;
        let flag = false;
        let targetId;
        let userId;
        //判断是树还是表格
        if (!this.showLeftTable) {
          if (this.treeType != "4") {
            var checkNode = this.$refs.dialogTree.getCheckedNodes();
          } else {
            var checkNode = this.$refs.privateTree.getCheckedNodes();
          }
          if (this.currentCacheRow != null) {
            if (checkNode.length != 1) {
              this.$message('请选取一个树节点进行操作！');
              return;
            } else {
              if (checkNode[0].nodeType == "0") {
                this.$message({
                  message:"请选择非人员节点!",
                  type:"warning"
                });
                return;
              } else {
                var data = checkNode[0].children;
                if (data != null) {
                  // 检查子节点中是否已存在该人员，存在不允许再次加入
                  userId = this.currentCacheRow.guid;
                  for (let i = 0; i < data.length; i++) {
                    var element = data[i];
                    if (element.id === userId) {
                      this.$message({
                        message:"节点中已存在该人员，请选择其他人员!",
                        type:"warning"
                      });
                      flag = true;
                      break;
                    }
                  }  
                } 
                //赋值
                targetId = checkNode[0].id;
              }
            }
          } else {
            this.$message('请在表格中选取一条数据！');
            return;
          }
        } else {
          //判断是否选中数据
          if (this.currentCacheRow != null) {
            if (this.currentLeftRow != null) {
              //赋值
              targetId = this.currentLeftRow.orgId;
              userId = this.currentCacheRow.guid;
              // 检查子节点中是否已存在该人员，存在不允许再次加入
              for (let i = 0; i < this.leftTableData.length; i++) {
                var element = this.leftTableData[i];
                if (element.orgId == targetId && element.guid === userId) {
                  this.$message({
                    message:"节点中已存在该人员，请选择其他人员!",
                    type:"warning"
                  });
                  flag = true;
                  break;
                }
              } 
               
            } else {
              this.$message('请在左侧表格中选取一条数据！');
              return;
            }
          } else {
            this.$message('请在右侧表格中选取一条数据！');
            return;
          }
        }

        //调用后台调整数据
        if (!flag) {
          adjustRelation("1", "3", this.treeType, targetId, this.currentCacheRow.guid, this.oldOrgId).then(res => {
            if (res.data.msg === "success") {
              _this.$message({
                message: '已移除该人员',
                type: 'success'
              });
              
              if (_this.showLeftTable) { 
                // 刷新左侧表格
                _this.searchByXM();
              } else {
                // 刷新树
                _this.getTreeData(_this.treeType,"0");
              }
              // 刷新右侧表格
              _this.cacheTableData = res.data.data;
              _this.tableData = res.data.data;
            } else {
              _this.$message.error('出现错误，请重新操作！');
            }    
          }).catch(function(error){
            _this.$message.error('出现错误，请重新操作！');
          })
        }  
      },
      handleCurrentCacheRow(val) {
        this.currentCacheRow = val;
      },
      handleCurrentLeftRow(val) {
        this.currentLeftRow = val;
      },
      /*渲染函数*/
      renderContent(h, { node, data, store }) {
        let that = this;//指向vue
        return h(TreeRender,{
          props:{
            NODE: node,
            DATA: data,
            STORE: store,
          },
          on:{
            //新增
            Append: ((s,d,n) => that.appendPrivateNode(s,d,n)),
            //修改节点
            Update: ((s,d,n)=> that.updatePrivateNode(s,d,n)),
            //删除节点
            Delete: ((s,d,n) => that.removePrivateNode(s,d,n))
          }
        });
      },
      /*树形控件添加节点，添加弹窗出现*/
      appendPrivateNode(s,d,n) {
        if (d.nodeType != "0") {
          this.triggerCurrenNodeData = d;
          this.triggerCurrenNode = n;
          //动态获取code
          this.createPrivateDynamicCode(this.triggerCurrenNodeData);
          //显示弹窗
          this.addPrivatedialogVisible=true;
          //表单赋值
          this.$nextTick(() => {
            this.addPrivateForm.parentId = this.triggerCurrenNodeData.id;
            this.addPrivateForm.flag = "add";
          }); 
        } else {
          this.$message('请选取非人员节点进行操作！');
        }
      },
      createPrivateDynamicCode(node){
        var code;
        var childs = node.children;
        var max = 0;
        if (childs != null) {
          for (var i = 0; i < childs.length; i++) {
            var childNode = childs[i];
            if (childNode.nodeType != "0") {
              var lastValue = childNode.code.split('-')[childNode.code.split('-').length - 1];
              if (max <= parseInt(lastValue)) {
                  max = parseInt(lastValue);
              }
            }
          }
        }
        code = node.code + '-' + (max + 1);
        // 给code赋值
        this.addPrivateForm.code = code;
      },
      /*树形控件修改节点，添加弹窗出现*/
      updatePrivateNode(s,d,n) {
        if (d.nodeType != "0") {
          this.triggerCurrenNodeData = d;
          this.triggerCurrenNode = n;
          //显示弹窗
          this.addPrivatedialogVisible = true;
          //表单赋值
          this.$nextTick(() => {
            this.addPrivateForm.guid = this.triggerCurrenNodeData.id;
            this.addPrivateForm.cname = this.triggerCurrenNodeData.name;
            this.addPrivateForm.code = this.triggerCurrenNodeData.code;
            this.addPrivateForm.flag = "update";
          }); 
        } else {
          this.$message('请选取非人员节点进行操作！');
        }
      },
      /*树形控件删除节点*/
      removePrivateNode(s,d,n) {
        let _this = this;
        let isDelete = true;
        if (d.nodeType != "0") {
          var nodeId = d.id;
          if (d.children == null) {
            this.$confirm('是否确定执行删除操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              deletePrivateNode(nodeId).then(res => {
                if (res.data.msg == "success") {
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  // 刷新树
                  _this.getTreeData("4","0");
                }
              }).catch(function(error){
                _this.$message.error('出现错误，请重新操作！');
              })
            }).catch(() => {
              _this.$message("已取消删除");
            });
          } else {
            //遍历children是否含有人员
            for (let i = 0; i < d.children.length; i++) {
              const item = d.children[i];
              
              if (item.nodeType != "0") {
                isDelete = false;
                break;
              }
            };
            // 若满足条件删除操作
            if (isDelete) {
              this.$confirm('节点下有人员信息，是否确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                deletePrivateNode(nodeId).then(res => {
                  if (res.data.msg == "success") {
                    _this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    // 刷新树
                    _this.getTreeData("4","0");
                  }
                }).catch(function(error){
                  _this.$message.error('出现错误，请重新操作！');
                })
              }).catch(() => {
                _this.$message("已取消删除");
              });
            } else {
              this.$message({
                message: '该节点有子节点，不可删除！',
                type: 'warning'
              });
            }
          }
        } else {
          this.$message('请选取非人员节点进行操作！');
        }
      },
      //重置form
      resetPrivateAddForm(formName){
        // 重置form
        this.$refs[formName].resetFields();
        // 关闭弹窗
        this.addPrivatedialogVisible = false;
      },
      /*节点新增，新增树形菜单事件分类弹窗，提交按钮*/
      submitPrivateAddForm(formname){
        let _this = this;
        let flag = _this.addPrivateForm.flag;
        this.$refs[formname].validate((valid) => {
          if (valid) {
            if (flag == "add") {
              insertPrivateNode(this.addPrivateForm).then(res => {
                if (res.data.msg == "success") {
                  _this.$message({
                    message: '成功增加子节点',
                    type: 'success'
                  });
                  // 关闭弹窗
                  _this.addPrivatedialogVisible = false;
                  // 重置form
                  _this.$refs[formname].resetFields();
                  // 刷新树
                  _this.getTreeData("4","0");
                } else if (res.data.msg == "is_exist") {
                  _this.$message({
                    showClose: true,
                    message: '个人组名称重复！',
                    type: 'warning'
                  });
                } 
              }).catch(function(error){
                _this.$message.error('出现错误，请重新操作！');
              })
            } else {
              if (this.triggerCurrenNodeData.name == this.addPrivateForm.cname) {
                _this.$message({
                  message: '成功修改节点',
                  type: 'success'
                });
                // 关闭弹窗
                _this.addPrivatedialogVisible = false;
                // 重置form
                _this.$refs[formname].resetFields();
              } else {
                updatePrivateNode(this.addPrivateForm).then(res => {
                  if (res.data.msg == "success") {
                    _this.$message({
                      message: '成功修改节点',
                      type: 'success'
                    });
                    // 关闭弹窗
                    _this.addPrivatedialogVisible = false;
                    // 重置form
                    _this.$refs[formname].resetFields();
                    // 刷新树
                    _this.getTreeData("4","0");
                  } else if (res.data.msg == "is_exist") {
                    _this.$message({
                      showClose: true,
                      message: '个人组名称重复！',
                      type: 'warning'
                    });
                  }
                }).catch(function(error){
                  _this.$message.error('出现错误，请重新操作！');
                })
              }
            }
          } else {
            return false;
          }
        });
      },
      // 关闭dialog之前清空form表单
      closeDialog(done){
    　　this.$refs['addForm'].resetFields();
        done();
      },
      // 关闭dialog之前清空form表单
      closePirvateDialog(done){
    　　this.$refs['addPrivateForm'].resetFields();
        done();
      }
     
    }
  }
</script>

<style lang="scss" scoped>
  #flowPosition{
    height: 100%;
    // text-align: center;

    #buttonRow button{
      margin: 0;
      padding: 0;
    }



  }


////////////////分割线//////////////////
  #dialogMain {
    margin-top:10px;
    width:100%;
    height:450px;
    border: 1px lightgray solid;
    div{
      float:left;
      height:100%;
    }
  }
  #dialogCenter{
    border-left: 1px lightgray solid;
    border-right: 1px lightgray solid;
    button{
      margin: 0 auto;
      padding: 0;
      font-size:50px;
      color: black;
    }
  }
  #buttonRow button{
    margin: 0;
    padding: 0;
  }
  .activeClass{
    color:black;
  }
  #checkedUser{ 
    border-bottom:1px lightgray solid;
  }
  
</style>