<template>
  <div class="main_middle_content">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="handleAdd"
            size="small"
            v-if="permissions.admin_parameter_add"
          >新 增</el-button>
          <br>
          <br>
        </template>
        <template slot="status" slot-scope="scope">
          <span>{{scope.label}}</span>
        </template>
        <template slot="publicType" slot-scope="scope">
          <span>{{scope.label}}</span>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            v-if="permissions.admin_parameter_edit"
            icon="el-icon-edit"
            size="small"
            plain
            @click="handleEdit(scope.row,scope.index)"
          >编辑</el-button>
          <el-button
            type="text"
            v-if="permissions.admin_parameter_del"
            icon="el-icon-delete"
            size="small"
            plain
            @click="handleDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj
} from "@/api/admin/sys-common-parameter";
import { tableOption } from "@/const/crud/admin/sys-common-parameter";
import { mapGetters } from "vuex";
export default {
  name: "parameter",
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    };
  },
  created() {},
  mounted: function() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      )
        .then(response => {
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(err => {
        });
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function() {
      this.$refs.crud.rowAdd();
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index);
    },
    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除ID为" + row.publicId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(function() {
          return delObj(row.publicId);
        })
        .then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList(this.page);
        })
        .catch(function(err) {});
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
        this.tableData.splice(index, 1, Object.assign({}, row));
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        done();
        this.getList(this.page);
      });
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function(row, done, loading) {
      addObj(row)
        .then(data => {
          this.tableData.push(Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    },
    /**
     * 搜索功能
     */
    searchChange(param) {
      this.page.page = 1;
      this.getList(this.page, param);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
