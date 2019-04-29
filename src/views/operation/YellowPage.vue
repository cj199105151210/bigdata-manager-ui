<!-- 菜单树 -->
<template>
  <div id="yellowPage">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <div class="main_left_content">
            <el-button-group style="margin:0 0 4% 10%">
              <el-button type="primary" size="mini" @click="insertNode">新增</el-button>
              <el-button type="success" size="mini" @click="updateNode">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteNode">删除</el-button>
            </el-button-group>
            <el-tree
              :data="treeData"
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="true"
              @node-click="selectMessage"
              :check-on-click-node="true"
              :props="defaultProps"
            ></el-tree>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="19" class="user__main">
          <div class="main_right_content" style="height:520px">
            <div v-show="!editDiv"  style="margin-left:20%;padding-top:12%">
              <el-form :model="formdata">
                <el-form-item label="机构名:" label-width="160px">
                  <el-input v-model="formData.name" style="width:40%" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" label-width="160px">
                  <el-input v-model="formData.phone" style="width:40%" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="创建时间:" label-width="160px">
                  <el-input v-model="formData.createTime" style="width:40%" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="最后一次修改时间:" label-width="160px">
                  <el-input v-model="formData.updateTime" style="width:40%" :disabled="true"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div v-show="editDiv" style="margin-left:25%;padding-top:8%">
              <div v-if="addOrEdit">
              <div v-if="flagNode" style="margin:0 0 3% 13%">提醒：增加机构为顶层机构</div>
              <div v-if="!flagNode" style="margin:0 0 3% 13%">提醒：增加机构为<span>{{oldNode}}</span>下机构</div>
              </div>
              <el-form :model="formData2" ref="formData2">
                <el-form-item label="机构名：" label-width="100px" prop="name">
                  <el-input v-model="formData2.name" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" label-width="100px" prop="phone">
                  <el-input v-model="formData2.phone" style="width:40%"></el-input>
                </el-form-item>
              </el-form>
              <el-row style="margin: 5% 0 0 12%">
                <el-button @click="save" type="primary" size="small">保存</el-button>
                <el-button @click="close" size="small">取消</el-button>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import {
  selectOrgTree,
  insertRecord,
  updateRecord,
  deleteRecord
} from "@/api/operation/YellowPage";
export default {
  name: "YellowPage",
  data() {
    return {
      treeData: [],
      editDiv: false,
      flagNode:true,
      addOrEdit:true,
      oldNode:'',
      formData: {
        guid: "",
        name: "",
        phone: "",
        parentId: "",
        createTime:'',
        updateTime:'',
        isDelete: "",
        flag:''
      },
      formData2:{
        guid:'',
        name:"",
        phone:"",
        parentId:""
      },
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted: function() {
    this.selectYellowPage();
  },
  methods: {
    //加载树
    selectYellowPage() {
      selectOrgTree()
        .then(result => {
          console.log(result.data.data)
          this.treeData = result.data.data;
        })
        .catch(err => {});
    },
    //单击树节点加载信息
    selectMessage(data){
      this.formData = data
    },
    //编辑黄页信息
    updateNode() {
      if(this.formData.guid){
        this.formData2 = this.formData
        this.editDiv = true
        this.addOrEdit = false
      }else{
        this.$message('请选中修改项！')
      }
    
    },
    //插入
    insertNode() {
     // debugger
      if(this.formData.guid){
        this.oldNode = this.formData.name
        this.editDiv = true;
        this.flagNode = false;
      }else{
        this.editDiv = true;
      }
     
    },
    resetFormData(){
        this.formData.guid=""
        this.formData.name=""
        this.formData.phone=""
        this.formData.parentId=""
        this.formData.createTime=""
        this.formData.updateTime=""
        this.formData.isDelete=""
        this.formData.flag=""
        this.oldNode = ''
        this.flagNode = true
    },

    //关闭
    close() {
      this.$refs.formData2.resetFields();
      this.$refs.formData2.clearValidate();
      this.editDiv = false;
      this.addOrEdit = true;
      this.resetFormData()
      this.selectYellowPage();
    },
    //保存
    save() {
      let that = this;
      if (that.formData2.guid == "") {
        that.formData2.parentId = that.formData.guid
        insertRecord(that.formData2)
          .then(result => {
            that.$message({ message: "保存成功！", type: "success" });
            that.close();
          })
          .catch(err => {
            that.$message("保存出错，请重试");
          });
      } else {
        updateRecord(that.formData2)
          .then(result => {
            that.$message({ message: "保存成功！", type: "success" });
            that.close();
          })
          .catch(err => { 
            that.$message("保存出错，请重试");
          });
      }
    },
   // 删除
    deleteNode() {
    if(this.formData.guid) {
      if(this.formData.flag){
        //是否删除 1删除
        this.formData.isDelete = 1;
        updateRecord(this.formData)
          .then(result => {
            this.$message({ message: "删除成功！", type: "success" });
          })
          .catch(err => {
            this.$message("保存出错，请重试");
          });
      }else{
        this.$message('该节点下有子节点不可删除！')
      }
    }else{
      this.$message('未选中可删除节点！')
    }
      this.treeData = []
      this.selectYellowPage();

      
    }
  }
};
</script>

<style >
</style>