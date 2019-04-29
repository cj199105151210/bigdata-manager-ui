<template>
  <div id="wrap">
    <basic-container>
      <div class="main_middle_content">
        <div v-show="isShow">
          <el-button
            @click="handleAdd"
            style="margin:1%"
            type="primary"
            icon="el-icon-edit"
            size="small"
          >添加</el-button>
          <el-table :data="tableData" height="400" :header-cell-style="{color:'rgba(0,0,0,.85)'}" :stripe="true" border>
            <el-table-column prop="name" label="问题名称" align="center"></el-table-column>
            <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="200"
              align="center"
              :formatter="formatRole"
            ></el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleDelete(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除</el-button>
                <el-button
                  @click="handleEdit(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  @click="handleRead(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:1%;text-align:right"
          ></el-pagination>
        </div>
        <div v-show="isShowSec" style="height:500px">
          <br>
          <el-form :model="formData" :rules="rules" ref="form">
            <el-form-item label="问题:" prop="name" label-width="100px">
              <el-input v-model="formData.name" placeholder="问题名称" style="width:50%"></el-input>
            </el-form-item>
            <el-form-item label="答案:" prop="content" label-width="100px">
              <el-input
                type="textarea"
                :rows="10"
                v-model="formData.content"
                placeholder="问题答案"
                style="width:50%"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="submit" style="margin-left:8%" type="success" size="small">发布</el-button>
          <el-button @click="save" type="primary" size="small">保存</el-button>
          <el-button @click="back" size="small">返回</el-button>
        </div>
      </div>
    </basic-container>
    <el-dialog :visible.sync="questionDialog" title="详细" @close="back">
      <p>
        <i>问题:</i>
        <span style="margin-left:2%">{{formData.name}}</span>
      </p>
      <p>
        <i>答案:</i>
        <span style="margin-left:2%">{{formData.content}}</span>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAll,
  addRecord,
  updateRecord
} from "@/api/operation/CommonProblem";
export default {
  name: "CommonProblem",
  data() {
    return {
      isShow: true,
      isShowSec: false,
      questionDialog: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
      formData: {
        guid: "",
        name: "",
        content: "",
        createUser: "",
        createTime: "",
        status: ""
      },
      rules: {
        name: [{ required: true, message: "请输入问题名", trigger: "blur" }]
      }
    };
  },
  mounted: function() {
    this.selectRecord();
  },
  methods: {
    //分页查询
    selectRecord() {
      let page = this.currentPage;
      let rows = this.pageSize;
      let that = this;
      selectAll(page, rows)
        .then(result => {
          //console.log(result.data)
          that.tableData = result.data.data.rows;
          that.total = result.data.data.total;
        })
        .catch(err => {
          this.$message("查询出错，请重新加载！");
        });
    },
    //状态展示
    formatRole(row, column) {
      if (row.status == 1) {
        return "未发布";
      } else if (row.status == 2) {
        return "发布中";
      } else {
        return "已删除";
      }
    },
    //增加
    handleAdd() {
      this.isShow = false;
      this.isShowSec = true;
    },
    //删除
    handleDelete(index, row) {
      //对应数据库中，1创建2发布3删除
      if (row.status == 3) {
        this.$message("问题已删除，请勿重复操作");
      } else {
        this.formData = row;
        this.formData.status = 3;
        updateRecord(this.formData)
          .then(result => {
            this.$message({ message: "删除成功！", type: "success" });
            this.selectRecord();
          })
          .catch(err => {
            this.$message("删除出错，请重试！");
          });
      }
    },
    //修改
    handleEdit(index, row) {
      this.formData = row;
      this.isShow = false;
      this.isShowSec = true;
    },
    //查询
    handleRead(index, row) {
      this.questionDialog = true;
      this.formData = row;
    },
    //保存按钮
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //对应数据库中，1创建2发布3删除
          this.formData.status = 1;
          if (!this.formData.guid) {
            addRecord(this.formData)
              .then(result => {
                this.$message({ message: "保存成功！", type: "success" });
                this.back();
                this.selectRecord();
              })
              .catch(err => {
                this.$message("保存出错，请重试！");
              });
          } else {
            updateRecord(this.formData)
              .then(result => {
                this.$message({ message: "保存成功！", type: "success" });
                this.back();
                this.selectRecord();
              })
              .catch(err => {
                this.$message("保存出错，请重试！");
              });
          }
        } else {
          return false;
        }
      });
    },
    //发布按钮
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //对应数据库中，1创建2发布3删除
          this.formData.status = 2;
          if (!this.formData.guid) {
            addRecord(this.formData)
              .then(result => {
                this.$message({ message: "发布成功！", type: "success" });
                this.back();
                this.selectRecord();
              })
              .catch(err => {
                this.$message("发布出错，请重试！");
              });
          } else {
            updateRecord(this.formData)
              .then(result => {
                this.$message({ message: "发布成功！", type: "success" });
                this.back();
                this.selectRecord();
              })
              .catch(err => {
                this.$message("发布出错，请重试！");
              });
          }
        } else {
          return false;
        }
      });
    },

    //返回按钮
    back() {
      this.$refs["form"].resetFields();
      this.$refs["form"].clearValidate();
      this.formData.guid = "";
      this.isShow = true;
      this.isShowSec = false;
      this.questionDialog = false;
      this.selectRecord();
    },
    //改变页数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //改变页面大小
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    }
  }
};
</script>

<style>
</style>

