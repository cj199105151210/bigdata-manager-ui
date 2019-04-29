<template>
  <div>
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="24" class="user__main">
          <div class="main_right_content">
            <el-table :data="tableData" style="font-size:14px;" height="500" :header-cell-style="{color:'rgba(0,0,0,.85)'}" border>
              <el-table-column prop="leaveName" label="请假类型" align="center" width="120"></el-table-column>
              <el-table-column prop="startTime" label="开始时间" align="center" width="160"></el-table-column>
              <el-table-column prop="endTime" label="结束时间" align="center" width="160"></el-table-column>
              <el-table-column prop="cause" label="请假理由" align="center" width="180"></el-table-column>
              <el-table-column prop="userName" label="申请人姓名" align="center" width="120"></el-table-column>
              <el-table-column prop="deptName" label="部门" align="center" width="160"></el-table-column>
              <el-table-column prop="dutyName" label="职务" align="center" width="120"></el-table-column>
              <el-table-column prop="phone" label="手机号" align="center" width="120"></el-table-column>
              <el-table-column prop="address" label="地址" align="center" width="160"></el-table-column>
              <el-table-column label="操作" fixed="right" align="center" width="100px">
                <template slot-scope="scope">
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
        </el-col>
      </el-row>
    </basic-container>

    <!-- 请假记录详情 -->
    <el-dialog title="详情" :visible.sync="detailDialog" :close-on-click-modal="false">
      <el-form :model="formData" ref="form" label-width="150px">
        <el-form-item label="请假类型:" prop="leaveName">
          <el-input v-model="formData.leaveName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="开始时间:" prop="startTime">
          <el-input v-model="formData.startTime"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-input v-model="formData.endTime"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="请假理由:" prop="cause">
          <el-input v-model="formData.cause"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人姓名:" prop="userName">
          <el-input v-model="formData.userName"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="部门:" prop="deptName">
          <el-input v-model="formData.deptName"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职务:" prop="dutyName">
          <el-input v-model="formData.dutyName"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="formData.phone"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-input v-model="formData.address"  :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAll
} from "@/api/operation/middleLeave";
export default {
  name: "middleLeave",
  data() {
    return {
      detailDialog: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
      formData: {
        leaveName: "",
        startTime: "",
        endTime: "",
        cause: "",
        userName: "",
        deptName: "",
        dutyName: "",
        phone: "",
        address: ""
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
      selectAll(page, rows).then(result => {
        that.tableData = result.data.data.rows;
        that.total = result.data.data.total;
      })
      .catch(err => {
        this.$message("查询出错，请重新加载！");
      });
    },
    //展示详情
    handleRead(index, row) {
      this.detailDialog = true;
      this.formData = row;
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

