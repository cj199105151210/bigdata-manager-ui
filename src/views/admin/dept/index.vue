<template>
  <div class="user">
    <basic-container>
      <el-row>
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <div class="main_left_content">
            <div class="filter-container">
              <el-button-group>
                <el-button
                  type="primary"
                  size="small"
                  v-if="deptManager_btn_add"
                  icon="plus"
                  @click="handlerAdd('form')"
                >添加</el-button>
                <el-button
                  type="warning"
                  size="small"
                  v-if="deptManager_btn_edit"
                  icon="edit"
                  @click="handlerEdit"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="small"
                  v-if="deptManager_btn_del"
                  icon="delete"
                  @click="handleDelete('form')"
                >删除</el-button>
              </el-button-group>
            </div>
            <el-tree
              class="filter-tree"
              :data="treeData"
              node-key="id"
              icon-class="el-icon-edit-outline"
              highlight-current
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="getNodeData"
              default-expand-all
            ></el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="19">
          <div class="main_right_content">
            <el-card class="box-card">
              <div slot="header" class="clearfix menu-card__header" v-if="formStatus === 'create'">
                <span>添加菜单项</span>
              </div>
              <div slot="header" class="clearfix menu-card__header" v-if="formStatus === 'update'">
                <span v-if="formStatus === 'update'">修改菜单项</span>
              </div>
              <el-form
                :label-position="labelPosition"
                label-width="110px"
                :rules="rules"
                :model="form"
                ref="form"
              >
                <el-form-item label="部门名称" prop="name" required>
                  <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" required>
                  <el-input
                    type="number"
                    v-model="form.sort"
                    :disabled="formEdit"
                    placeholder="请输入排序"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="formStatus == 'update'">
                  <el-button type="primary" @click="update">更新</el-button>
                  <el-button @click="onCancel('form')">取消</el-button>
                </el-form-item>
                <el-form-item v-if="formStatus == 'create'">
                  <el-button type="primary" @click="create">保存</el-button>
                  <el-button @click="onAddCancel('form')">取消</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchTree, getObj, putObj } from "@/api/admin/dept";
import { mapGetters } from "vuex";

export default {
  name: "dept",
  data() {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: ["0", "1"],
      methodOptions: ["GET", "POST", "PUT", "DELETE"],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      rules: {
        deptId: [{ required: true, message: "请输入节点编号" }],
        name: [{ required: true, message: "请输入部门名称" },{ min: 1, max: 24, message: '部门名称长度不能超出24个文字',trigger: 'blur' }],
        sort: [{ required: true, message: "请输入排序" }]
      },
      labelPosition: "right",
      form: {
        name: "",
        sort: "",
        parentId: "",
        deptId: ""
      },
      currentId: -1,
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
    };
  },
  created() {
    this.getList();
    this.deptManager_btn_add = this.permissions["sys_dept_add"];
    this.deptManager_btn_edit = this.permissions["sys_dept_edit"];
    this.deptManager_btn_del = this.permissions["sys_dept_del"];
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = "update";
      }
      getObj(data.id).then(response => {
        this.form = response.data.data;
      });
      this.currentId = data.id;
      this.showElement = true;
    },
    handlerEdit() {
      // 判断是否有选择树结构
      if (this.currentId) {
        this.formEdit = false;
        this.formStatus = "update";
      } else {
        this.$message("当前没有选中菜单项，请选中菜单后编辑!");
      }
      this.formStatus = "update";
    },
    handlerAdd(formName) {
      this.formEdit = false;
      this.formStatus = "create";
      if (this.currentId) {
        this.$refs[formName].resetFields();
        this.form = {
          parentId: this.currentId
        };
      } else {
      }
    },
    handleDelete(formName) {
      // 判断是否有选择树结构
      if (this.currentId) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList();
            this.$refs[formName].resetFields();
            this.onCancel();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          });
        });
      } else {
        this.$message("当前没有选中菜单项，请选中菜单后编辑!");
      }
    },
    update() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        putObj(this.form).then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
    create() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        addObj(this.form).then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
    onCancel(formName) {
      if (this.currentId) {
        getObj(this.currentId).then(response => {
          this.form = response.data.data;
        });
      } else {
        this.$refs[formName].resetFields();
      }
      this.formEdit = true;
      this.formStatus = "";
    },
    onAddCancel(formName) {
      this.$refs[formName].resetFields();
    },
    resetForm() {
      this.form = {
        parentId: this.currentId
      };
    }
  }
};
</script>

<style lang="scss">
</style>


