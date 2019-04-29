<template>
  <div id="casClinet" >
     <basic-container>
    <div class="main_middle_content">
    <el-button type="primary" @click="addRecrod()" style="margin:1%" icon="el-icon-edit" size="small">新增</el-button>
    <el-table ref="multipleTable" :data="tableData" height="410" :header-cell-style="{color:'rgba(0,0,0,.85)'}" :stripe="true" border>
      <el-table-column type="index"  align="center" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="名称"  align="center"></el-table-column>
      <el-table-column prop="serviceid" label="接入客户端正则地址"  align="center"></el-table-column>
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
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="dialogEdit" @close="handleClose('form1')" :close-on-click-modal="false">
      <el-form :model="formData" :rules="formRules" ref="form1">
        <el-form-item label="名称" label-width="200px" prop="name">
          <el-input v-model="formData.name" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="接入客户端正则地址" label-width="200px" prop="serviceid">
          <el-input v-model="formData.serviceid" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <div id="footer" style="margin-left:70%">
        <el-button @click="submit('form1')" type="primary" size="small">确定</el-button>
        <el-button @click="handleClose('form1')" size="small">取消</el-button>
      </div>
    </el-dialog>

    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="dialogAdd" @close="handleClose('form1')" :close-on-click-modal="false">
      <el-form :model="formData" :rules="formRules" ref="form1">
        <el-form-item label="名称" label-width="200px" prop="name">
          <el-input v-model="formData.name" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="接入客户端正则地址" label-width="200px" prop="serviceid">
          <el-input v-model="formData.serviceid" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <div id="footer" style="margin-left:70%">
        <el-button @click="addSubmit('form1')" type="primary" size="small">确定</el-button>
        <el-button @click="handleClose('form1')" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { selectCas, selectCasMessage, deleteCas, updateCas, insertCas } from '@/api/userCenter/CasAndOauth'
export default {
  name: "CasClient",
  data() {
     var hanzi = (rule , value ,callback) => {
      if(value.match(/[\u4e00-\u9fa5]/)){
        callback(new Error("不能输入中文"));
      }else
      if(value.match(/[^\x00-\xff]/)){
        callback(new Error("不能输入双字节字符"));
      }else
      if(value.indexOf(" ") > 0){
        callback(new Error('不能输入空格'));
      }else
      if(value.match(/\s/)){
        callback(new Error('不能输入空白字符'));
      }else{
        callback();
      }
    };
    return {
      total: 10,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      dialogEdit: false,
      dialogAdd:false,
      formData: {
        id: "",
        name: "",
        serviceid: ""
      },
      formRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" },{ validator: hanzi ,trigger:'change' }],
        serviceid: [
          { required: true, message: "正则地址不能为空", trigger: "blur" },{ validator: hanzi ,trigger:'change' }
        ]
      }
    };
  },
  mounted: function() {
    this.selectAll();
  },
  methods: {
    //切换每页显示数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.selectAll();

      // console.log(`每页 ${val} 条`);
    },
    //切换页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.selectAll();

      // console.log(`当前页: ${val}`);
    },
    //查询所有条目
    selectAll() {
      let _this = this;
      let page = _this.currentPage
      let rows = _this.pageSize

        selectCas(page,rows).then(result => {
          //console.log(result);
          _this.total = result.data.data.total;
          _this.tableData = result.data.data.list;
        })
        .catch(err => {
          this.$message("加载出错，请重新加载");
        });
    },
    //新增按钮；打开对话框
    addRecrod(){
      this.formData.id = ''
      this.formData.serviceid = ''
      this.dialogAdd = true
    },
     //新增按钮：确定保存
    addSubmit(formName){
       let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          insertCas(this.formData).then((result) => {
            //console.log(result)
            _this.$message({message: result.data.data, type: "success"})
            _this.selectAll()
            _this.dialogAdd = false
          }).catch((err) => {
            _this.$message("新增出错，请重新填写")
            _this.$refs[formName].resetFields()
          });

        }else{
          return false;
        }
      });
    },

    //修改按钮：回显数据
    handleEdit(index, row) {
      let _this = this;
      _this.dialogEdit = true;
        selectCasMessage(row).then(result => {
          //console.log(result)
          _this.formData = result.data.data;
        })
        .catch(err => {
          _this.$message("信息回显出错");
        });
    },
    //删除按钮
    handleDelete(index, row) {
      let _this = this
      _this.$confirm("确认删除？")
        .then(_ => {
           deleteCas(row).then((result) => {
             _this.$message({message:result.data.data,type:'success'})
             _this.selectAll()
              }).catch((err) => {
                _this.$message('超时，请重试！')
              });
        })
        .catch(_ => {});
    },
    //关闭按钮：清空数据
    handleClose(formName) {
      this.dialogEdit = false;
      this.dialogAdd = false;
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields();
    },
    //修改按钮：确定提交
    submit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
            updateCas(_this.formData.id, _this.formData.name, _this.formData.serviceid).then(result => {
              _this.$message({ message: "保存成功！", type: "success" });
              _this.dialogEdit = false;
              _this.selectAll();
            })
            .catch(err => {
              _this.$message("修改出错，请从新填写！");
              _this.$refs.form1.resetFields();
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
</style>


