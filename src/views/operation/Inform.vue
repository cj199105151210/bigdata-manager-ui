<template>
  <!-- 主页面 -->
  <div>
    <basic-container>
      <div class="main_middle_content">
        <div id="mainPage" v-show="mainPage">
          <div style="margin-bottom:1%;border-bottom:1px dashed rgb(186, 181, 181)">
            <el-form :model="lineForm" :rules="formRules" ref="line1">
              <el-row :span="24">
                <el-col :xs="24" :sm="24" :md="5">
                  <el-form-item label="标题：" prop="title" label-width="60px">
                    <el-input v-model="lineForm.title" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="6" style="padding-left:5%">
                  <el-form-item label="阅读率:" prop="startRate" label-width="60px">
                    <el-input v-model="lineForm.startRate" placeholder="起始范围" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="5">
                  <el-form-item prop="endRate" label="—" label-width="40px">
                    <el-input v-model="lineForm.endRate" placeholder="结束范围" size="small"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :xs="24" :sm="24" :md="6">
                  <el-form-item label="发布时间：" prop="startDate" label-width="100px">
                    <el-date-picker
                      v-model="lineForm.startDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择开始日期"
                      size="small"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="5">
                  <el-form-item label="—" prop="endDate" label-width="40px">
                    <el-date-picker
                      v-model="lineForm.endDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择结束日期"
                      size="small"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="6" style="text-align:right;margin-top:0.6%">
                  <el-button
                    type="primary"
                    @click="onSearch"
                    style="margin-left:25%"
                    icon="el-icon-search"
                    size="small"
                  >查询</el-button>
                  <el-button type="success" @click="reset" icon="el-icon-refresh" size="small">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-button
            @click="handleAdd"
            style="margin-left:2%;margin-bottom:1%"
            type="primary"
            icon="el-icon-edit"
            size="small"
          >添加</el-button>
          <el-table :data="tableData" height="312" :header-cell-style="{color:'rgba(0,0,0,.85)'}" :stripe="true" border>
            <el-table-column prop="title" label="标题" width="160" align="center"></el-table-column>
            <el-table-column prop="createrName" label="创建人" width="160" align="center"></el-table-column>
            <el-table-column prop="createrOrgCname" label="创建部门" width="160" align="center"></el-table-column>
            <el-table-column prop="total" label="总人数" width="80" align="center"></el-table-column>
            <el-table-column prop="hasRead" label="已阅数" width="80" align="center"></el-table-column>
            <el-table-column prop="readRate" label="阅读率" width="80" align="center"></el-table-column>
            <el-table-column prop="createTime" label="发布时间" width="200" align="center"></el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="80"
              align="center"
              :formatter="format1"
            ></el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleDelete(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删</el-button>
                <el-button
                  @click="handleEdit(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >改</el-button>
                <el-button
                  @click="handleRead(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                >查</el-button>
                <el-button
                  @click="readerList(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                >阅</el-button>
                <el-button
                  @click="handleStick(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  icon="el-icon-upload2"
                >顶</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:1%;text-align:right"
          ></el-pagination>
        </div>
        <!-- 查询阅读人列表页面 -->
        <div id="readerPage" v-show="readerPage" style="margin-left:2%">
          <br>
          <label>姓名：</label>
          <el-input style="width:20%" v-model="inputXm" placeholder="根据姓名搜索"></el-input>
          <el-button
            type="primary"
            style="margin-left:20px"
            icon="el-icon-search"
            @click="readerSearch"
          >搜索</el-button>
          <el-button type="success" @click="backMainPage">返回</el-button>
          <el-table
            :data="readerTable"
            height="410"
            style="margin-top:2%"
            :header-cell-style="{color:'rgba(0,0,0,.85)'}"
            :stripe="true"
          >
            <el-table-column prop="xm" label="姓名" align="center"></el-table-column>
            <el-table-column prop="loginName" label="账号" align="center"></el-table-column>
            <el-table-column prop="readTime" label="阅读时间" align="center"></el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="readerSizeChange"
            @current-change="readerCurrentChange"
            :current-page="readerCurrentPage"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="readerPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="readerTotal"
            style="margin-top:1%;text-align:right"
          ></el-pagination>
        </div>
        <!-- 增加或修改页面 -->
        <div id="secondaryPage" v-show="secondaryPage">
          <el-form :model="addForm" ref="addform">
            <el-row :span="24">
              <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="标题:" prop="title" label-width="100px">
              <el-input v-model="addForm.title" style="width:80%" placeholder="通知标题"></el-input>
            </el-form-item>
            <el-form-item label="附件:" label-width="100px">
            <el-upload
              class="upload-demo"
              ref="upload"
              action
              :http-request="uploadFile"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload"
              >一键上传</el-button>
              <div slot="tip" class="el-upload__tip">单个文件选取，批量上传</div>
            </el-upload>
            </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="3">
              </el-col>
              <el-col :xs="24" :sm="24" :md="10">
                <el-form-item label="通知人员:" prop="reader" label-width="100px">
                  <el-button size="mini"  type="warning" @click="selectReader">选择</el-button>
                  <el-input
                    type="textarea"
                    :rows="6"
                    :disabled="true"
                    v-model="addForm.reader">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="通知内容:" prop="content" label-width="100px">
            <quill-editor
              class="quill_editor"
              ref="textEditor"
              v-model="addForm.content"
              :options="editorOption"
            ></quill-editor>
            </el-form-item>
            <el-row :span="24"  class="subbtns">
             <el-col :xs="24" :sm="24" :md="5">
                  <el-form-item label="发布时间：" prop="effectiveTime" label-width="100px">
                    <el-date-picker
                      v-model="addForm.effectiveTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择开始发布日期"
                      size="small"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="4">
                  <el-form-item label="—" prop="failureTime" label-width="40px">
                    <el-date-picker
                      v-model="addForm.failureTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择结束发布日期"
                      size="small"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-form>
          <div style="padding-left: 8%;">
            <el-button @click="publish" type="primary" size="small">发布</el-button>
            <el-button @click="Forever" type="success" size="small">永久发布</el-button>
            <el-button @click="back" type="warning" size="small">保存</el-button>
            <el-button @click="back" size="small">返回</el-button>
          </div>
        </div>
      </div>
    </basic-container>

    <!-- ===========阅读详情对话框=========== -->
    <el-dialog :visible.sync="readDialog" title="通知简介" :close-on-click-modal="false">
      <el-form :model="addForm">
        <el-form-item label="标题:" label-width="100px"> {{addForm.title}} </el-form-item>
        <el-form-item label="通知内容:" style="margin-bottom:100px" label-width="100px">
          <quill-editor class="quill_editor" ref="textEditor" v-model="addForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- ===========人员选择器========== -->
    <el-dialog :visible.sync="readerChoose" title="人员选择器" :close-on-click-modal="false">
      <div style="height:320px;overflow:auto" >
      <el-tree
        :data="readerTree"
        show-checkbox
        node-key="id"
        ref="userChooseTree"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :props="defaultProps">
      
      </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
        <el-button @click="readerChoose = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- =============置顶时间段选择对话框=============== -->
    <el-dialog :visible.sync="sortDateChoose" title="请设置置顶时间段" :close-on-click-modal="false">
      <el-form :inline="true"  style="margin-left:8%">
        <el-form-item label="开始时间：" :model="addForm" label-width="120">
          <el-date-picker
            v-model="addForm.sortEffectiveTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" label-width="120">
          <el-date-picker
            v-model="addForm.sortFailureTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSort">确 定</el-button>
        <el-button @click="sortDateChoose = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectUsergroup,
  selectRecord,
  insertRecord,
  updateRecord,
  selectReader,
  stick,
  traverse,
  nameSplice,
  userIdSplice,
  uploadFile,
  removeFile
} from "@/api/operation/Inform";
import { getTreeList } from '@/api/userCenter/organizationManage'
export default {
  name: "inform",

  data() {
    var Integer = (rule, value, callback) => {
      value = Number(value);
      if (typeof value === "number" && !isNaN(value)) {
        if (value < 0 || value > 100) {
          callback(new Error("阅读率在 0 至 100 之间"));
        } else {
          callback();
        }
      } else {
        callback(new Error("阅读率必须为数字"));
      }
    };
   
    return {
      filterText:'',
      mainPage: true,
      //读取通知弹出框
      readDialog: false,
      //阅读人页面
      readerPage: false,
      //新增编辑页面
      secondaryPage: false,
      //人员选择器弹出框
      readerChoose:false,
      readerTable: [],
      //人员选择器数据源
      readerTree:[],
      sortDateChoose:false,
      inputXm: "",
      rowId: "",
      lineForm: {
        title: "",
        startRate: "",
        endRate: "",
        startDate: "",
        endDate: ""
      },
      addForm: {
        guid: "",
        title: "",//标题
        reader:"",//发布对象姓名串
        readerId:"",//发布对象id串
        affixName:[],//附件名
        failureTime:'',//生效时间
        effectiveTime:'',//过期时间
        sortFailureTime:'',//排序过期时间
        sortEffectiveTime:'',//排序生效时间
        content: "",//富文本内容
        status: "",//状态码：0保存 1未发布 2发布中 3下架
        permanent:false //是否永久发布标记
      },
      currentPage: 1,
      readerCurrentPage: 1,
      total: 0,
      readerTotal: 0,
      pageSize: 5,
      readerPageSize: 10,
      tableData: [],
      fileData:'',
      //文件上传list
      fileList: [],
      //人员选择树格式
      defaultProps:{
        children: "children",
        label: "name",
        value:'id'
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
      formRules: {
        startRate: [{ validator: Integer, trigger: "change" }],
        endRate: [{ validator: Integer, trigger: "change" }]
      }
    };
  },

  mounted: function() {
    this.onSearch();
  },
  methods: {
    //条件查询
    onSearch() {
      selectRecord(this.currentPage, this.pageSize, this.lineForm)
        .then(result => {
          //console.log(result);
          this.tableData = result.data.data.rows;
          this.total = result.data.data.total;
        })
        .catch(err => {});
    },

    //文件上传
    submitUpload() {
     // console.log(this.fileList)

      this.fileData = new FormData();
      this.$refs.upload.submit();
      var that = this
      uploadFile(that.fileData).then((result) => {
        this.$message({type:'success',message:'上传成功！'})
        let arr = result.data.data
        for(var j = 0, len = arr.length; j < len; j++){
          that.fileList.push(arr[j])
        }
        that.addForm.affixName = that.fileList
      }).catch((err) => {
        
      });
      
    },
    //文件拼接
    uploadFile(file){
      this.fileData.append('file',file.file);
    },
    //文件删除
    handleRemove(file, fileList) {
      removeFile(file).then((result) => {  
        this.$message({type:'success',message:result.data.data})
        let arr = this.addForm.affixName 
        let i 
        for(var j = 0, len = arr.length; j < len; j++) {
          if(arr[j].name === file.name){
             i = j
          }
        }
        this.addForm.affixName.splice(i,1)
        // console.log(this.addForm.affixName)
        // debugger
      }).catch((err) => {
        this.$message('网络异常，请重试')
      });
    },
   
    //重置查询
    reset() {
      this.$refs["line1"].resetFields();
      this.$refs["line1"].clearValidate();
      selectRecord(this.currentPage, this.pageSize, this.lineForm)
        .then(result => {
          this.tableData = result.data.data.rows;
          this.total = result.data.data.total;
        })
        .catch(err => {});
    },
    //改变页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.onSearch();
    },
    //改变页面大小
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.onSearch();
    },
    //状态格式化
    format1(row, column) {
      switch (row.status) {
        case 0:
          return '保存中'
          break;
        case 1:
          return '未发布'
          break;
        case 2:
          return '发布中'
          break;
        case 3:
          return '下架'
          break;
      }
    },

    //改变阅读人页面表页数
    readerCurrentChange(val) {
      this.readerCurrentPage = val;
    },
    //改变阅读人页面表页面大小
    readerSizeChange(val) {
      this.readerPageSize = val;
      this.readerCurrentPage = 1;
    },
    //添加站内通知
    handleAdd() {
      this.$refs["addform"].resetFields();
      this.$refs["addform"].clearValidate();
      this.mainPage = false;
      this.secondaryPage = true;
      this.addForm.guid == "";
    },
    //获取人员选择器
    selectReader(){
      let that = this
      getTreeList(1,0).then((result) => {
        that.readerChoose = true
        that.readerTree = result.data.data
      }).catch((err) => {
        this.$message("加载人员选择器失败！")
      });
    },
    //获取选中的人员
    getCheckedNodes(){
      // console.log(this.$refs.userChooseTree.getCheckedNodes()) 
      let list = this.$refs.userChooseTree.getCheckedNodes()
      let arr = traverse(list)
     // console.log(arr)
     //拼接姓名字符串
     this.addForm.reader = nameSplice(arr)
     //拼接人员id串
     this.addForm.readerId = userIdSplice(arr)
     this.readerChoose = false
    
    },
    //删除通知
    handleDelete(index, row) {
      //status：0保存1未发布2发布中3下架
      if(row.status == 3){
        this.$message({ message: "下架状态，请勿重复操作！重新发布请编辑此行！"});
      }else{
      row.status = 3;
      updateRecord(row)
        .then(result => {
          this.$message({ message: "已下架！", type: "success" });
          this.onSearch();
        })
        .catch(err => {
          that.$message("删除出错，请重试");
        });
      }
    },
    // 修改通知
    handleEdit(index, row) {
      this.mainPage = false;
      this.secondaryPage = true;
      this.addForm = row;
    },
    //查询通知信息
    handleRead(index, row) {
      this.readDialog = true;
      this.addForm = row;
    },

    // 查询阅读人
    readerList(index, row) {
      this.mainPage = false;
      this.readerPage = true;
      this.rowId = row.guid;
      selectReader(
        this.currentPage,
        this.readerPageSize,
        this.rowId,
        this.inputXm
      )
        .then(result => {
          this.readerTable = result.data.data.rows;
          this.readerTotal = result.data.data.total;
        })
        .catch(err => {
          this.$message("加载出错，请刷新重试！");
        });
    },
    //带条件查询
    readerSearch() {
      selectReader(
        this.currentPage,
        this.readerPageSize,
        this.rowId,
        this.inputXm
      )
        .then(result => {
          this.readerTable = result.data.data.rows;
          this.readerTotal = result.data.data.total;
        })
        .catch(err => {
          this.$message("加载出错，请刷新重试！");
        });
    },
    //打开置顶时间对话框
    handleStick(index, row) {
      this.addForm = row
      this.sortDateChoose = true
    },

    // 置顶该通知
    setSort(){
      stick(this.addForm)
        .then(result => {
          //console.log(result.data)
          if (result.data.msg === "success") {
            this.$message({ message: "已置顶！", type: "success" });
          } else {
            this.$message({ message: "置顶失败！", type: "success" });
          }
        })
        .catch(err => {
          this.$message({ message: "制定失败，请重试！", type: "success" });
        });
    },
    //阅读人页面返回主页
    backMainPage() {
      this.mainPage = true;
      this.readerPage = false;
      this.rowId = "";
    },
    //增加删除页面返回主页
    back() {
      this.$refs["addform"].resetFields();
      this.$refs["addform"].clearValidate();
      this.addForm.guid = "";
      this.mainPage = true;
      this.secondaryPage = false;
      this.onSearch();
    },

    //永久发布
    Forever(){
     let that = this;
      //permanent字段 ture 永久 false 非永久
      that.addForm.permanent = true;
      if (that.addForm.guid == "") {
        insertRecord(that.addForm)
          .then(result => {
            that.$message({ message: "发布成功！", type: "success" });
            that.back();
          })
          .catch(err => {
            that.$message("发布出错，请重试");
          });
      } else {
        updateRecord(that.addForm)
          .then(result => {
            that.$message({ message: "发布成功！", type: "success" });
            that.back();
          })
          .catch(err => {
            that.$message("发布出错，请重试");
          });
      }
    },
    //发布
    publish() {
      if (that.addForm.guid == "") {
        insertRecord(that.addForm)
          .then(result => {
            that.$message({ message: "发布成功！", type: "success" });
            that.back();
          })
          .catch(err => {
            that.$message("发布出错，请重试");
          });
      } else {
        updateRecord(that.addForm)
          .then(result => {
            that.$message({ message: "发布成功！", type: "success" });
            that.back();
          })
          .catch(err => {
            that.$message("发布出错，请重试");
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.quill_editor {
  width: 90%;
  height: 200px;
}
.subbtns {
  margin-top: 70px;
}
</style>

