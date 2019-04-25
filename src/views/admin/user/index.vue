<template>
  <div class="app-container calendar-list-container user">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <div class="main_left_content">
            <el-tree
              class="filter-tree"
              :data="treeData"
              node-key="id"
              highlight-current
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              default-expand-all
            ></el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="19" class="user__main">
          <div class="main_right_content">
            <avue-crud
              :option="option"
              ref="crud"
              v-model="form"
              :page="page"
              :table-loading="listLoading"
              :before-open="handleOpenBefore"
              @on-load="getList"
              @search-change="handleFilter"
              @refresh-change="handleRefreshChange"
              @row-update="update"
              @row-save="create"
              @selection-change="selectionChange"
              :data="list"
            >
              <!-- 自定义按钮 slot卡槽-->
              <template slot="menuLeft">
                <el-button
                  v-if="sys_user_add"
                  class="filter-item"
                  @click="handleCreate"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >添加</el-button>
                <el-button
                  v-if="sys_user_add"
                  class="filter-item"
                  @click="handleDelAll(delAllList)"
                  size="mini"
                  type="danger"
                  icon="el-icon-edit"
                >删除</el-button>
              </template>
              <template slot="role" slot-scope="scope">
                <span v-for="(role,index) in scope.row.roleList" :key="index">
                  <span>{{role.roleName}}</span>
                </span>
              </template>
              <template slot="lockFlag" slot-scope="scope">
                <span>{{scope.label}}</span>
              </template>
              <template slot="menu" slot-scope="scope">
                <el-button
                  v-if="sys_user_edit"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row,scope.index)"
                >编辑</el-button>
                <el-button
                  v-if="sys_user_del"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="resetStartPassword(scope.row,scope.index)"
                >重置密码</el-button>
                <el-button
                  v-if="sys_user_del"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deletes(scope.row,scope.index)"
                >删除</el-button>
              </template>
              <template slot="deptIdForm" slot-scope="scope">
                <treeselect
                  v-model="form.deptId"
                  :normalizer="normalizer"
                  :options="treeDeptData"
                  placeholder="请选择所属部门"
                />
              </template>
              <template slot="roleForm" slot-scope="scope">
                <avue-crud-select
                  v-model="role"
                  multiple
                  placeholder="请选择角色"
                  :dic="rolesOptions"
                  :props="roleProps"
                ></avue-crud-select>
              </template>
            </avue-crud>
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
  delAllObj,
  fetchList,
  getObj,
  putObj,
  resetPassword
} from "@/api/admin/user";
import { deptRoleList } from "@/api/admin/role";
import { fetchDeptTree, fetchTree } from "@/api/admin/dept";
import { tableOption } from "@/const/crud/admin/user";
import { mapGetters } from "vuex";
import { constants } from "fs";
import { connect } from "tls";
import { treeSelect } from "@/utils/util";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "table_user",
  components: { Treeselect },
  data() {
    return {
      treeOption: {
        nodeKey: "id",
        addBtn: false,
        menu: false,

        props: {
          label: "name",
          value: "id"
        }
      },
      treeData: [],
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: "roleName",
        value: "roleId"
      },
      defaultProps: {
        label: "name",
        value: "id"
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false //是否倒序
      },
      list: [],
      listLoading: true,
      role: [],
      form: {},
      rolesOptions: [],
      delAllList: [],
      dialogPassword: false
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    role() {
      this.form.role = this.role;
    }
  },
  created() {
    this.sys_user_add = this.permissions["sys_user_add"];
    this.sys_user_edit = this.permissions["sys_user_edit"];
    this.sys_user_del = this.permissions["sys_user_del"];
    this.init();
  },
  methods: {
    init() {
      fetchDeptTree().then(response => {
        this.treeData = response.data.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClick(data) {
      this.page.page = 1;
      this.getList(this.page, { deptId: data.id });
    },
    // 刷新时获取数据
    getList(page, params) {
      this.page.currentPage = page.currentPage
      this.listLoading = true;
      // 调用数据列表方法
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then(response => {
        this.list = response.data.data.records;
        this.page.total = response.data.data.total;
        if (this.list.length > 0) {
          this.form.roleList = this.list[0].roleList;
        }
        this.listLoading = false;
      });
    },
    handleDept() {
      fetchTree().then(response => {
        let item = response.data.data;
        this.treeDeptData = treeSelect(item);
      });
    },
    // 点击搜索按钮时执行
    handleFilter(param) {
      this.page.page = 1;
      this.getList(this.page, param);
    },
    handleRefreshChange() {
      this.getList(this.page);
    },
    handleCreate() {
      this.$refs.crud.rowAdd();
    },
    // 表格选择回调
    selectionChange(list) {
      this.delAllList = list;
    },
    // 批量删除
    handleDelAll(list) {
      let delArray = [];
      for (let i = 0; i < list.length; i++) {
        delArray.push(list[i].userId);
      }
      if (delArray.length == 0) {
        this.$message("请先选择删除对象!");
      } else {
        delAllObj(delArray).then(() => {
          this.getList(this.page);
          this.$notify({
            title: "成功",
            message: "批量删除成功",
            type: "success",
            duration: 2000
          });
        });
      }
    },
    handleOpenBefore(show, type) {
      window.boxType = type;
      this.handleDept();
      // add edit views 四种状态进行判断
      if (["edit"].includes(type)) {
        this.role = [];
        for (var i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId;
        }
      } else if (type === "add") {
        this.form.deptId = null;
        this.form.password = "123456";
        this.role = [];
        deptRoleList().then(response => {
          this.rolesOptions = response.data.data;
        });
      }
      show();
    },

    // 编辑表格
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index);
      this.form.password = undefined;
    },
    //  创建用户
    create(row, done, loading) {
      addObj(this.form)
        .then(() => {
          this.getList(this.page);
          done();
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(() => {
          loading();
        });
    },
    update(row, index, done, loading) {
      putObj(this.form)
        .then(() => {
          this.getList(this.page);
          done();
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(() => {
          loading();
        });
    },
    // 重置为最初密码
    resetStartPassword(row, index) {
      this.$confirm("将用户的密码设置为123456, 是否继续?", "提示", {
        title: "重置密码",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      }).then(() => {
        resetPassword(row.userId)
          .then(() => {
            this.getList(this.page);
            this.$notify({
              title: "成功",
              message: "重置密码成功",
              type: "success",
              duration: 2000
            });
          })
          .cache(() => {
            this.$notify({
              title: "失败",
              message: "重置密码失败",
              type: "error",
              duration: 2000
            });
          });
      });
    },
    // 删除用户
    deletes(row, index) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示",
        {
          title: "删除用户",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }
      ).then(() => {
        delObj(row.userId)
          .then(() => {
            this.getList(this.page);
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          })
          .cache(() => {
            this.$notify({
              title: "失败",
              message: "删除失败",
              type: "error",
              duration: 2000
            });
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-checkbox-group {
  .el-col {
    margin-bottom: 40px;
  }
}
</style>
<style lang="scss">
.avue-crud__tip {
  display: none !important;
}
</style>




