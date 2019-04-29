<template>
  <div id="menu-page" class="app-container user">
    <basic-container>
      <el-row>
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <div class="main_left_content">
            <div class="filter-container">
              <el-button-group>
                <el-button
                  type="primary"
                  size="small"
                  v-if="menuManager_btn_add"
                  icon="plus"
                  @click="handlerAdd('form')"
                >添加</el-button>

                <el-button
                  type="warning"
                  size="small"
                  v-if="menuManager_btn_edit"
                  icon="edit"
                  @click="handlerEdit"
                >编辑</el-button>

                <el-button
                  type="danger"
                  size="small"
                  v-if="menuManager_btn_del"
                  icon="delete"
                  @click="handleDelete('form')"
                >删除</el-button>
              </el-button-group>
            </div>

            <el-tree
              class="filter-tree"
              node-key="id"
              ref="tree"
              highlight-current
              :data="treeData"
              :default-expanded-keys="aExpandedKeys"
              :filter-node-method="filterNode"
              :props="defaultProps"
              @node-click="getNodeData"
              @node-expand="nodeExpand"
              @node-collapse="nodeCollapse"
            ></el-tree>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="19" class="user__main">
          <div class="main_right_content">
            <el-card class="box-card">
              <div slot="header" class="clearfix menu-card__header" v-if="formStatus === 'create'">
                <span>添加菜单项</span>
              </div>

              <div slot="header" class="clearfix menu-card__header" v-if="formStatus === 'update'">
                <span v-if="formStatus === 'update'">修改菜单项</span>
              </div>

              <el-form
                :rules="rules"
                :label-position="labelPosition"
                label-width="110px"
                :model="form"
                ref="form"
              >
                <el-form-item label="标题" prop="name" required>
                  <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入标题"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type" required>
                  <el-select
                    class="filter-item"
                    v-model="form.type"
                    :disabled="formEdit"
                    placeholder="请选择资源请求类型"
                  >
                    <el-option
                      v-for="item in  typeOptions"
                      :key="item"
                      :label="item | typeFilter"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="按钮权限标识" prop="permission" v-show="form.type == 1" required>
                  <el-input v-model="form.permission" :disabled="formEdit" placeholder="请输入权限标识"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon" v-show="form.type == 0" required>
                  <avue-crud-icon-select
                    :disabled="formEdit"
                    :option="option"
                    v-model="form.icon"
                    :iconList="iconList"
                    placeholder="请输入图标"
                  ></avue-crud-icon-select>
                </el-form-item>

                <el-form-item label="排序" prop="sort" v-show="form.type == 0" required>
                  <el-input
                    type="number"
                    v-model="form.sort"
                    :disabled="formEdit"
                    placeholder="排序只能是数字"
                  ></el-input>
                </el-form-item>

                <el-form-item label="组件路径" prop="component" v-show="form.type == 0" required>
                  <el-input
                    v-model.trim="form.component"
                    :disabled="formEdit"
                    placeholder="格式只能是Layout或者views/admin/user/index"
                  ></el-input>
                </el-form-item>

                <el-form-item label="路径别名" prop="path" v-show="form.type == 0" required>
                  <el-input
                    v-model.trim="form.path"
                    :disabled="formEdit"
                    placeholder="格式只能是当前组件的简写路径类似于admin"
                  ></el-input>
                </el-form-item>

                <el-form-item v-if="formStatus === 'update'">
                  <el-button type="primary" size="small" @click="update('form')">更新</el-button>

                  <el-button @click="onCancel('form')" size="small">取消</el-button>
                </el-form-item>

                <el-form-item v-if="formStatus === 'create'">
                  <el-button type="primary" size="small" @click="create">保存</el-button>

                  <el-button @click="onAddCancel('form')" size="small">取消</el-button>
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
import {
  addObj,
  delObj,
  fetchMenuTree,
  getObj,
  putObj
} from "@/api/admin/menu";
import { mapGetters } from "vuex";
import iconList from "@/const/iconList";

export default {
  name: "menus",
  data() {
    return {
      iconList: iconList,
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: ["0", "1"],
      option: {},
      listQuery: {
        name: undefined
      },
      defaultCurrent: [], // 树结构默认选中
      treeData: [],
      oExpandedKey: {},
      oTreeNodeChildren: {},
      aExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "name",
        id: "id"
      },
      labelPosition: "right",
      form: {
        permission: "",
        name: "",
        parentId: "",
        icon: "",
        sort: "",
        component: "",
        type: "",
        path: ""
      },
      currentId: -1,
      menuManager_btn_add: false, // 左侧增加删除修改按钮
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      // 表单验证规则，可自定义
      rules: {
        name: [
          { required: true, message: "标题不能为空" },
          {
            min: 1,
            max: 24,
            message: "标题长度不能超出24个文字",
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "类型不能为空" }],
        permission: [{ required: true, message: "按钮权限标识不能为空" }],
        icon: [{ required: true, message: "图标不能为空" }],
        sort: [{ required: true, message: "排序不能为空" }],
        component: [{ required: true, message: "组件路径不能为空" }],
        path: [{ required: true, message: "路径别名不能为空" }]
      }
    };
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        0: "菜单",
        1: "按钮"
      };
      return typeMap[type];
    }
  },
  created() {
    this.form = {
      parentId: this.currentId
    };
    this.getList();
    this.menuManager_btn_add = this.permissions["sys_menu_add"];
    this.menuManager_btn_edit = this.permissions["sys_menu_edit"];
    this.menuManager_btn_del = this.permissions["sys_menu_del"];
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      let _this = this;
      fetchMenuTree(this.listQuery).then(response => {
        this.treeData = response.data.data;
        if (_this.currentId !== -1) {
          _this.$nextTick(function() {
            _this.$refs["tree"].setCurrentKey(_this.currentId);
          });
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    nodeExpand(data) {
      let aChildren = data.children;
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true;
        this.oTreeNodeChildren[data.id] = aChildren;
      }
      this.setExpandedKeys();
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false;
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], oNode => {
        this.oExpandedKey[oNode.id] = false;
      });
      this.setExpandedKeys();
    },
    setExpandedKeys() {
      let oTemp = this.oExpandedKey;
      this.aExpandedKeys = [];
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey));
        }
      }
    },
    treeRecursion(aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i];
          fnCallback && fnCallback(oNode);
          this.treeRecursion(oNode.children, fnCallback);
        }
      }
    },

    getNodeData(data) {
      this.formStatus = "";
      getObj(data.id).then(response => {
        this.form = response.data.data;
      });
      this.currentId = data.id;
      this.showElement = true;
      this.formEdit = true;
    },
    handlerEdit() {
      // 判断是否有选择树结构
      if (this.currentId !== -1) {
        this.formEdit = false;
        this.formStatus = "update";
      } else {
        // if (this.formEdit && (this.formStatus == "")) {
        this.$message("请选中菜单后编辑!");
        // }
      }
    },
    handlerAdd(formName) {
      this.formEdit = false;
      this.formStatus = "create";
      if (this.currentId !== -1) {
        this.$refs[formName].resetFields();
        this.form = {
          parentId: this.currentId
        };
      } else {
      }
    },
    handleDelete(formName) {
      // 判断是否有选择树结构
      let _this = this;
      if (this.currentId !== -1) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          delObj(this.currentId).then(res => {
            if (res != undefined && res.data.code == 1) {
              this.currentId = -1;
              this.form = {
                parentId: -1
              };
              this.getList();
              this.onCancel("form");

              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            }
          });
        });
      } else {
        this.$message("当前没有选中菜单项，请选中菜单后编辑!");
      }
    },
    update(formName) {
      // 选择图标
      if (this.form.type == 1) {
        let isUndefined =
          this.form.name !== undefined && this.form.permission !== undefined;
        let isTrue = this.form.name !== "" && this.form.permission !== "";
        if (isTrue && isUndefined) {
          putObj(this.form).then(() => {
            this.defaultCurrent.push(this.currentId);
            this.getList();
            this.cancel("form");
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
        // 选择菜单
      } else if (this.form.type == 0) {
        let isUndefined =
          this.form.name !== undefined &&
          this.form.icon !== undefined &&
          this.form.sort !== undefined &&
          this.form.component !== undefined &&
          this.form.path !== undefined;
        let isTrue =
          this.form.name !== "" &&
          this.form.icon !== "" &&
          this.form.sort !== "" &&
          this.form.component !== "" &&
          this.form.path !== "";
        if (isTrue && isUndefined) {
          putObj(this.form).then(() => {
            this.defaultCurrent.push(this.currentId);
            this.getList();
            this.cancel("form");
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      }
    },
    create() {
      // 选择图标
      if (this.form.type == 1) {
        let isUndefined =
          this.form.name !== undefined && this.form.permission !== undefined;
        let isTrue = this.form.name !== "" && this.form.permission !== "";
        if (isTrue && isUndefined) {
          addObj(this.form).then(() => {
            this.defaultCurrent.push(this.currentId);
            this.getList();
            this.cancel("form");
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
            //debugger;
          });
        }
        // 选择菜单
      } else if (this.form.type == 0) {
        let isUndefined =
          this.form.name !== undefined &&
          this.form.icon !== undefined &&
          this.form.sort !== undefined &&
          this.form.component !== undefined &&
          this.form.path !== undefined;
        let isTrue =
          this.form.name !== "" &&
          this.form.icon !== "" &&
          this.form.sort !== "" &&
          this.form.component !== "" &&
          this.form.path !== "";
        if (isTrue && isUndefined) {
          addObj(this.form).then(() => {
            this.defaultCurrent.push(this.currentId);
            this.getList();
            this.cancel("form");
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      }
    },
    onCancel(formName) {
      if (this.currentId !== -1) {
        getObj(this.form.menuId).then(response => {
          this.form = response.data.data;
        });
      } else {
        this.$refs[formName].resetFields();
      }
      this.formEdit = true;
      this.formStatus = "";
    },
    cancel(formName) {
      this.formEdit = true;
      this.formStatus = "";
    },
    onAddCancel(formName) {
      this.$refs[formName].resetFields();
    },
    resetForm() {
      this.form = {
        permission: "",
        name: "",
        parentId: this.currentId,
        icon: "",
        sort: "",
        component: "",
        type: "",
        path: ""
      };
    }
  }
};
</script>
<style lang="scss">
#menu-page {
  .el-dialog__wrapper .el-dialog {
    padding-bottom: 30px;
    .el-dialog__body {
      max-height: 400px;
      overflow: auto;
    }
    .avue-crud-icon-select__list {
      min-height: 350px;
    }
  }
  .style-tips {
    font-size: 12px;
    color: #999;
  }
  .el-form-item__content {
    line-height: 36px;
  }
}
</style>


