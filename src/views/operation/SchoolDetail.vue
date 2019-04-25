<template>
  <div>
    <basic-container>
      <div class="main_middle_content">
        <div v-show="showDiv" style="padding:1%">
          <el-button @click="insertRecord" size="small" type="primary" icon="el-icon-edit" style="margin:1%">新增</el-button>
          <el-table :data="tabledata" :header-cell-style="{color:'rgba(0,0,0,.85)'}" :stripe="true" border height="440">
            <el-table-column label="序号" type="index" align="center" width="60" ></el-table-column>
            <el-table-column label="学校名" prop="name" align="center"></el-table-column>
            <el-table-column label="创建人" prop="createUser" align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="editHandle(scope.$index,scope.row)" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteHandle(scope.$index,scope.row)" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
           <el-pagination
            background
            @size-change="currentSizeChange"
            @current-change="currentPageChange"
            :current-page="pageNum"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:1%;text-align:right"
          ></el-pagination>
        </div>
        <div v-show="!showDiv">
            <el-form :model="formData">
                <el-form-item label="简介id" v-if="formData.guid!=''" label-width="100px">{{ formData.guid }} </el-form-item>
                <el-form-item label="学校名" label-width="100px" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入学校名" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="学校简介" label-width="100px" prop="content">
                     <quill-editor
                        class="quill_editor"
                        ref="textEditor"
                        v-model="formData.content"
                        :options="editorOption"
                        ></quill-editor>
                </el-form-item>
            </el-form>
            <div style="margin:6% 0 0 6%">
           <el-button size="small" type="primary" @click="save">保存</el-button>
           <el-button size="small" @click="back">取消</el-button>
           </div>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {selectAll, insertDetail, updateDetail, deleteDetail} from '@/api/operation/SchoolDetail'
export default {
  name: "SchoolDetail",
  data() {
    return {
      tabledata: [1],
      showDiv:true,
      pageNum:1,
      pageSize:10,
      total:0,
      formData:{
          guid:'',
          name:'',
          content:'',   
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
        placeholder: "请输入文章内容 ..."
      },
    };
  },
  mounted: function() {
    this.selectRecord()
  },
  methods: {
    selectRecord(){
      selectAll(this.pageNum,this.pageSize).then((result) => {
        this.tabledata = result.data.data.rows
        this.total = result.data.data.total
      }).catch((err) => {
        this.$message("网络异常，请刷新重试!")
      });
    },
    //新增按钮
    insertRecord() {
      this.resetForm()
      this.showDiv=!this.showDiv
    },
    //清空字段
    resetForm(){
        this.formData.guid='',
        this.formData.content = '',
        this.formData.name = ''
    },
    //删除按钮
    deleteHandle(index, row) {
      let that = this
      that.$confirm("此操作将永久删除该条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDetail(row.guid).then((result) => {
            that.$message({type: "success", message: "删除成功!"});
            that.selectRecord()
          }).catch((err) => {
            that.$message( "网络错误，请重试！");
          });
        
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑按钮
    editHandle(index, row) {
        this.showDiv = !this.showDiv
        this.formData = row
    },
    //返回按钮
    back(){
      this.showDiv = !this.showDiv
      this.selectRecord()
    },
    //保存按钮
    save(){
      if(this.formData.guid == '') {
        insertDetail(this.formData).then((result) => {
        this.$message({type:'success',message:'新建成功！'})
        this.back()
      }).catch((err) => {
        this.$message("网络错误，请重试！")
      });
      }else {
        updateDetail(this.formData).then((result) => {
          this.$message({type:'success',message:'修改成功！'})
          this.back()
        }).catch((err) => {
          this.$message("网络错误，请重试！")
        });
      }
     
    }
  }
};
</script>

<style lang="scss" scoped>
.quill_editor {
  width: 90%;
  height: 260px;
}
</style>


