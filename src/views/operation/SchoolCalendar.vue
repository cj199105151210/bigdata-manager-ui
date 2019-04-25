<template>
  <div id="schoolCalendar">
    <basic-container>
      <div class="main_middle_content">
        <div v-show="showDiv" style="padding:1%">
          <el-button @click="handleAdd" style="margin-bottom:20px;" type="primary" icon="el-icon-edit" size="small" >添加</el-button>
          <el-table :data="tableData" style="font-size:14px;" height="420" :header-cell-style="{color:'rgba(0,0,0,.85)'}" border>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.$index, scope.row)"
                  size="small"
                  type="text"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  @click="handleRead(scope.$index, scope.row)"
                  size="small"
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
      
        <div v-show="!showDiv">
          <el-form :model="formData" ref="form" label-width="100px" :rules="rules">
            <el-form-item label="主键:" prop="guid" hidden>
              <el-input v-model="formData.guid"></el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="内容:" prop="content" style="height:200px;">
              <quill-editor style="height:200px;"
                class="quill_editor"
                ref="textEditor"
                v-model="formData.content"
                :options="editorOption"
              ></quill-editor>
            </el-form-item>
          </el-form>
          <div style="margin:6% 0 0 6%">
            <el-button type="primary" @click="submitForm('form')">保存</el-button>
            <el-button @click="back('form')">取消</el-button>
          </div>
        </div>
      </div>
    </basic-container>

    <!-- 详情展示 -->
    <el-dialog title="详情" :visible.sync="detailDialog" :close-on-click-modal="false">
      <el-form :model="detailData" ref="detailForm" label-width="100px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="detailData.name"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创建人:" prop="createUser">
          <el-input v-model="detailData.createUser"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
          <el-input v-model="detailData.createTime"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content" style="height:250px;">
          <quill-editor :disabled="true" style="height:220px;"
            class="quill_editor"
            ref="textEditor"
            v-model="detailData.content"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {selectAll,addRecord,updateRecord} from "@/api/operation/schoolCalendar";
export default {
  name: "middleLeave",
  data() {
    return {
      addTitle:"新增",
      detailDialog: false,
      showDiv:true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
      formData: {
        guid:"",
        content: "",
        name: "",
        createUser: "",
        createTime: ""
      },
      detailData: {
        guid:"",
        content: "",
        name: "",
        createUser: "",
        createTime: ""
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
      },
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
        placeholder: "请输入文本内容 ..."
      },
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
      selectAll(page, rows).then(result => {
          that.tableData = result.data.data.rows;
          that.total = result.data.data.total;
        })
        .catch(err => {
          this.$message("查询出错，请重新加载！");
        });
    },
    //增加
    handleAdd() {
      this.addTitle="新增";
      this.$refs['form'].resetFields();
      this.showDiv=!this.showDiv
    },
     //修改
    handleEdit(index, row) {
      this.addTitle="修改";
      this.formData = row;
      this.showDiv=!this.showDiv
    },
    //展示详情
    handleRead(index, row) {
      this.detailDialog = true;
      this.detailData = row;
    },
    //跳转
    handleCurrentChange(val) {
      this.currentPage = val;
      this.selectRecord();
    },
    //每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.selectRecord();
    },
    //保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.formData.guid) {
            addRecord(this.formData).then(result => {
              this.$message({ message: "保存成功！", type: "success" });
              this.back();
              this.selectRecord();
            }).catch(err => {
              this.$message("保存出错，请重试！");
            });
          } else {
            updateRecord(this.formData).then(result => {
              this.$message({ message: "保存成功！", type: "success" });
              this.back();
              this.selectRecord();
            }).catch(err => {
              this.$message("保存出错，请重试！");
            });
          }
        } else {
          return false;
        }
      });
    },
    //取消
    back(){
      // 重置form
      this.$refs['form'].resetFields();
      this.showDiv = !this.showDiv
      this.selectRecord()
    }
  }
};
</script>

<style lang="scss" scoped>
  #schoolCalendar{
    height: 100%;
    // text-align: center;
  }
</style>

