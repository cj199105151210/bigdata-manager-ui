<template>
  <div id="oauthClient">
    <basic-container>
    <div class="main_middle_content">
    <el-button type="primary" @click="addRecrod()" style="margin:1%" icon="el-icon-edit" size="small">新增</el-button>
    <el-table ref="multipleTable" :data="tableData" height="410" :header-cell-style="{color:'rgba(0,0,0,.85)'}" :stripe="true" border>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column prop="clientId" label="编号" align="center"></el-table-column>
      <el-table-column prop="clientSecret" label="钥匙" align="center"></el-table-column>
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" @click="handleDelete(scope.$index,scope.row)" type="text" icon="el-icon-delete">删除</el-button>
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
  </basic-container>
    <!-- 编辑按钮对话框 -->
    <el-dialog title="编辑" :visible.sync="dialogEdit" @close="handleClose('form2')" :close-on-click-modal="false">
      <el-form :model="formData" :rules="formRules" ref="form2">
        <el-form-item label="编号" label-width="200px" prop="clientId">
          <el-input v-model="formData.clientId" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="钥匙" label-width="200px" prop="clientSecret">
          <el-input v-model="formData.clientSecret" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <div id="footer" style="margin-left:70%">
        <el-button @click="submit('form2')" type="primary">确定</el-button>
        <el-button @click="handleClose('form2')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="dialogAdd" @close="handleClose('form2')" :close-on-click-modal="false">
      <el-form :model="formData" :rules="formRules" ref="form2">
        <el-form-item label="编号" label-width="200px" prop="clientId">
          <el-input v-model="formData.clientId" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="钥匙" label-width="200px" prop="clientSecret">
          <el-input v-model="formData.clientSecret" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <div id="footer" style="margin-left:70%">
        <el-button @click="addSubmit('form2')" type="primary">确定</el-button>
        <el-button @click="handleClose('form2')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  selectOauth,
  selectOauthMessage,
  deleteOauth,
  updateOauth,
  insertOauth
} from "@/api/userCenter/CasAndOauth";
export default {
  name: "OauthClient",
  data() {
    var hanzi = (rule, value, callback) => {
      if (value.match(/[\u4e00-\u9fa5]/)) {
        callback(new Error("不能输入中文"));
      } else if (value.match(/[^\x00-\xff]/)) {
        callback(new Error("不能输入双字节字符"));
      } else if (value.indexOf(" ") > 0) {
        callback(new Error("不能输入空格"));
      } else if (value.match(/\s/)) {
        callback(new Error("不能输入空白字符"));
      } else {
        callback();
      }
    };
    var onlyValid = (rule, value, callback) => {
      if (value === this.oldClientId) {
        callback();
      } else {
        selectOauthMessage(value)
          .then(result => {
            //console.log(result.data.data)
            if (result.data.data == null) {
              callback();
            } else {
              callback(new Error("编号重复，请重新输入"));
            }
          })
          .catch(err => {
            this.$message("验证出错");
          });
      }
    };
    return {
      total: 10,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      dialogEdit: false,
      dialogAdd: false,
      oldClientId: "",
      formData: {
        clientId: "",
        clientSecret: ""
      },
      formRules: {
        clientId: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { validator: onlyValid, trigger: "blur" },
          { validator: hanzi, trigger: "change" },
          {
            min: 1,
            max: 32,
            message: "长度在 1 到 32 个非中文字符或标点",
            trigger: "change"
          }
        ],
        clientSecret: [
          { required: true, message: "钥匙不能为空", trigger: "blur" },
          { validator: hanzi, trigger: "change" }
        ]
      }
    };
  },
  mounted: function() {
    this.selectAll();
  },
  methods: {
    //切换分页容量
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.selectAll();
      // console.log(`每页 ${val} 条`);
    },
    //切换分页页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.selectAll();
      // console.log(`当前页: ${val}`);
    },

    //查询所有
    selectAll() {
      let _this = this;
      let page = _this.currentPage;
      let rows = _this.pageSize;

      selectOauth(page, rows)
        .then(result => {
          // console.log(result)
          _this.total = result.data.data.total;
          _this.tableData = result.data.data.list;
        })
        .catch(err => {
          this.$message("加载出错，请重新加载");
        });
    },
    //新增按钮；打开对话框
    addRecrod() {
      this.formData.clientId = "";
      this.formData.clientSecret = "";
      this.dialogAdd = true;
    },

    //编辑按钮：回显信息
    handleEdit(index, row) {
      let _this = this;
      _this.dialogEdit = true;
      selectOauthMessage(row.clientId)
        .then(result => {
          //console.log(result)
          _this.formData = result.data.data;
          _this.oldClientId = result.data.data.clientId;
        })
        .catch(err => {
          _this.$message("信息回显出错");
        });
    },
    //编辑按钮：确定保存
    submit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          updateOauth(_this.formData.clientId, _this.formData.clientSecret, _this.oldClientId)
            .then(result => {
              _this.$message({ message: "保存成功！", type: "success" });
              _this.oldClientId = "";
              _this.dialogEdit = false;
              _this.selectAll();
            })
            .catch(err => {
              _this.$message("修改出错，请从新填写！");
              _this.$refs.form2.resetFields();
            });
        } else {
          return false;
        }
      });
    },

    //新增按钮：确定保存
    addSubmit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          insertOauth(this.formData)
            .then(result => {
              _this.$message({ message: result.data.data, type: "success" });
              _this.selectAll();
              _this.dialogAdd = false;
            })
            .catch(err => {
              _this.$message("新增出错，请重新填写");
              _this.$refs["form2"].resetFields();
            });
        } else {
          return false;
        }
      });
    },

    //删除按钮
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("确认删除？")
        .then(_ => {
          deleteOauth(row)
            .then(result => {
              //console.log(result.data)
              _this.$message({ message: result.data.data, type: "success" });
              this.selectAll();
            })
            .catch(err => {
              _this.$message('超时，请重试！')
            });
        })
        .catch(_ => {});
    },
    // 关闭按钮
    handleClose(formName) {
      this.oldClientId = "";
      this.dialogEdit = false;
      this.dialogAdd = false;
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style>
</style>

