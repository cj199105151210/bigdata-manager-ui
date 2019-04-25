<template>
  <div id="user-control" class="app-container calendar-list-container user">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <div class="main_left_content">
            <el-tree
              :data="data1"
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="true"
              @node-click="selectUser"
              :check-on-click-node="true"
              @check-change="handleClick"
              :props="defaultProps"
            ></el-tree>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="19" class="user__main">
          <div class="main_right_content">
            <!-- <div> -->
              <div style="text-align:left;margin-bottom:1%;border-bottom:1px dashed rgb(186, 181, 181)">
                <el-form :model="searchForm" :inline="true" size="small">
                  <el-form-item label="姓名：">
                    <el-input v-model="searchForm.xm" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-button
                    @click="searchByXm"
                    size="small"
                    icon="el-icon-search"
                    type="primary"
                  >查询</el-button>
                </el-form>
              </div>
              <el-row style="text-align:left;margin-bottom:1%">
                <el-button size="mini" type="primary" @click="orgAddUser" icon="el-icon-edit">添加</el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="updatePass"
                  icon="el-icon-edit-outline"
                >修改密码</el-button>
              </el-row>

              <!--========用户展示列表==========-->
              <el-table
                :data="tableData"
                tooltip-effect="dark"
                border
                height="368"
                ref="userTable"
                highlight-current-row
                @current-change="currentChange"
                :header-cell-style="{color:'rgba(0,0,0,.85)'}"
                :stripe="true"
                v-loading="loading"
              >
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
                <el-table-column prop="loginName" label="账号" align="center"></el-table-column>
                <el-table-column prop="xm" label="姓名" align="center"></el-table-column>
                <el-table-column prop="xb" label="性别" :formatter="formatRole1" align="center"></el-table-column>
                <el-table-column prop="isDelete" label="状态" :formatter="formatRole2" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机" align="center"></el-table-column>
                <el-table-column label="所在机构" prop="orgName" align="center">
                  <!-- <template slot-scope="scope">{{currentOrgName}}</template> -->
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)"
                      type="text"
                      icon="el-icon-edit"
                    >编辑</el-button>
                    <el-button
                      v-if="scope.row.isDelete !=1"
                      size="mini"
                      type="text"
                      @click="handleDelete(scope.$index, scope.row)"
                      icon="el-icon-delete"
                    >删除</el-button>
                    <el-button
                      v-if="scope.row.isDelete == 1"
                      size="mini"
                      type="text"
                      icon="el-icon-refresh"
                      @click="handleAdd(scope.$index, scope.row)"
                    >启用</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="text-align:left;margin-top:2%">
                <el-button
                  size="small"
                  type="primary"
                  @click="updateUserOrg"
                  icon="el-icon-setting"
                >设置所在机构</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="updateUserGroup"
                  icon="el-icon-setting"
                >设置用户组</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="updateUserFlow"
                  icon="el-icon-setting"
                >设置流程岗位</el-button>
              </el-row>
            <!-- </div> -->
          </div>
        </el-col>
      </el-row>
    </basic-container>

    <!--========设置所在机构弹窗===========-->
    <el-dialog
      title="设置人员所在机构"
      :visible.sync="dialogUserOrg"
      width="50%"
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <div class="dialog-main-tree">
        <el-row :span="24">
          <el-col :xs="24" :sm="24" :md="8">
            <div class="dialog-left">
              <el-scrollbar style="height:310px;width:100%;">
                <el-tree
                  :data="data2"
                  show-checkbox
                  node-key="id"
                  ref="orgTree"
                  :default-expand-all="true"
                  :check-strictly="true"
                  :expand-on-click-node="false"
                  :props="defaultProps"
                  :check-on-click-node="true"
                  @check-change="orgHandleClick"
                ></el-tree>
              </el-scrollbar>
              <el-button type="text" style="margin-left: 100px;" @click="editUserOrg">
                加入
                <i class="el-icon-d-arrow-right"></i>
              </el-button>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16">
            <div class="dialog-right">
              <span>{{userName}} 所在机构</span>
              <span>
                关键字：
                <input
                  type="text"
                  v-model="searchIuput"
                  auto-complete="off"
                  placeholder="请输入关键字"
                  style="width:30%"
                >
                <el-button type="primary" icon="el-icon-search" size="mini" @click="searchOrg">搜索</el-button>
              </span>
              <el-table
                ref="singleTable"
                :data="orgTableData"
                tooltip-effect="dark"
                height="280"
                highlight-current-row
                @current-change="handleCurrentChange"
              >
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column property="cname" label="机构名称" align="center"></el-table-column>
                <el-table-column
                  property="isDirectly"
                  label="是否直属"
                  width="80"
                  align="center"
                  :formatter="formatRole3"
                ></el-table-column>
                <el-table-column label="修改直属" align="center">
                  <!-- <el-checkbox v-model="checked"></el-checkbox> -->
                  <template slot-scope="scope">
                    <el-radio
                      v-model="radio"
                      :label="scope.$index"
                      @change.native="getCurrentRow(scope.$index,scope.row)"
                    >&nbsp;</el-radio>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="text" style="margin-right: 360px;" @click="removeOrgRelation">
                <i class="el-icon-d-arrow-left"></i>移出
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!--========设置所在流程岗位===========-->
    <el-dialog
      title="设置人员所在流程岗位"
      :visible.sync="dialogUserFlow"
      width="50%"
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <div class="dialog-main-tree">
        <el-row :span="24">
          <el-col :xs="24" :sm="24" :md="8">
            <div class="dialog-left">
              <el-scrollbar style="height:310px;width:100%;">
                <el-tree
                  :data="data4"
                  show-checkbox
                  node-key="id"
                  ref="flowTree"
                  :default-expand-all="true"
                  :check-strictly="true"
                  :expand-on-click-node="false"
                  :props="defaultProps"
                  :check-on-click-node="true"
                  @check-change="flowHandleClick"
                ></el-tree>
              </el-scrollbar>
              <el-button type="text" style="margin-left: 100px;" @click="editUserFlow">
                加入
                <i class="el-icon-d-arrow-right"></i>
              </el-button>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16">
            <div class="dialog-right">
              <span>{{userName}} 所在岗位流程</span>
              <span>
                关键字：
                <input
                  type="text"
                  auto-complete="off"
                  v-model="searchIuput"
                  placeholder="请输入关键字"
                  style="width:30%"
                >
                <el-button type="primary" icon="el-icon-search" size="mini" @click="searchFlow">搜索</el-button>
              </span>
              <el-table
                ref="singleTable"
                :data="flowTableData"
                tooltip-effect="dark"
                height="280"
                highlight-current-row
                @current-change="handleCurrentChange"
              >
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column property="cname" label="岗位流程" align="center"></el-table-column>
              </el-table>
              <el-button type="text" style="margin-right: 360px;" @click="removeFlowRelation">
                <i class="el-icon-d-arrow-left"></i>移出
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!--========设置所在用户组===========-->
    <el-dialog
      title="设置人员所在用户组"
      :visible.sync="dialogUserGroup"
      width="50%"
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <div class="dialog-main-tree">
        <el-row :span="24">
          <el-col :xs="24" :sm="24" :md="8">
            <div class="dialog-left">
              <el-scrollbar style="height:310px;width:100%;">
                <el-tree
                  :data="data3"
                  show-checkbox
                  node-key="id"
                  ref="groupTree"
                  :default-expand-all="true"
                  :check-strictly="true"
                  :expand-on-click-node="false"
                  :props="defaultProps"
                  :check-on-click-node="true"
                  @check-change="groupHandleClick"
                ></el-tree>
              </el-scrollbar>
              <el-button type="text" style="margin-left: 100px;" @click="editUserGroup">
                加入
                <i class="el-icon-d-arrow-right"></i>
              </el-button>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16">
            <div class="dialog-right">
              <span>{{userName}} 所在用户组</span>
              <span>
                关键字：
                <input
                  type="text"
                  v-model="searchIuput"
                  auto-complete="off"
                  placeholder="请输入关键字"
                  style="width:25%"
                >
                <el-button type="primary" icon="el-icon-search" size="mini" @click="searchGroup">搜索</el-button>
              </span>
              <el-table
                ref="singleTable"
                :data="groupTableData"
                tooltip-effect="dark"
                height="280"
                highlight-current-row
                @current-change="handleCurrentChange"
              >
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column property="cname" label="用户组" align="center"></el-table-column>
              </el-table>
              <el-button type="text" style="margin-right: 360px;" @click="removeGroupRelation">
                <i class="el-icon-d-arrow-left"></i>移出
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!--========添加按钮弹出框==========-->
    <el-dialog
      title="用户信息"
      :visible.sync="dialogFormVisible"
      style="margin-top:-10vh"
      @close="handleClose('formData')"
      :close-on-click-modal="false"
    >
      <!-- <div class="dialog3"> -->
      <el-form :model="formData" :rules="formRules" ref="formData">
        <el-row :span="24">
          <el-col :xs="24" :sm="24" :md="12" style="padding:2%">
            <el-form-item label="账号:" prop="loginName" label-width="100px">
              <el-input v-model="formData.loginName" auto-complete="off" placeholder="请输入登录名"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="xm" label-width="100px">
              <el-input v-model="formData.xm" auto-complete="off" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="年龄:" prop="age" label-width="100px">
              <el-input v-model.number="formData.age" auto-complete="off" placeholder="请输入年龄"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password" label-width="100px" style="margin-top:50px">
              <el-input
                type="password"
                v-model="formData.password"
                auto-complete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="xb" label-width="100px">
              <el-radio v-model="formData.xb" label="1">男</el-radio>
              <el-radio v-model="formData.xb" label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="证件类型:" prop="cardType" label-width="100px">
              <el-select v-model="formData.cardType" placeholder="请选择">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="港澳台证件" value="2"></el-option>
                <el-option label="国外证件" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机:" prop="phone" label-width="100px">
              <el-input v-model="formData.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="职务:" prop="duty" label-width="100px">
              <el-select v-model="formData.duty" placeholder="请选择">
                <el-option label="厅局级正职" value="1"></el-option>
                <el-option label="县处级正职" value="2"></el-option>
                <el-option label="乡科级正职" value="3"></el-option>
                <el-option label="主任科员" value="4"></el-option>
                <el-option label="科员" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" style="padding:2%">
            <!-- <label class="el-form-item__label" label-width="100px" >头像:</label> -->
            <el-form-item class="pic-img" label="头像:" label-width="100px">
              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                :http-request="uploadFile"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass" label-width="100px">
              <el-input
                type="password"
                v-model="formData.checkPass"
                auto-complete="off"
                placeholder="请再次输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份:" prop="type" label-width="100px">
              <el-select v-model="formData.type" placeholder="请选择">
                <el-option label="学生" value="1"></el-option>
                <el-option label="教职工" value="2"></el-option>
                <el-option label="家长" value="3"></el-option>
                <el-option label="企业" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号:" prop="idCard" label-width="100px">
              <el-input v-model="formData.idCard" auto-complete="off" placeholder="请输入身份证"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sortNo" label-width="100px">
              <el-input v-model="formData.sortNo" auto-complete="off" placeholder="请输入排序号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="mail" label-width="100px">
              <el-input v-model="formData.mail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submit('formData')">确 定</el-button>
        <el-button @click="handleClose('formData')">取 消</el-button>
      </div>
      <!-- </div> -->
    </el-dialog>
    <!-- 修改密码弹出框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogUpdataPass"
      width="40%"
      @close="handleClose('form1')"
      :close-on-click-modal="false"
    >
      <span class="digFont">姓名： {{userName}}</span>
      <apan class="digFont">登录账号： {{loginName}}</apan>
      <el-form :model="form1" :rules="formRules1" ref="form1">
        <el-row :span="24" style="margin-top:1%">
          <el-col :xs="24" :sm="24" :md="4"></el-col>
          <el-col :xs="24" :sm="24" :md="16">
            <el-form-item label="新密码:" prop="password" label-width="120px">
              <el-input
                type="password"
                v-model="form1.password"
                auto-complete="off"
                placeholder="请输入新密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认新密码:" prop="checkPass" label-width="120px">
              <el-input
                type="password"
                v-model="form1.checkPass"
                auto-complete="off"
                placeholder="请再次输入新密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="updatePassword('form1')">确 定</el-button>
        <el-button @click="handleClose('form1')">取 消</el-button>
      </div>
    </el-dialog>

    <!--=======编辑用户信息弹出对话框==========-->
    <el-dialog
      title="用户信息"
      :visible.sync="dialogEdit"
      style="margin-top:-10vh"
      @close="handleClose('formData1')"
      :close-on-click-modal="false"
    >
      <!-- <div class="dialog1"> -->
      <el-form :model="formData" :rules="formRules" ref="formData1">
        <el-row :span="24">
          <el-col :xs="24" :sm="24" :md="12" style="padding:2%">
            <el-form-item label="账号:" label-width="100px">
              <span>{{ formData.loginName }}</span>
            </el-form-item>
            <el-form-item label="姓名:" prop="xm" label-width="100px">
              <el-input v-model="formData.xm" auto-complete="off" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="年龄:" prop="age" label-width="100px">
              <el-input v-model.number="formData.age" auto-complete="off" placeholder="请输入年龄"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="xb" label-width="100px" style="margin-top:50px">
              <el-radio v-model="formData.xb" label="1">男</el-radio>
              <el-radio v-model="formData.xb" label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="证件类型:" prop="cardType" label-width="100px">
              <el-select v-model="formData.cardType" placeholder="请选择">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="港澳台证件" value="2"></el-option>
                <el-option label="国外证件" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机:" prop="phone" label-width="100px">
              <el-input v-model="formData.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="职务:" prop="duty" label-width="100px">
              <el-select v-model="formData.duty" placeholder="请选择">
                <el-option label="厅局级正职" value="1"></el-option>
                <el-option label="县处级正职" value="2"></el-option>
                <el-option label="乡科级正职" value="3"></el-option>
                <el-option label="主任科员" value="4"></el-option>
                <el-option label="科员" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" style="padding:2%">
            <el-form-item class="pic-img" label="头像:" label-width="100px">
              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                :http-request="uploadFile"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="身份:" prop="type" label-width="100px">
              <el-select v-model="formData.type" placeholder="请选择">
                <el-option label="学生" value="1"></el-option>
                <el-option label="教职工" value="2"></el-option>
                <el-option label="家长" value="3"></el-option>
                <el-option label="企业" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号:" prop="idCard" label-width="100px">
              <el-input v-model="formData.idCard" auto-complete="off" placeholder="请输入身份证"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sortNo" label-width="100px">
              <el-input v-model="formData.sortNo" auto-complete="off" placeholder="请输入排序号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="mail" label-width="100px">
              <el-input v-model="formData.mail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('formData1')">确 定</el-button>
        <el-button @click="handleClose('formData1')">取 消</el-button>
      </div>

      <!-- </div> -->
    </el-dialog>
  </div>
</template>



<script>
import { PrcId, HKId, TWId } from "@/utils/RegularFunction";
import {
  checkUserName,
  getTreeNode,
  insertFlowRelation,
  insertGroupRelation,
  insertOrgRelation,
  removeOrgRelation,
  updateDirect,
  removeGroupRelation,
  removeFlowRelation,
  addUser,
  findUser,
  updateUser,
  uploadAvator,
  selectUserByNode,
  updatePassword,
  selectUserOrg,
  orgFuzzSearch,
  GroupFuzzSearch,
  FlowFuzzSearch,
  selectUserGroup,
  selectUserFlow,
  selectUseMessage,
  restart,
  deleteUser,
  searchUser
} from "@/api/userCenter/userControl";
export default {
  name: "UserControl",
  data() {
    var onlyValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        checkUserName(value)
          .then(result => {
            //console.log(result);
            if (result.data.data.result === "FALSE") {
              callback();
            } else {
              callback(new Error("账号重复"));
            }
          })
          .catch(err => {});
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formData.checkPass !== "") {
          this.$refs.formData.validateField("checkPass");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formData.checkPass !== "") {
          this.$refs.form1.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form1.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
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
    var correlation = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (this.formData.cardType === "") {
          callback(new Error("请选择证件类型"));
        } else if (this.formData.cardType == 1) {
          // 身份证正则校验
          if (PrcId(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的身份证号码"));
          }
        } else if (this.formData.cardType == 2) {
          // 港澳台正则校验
          if (HKId(value) | TWId(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的港澳台证件号码"));
          }
        } else {
          callback();
        }
      }
    };
    return {
      treeI1: 0,
      treeI2: 0,
      treeI3: 0,
      treeI4: 0,
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      tableData: [],
      orgTableData: [],
      groupTableData: [],
      flowTableData: [],
      currentOrgName: "",
      type: "",
      status: "",
      userName: "",
      loginName: "",
      isShowCrew: "",
      relationId: "",
      treeNode: "",
      radio: "",
      searchIuput: "",
      // multipleSelection: [],
      currentRow: "",
      dialogVisible: false,
      dialogFormVisible: false,
      dialogUpdataPass: false,
      dialogUserOrg: false,
      dialogUserGroup: false,
      dialogUserFlow: false,
      dialogEdit: false,
      checked: false,
      show2: true,
      loading: false,
      imageUrl: null,
      orgId: "",
      formData: {
        guid: "",
        loginName: "",
        password: "",
        checkPass: "",
        avator: "",
        xm: "",
        age: "",
        xb: "",
        type: "",
        cardType: "",
        idCard: "",
        phone: "",
        mail: "",
        sortNo: "",
        duty: ""
      },
      form1: {
        password: "",
        checkPass: ""
      },
      searchForm: {
        xm: ""
      },
      formRules: {
        loginName: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { validator: onlyValid, trigger: "blur" },
          { validator: hanzi, trigger: "change" },
          {
            min: 4,
            max: 50,
            message: "长度在 4 到 50 个字母或数字",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          { validator: hanzi, trigger: "change" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字母或数字",
            trigger: "change"
          }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        xm: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 0, max: 60, message: "最大长度60字节", trigger: "change" }
        ],

        // age: [
        //   { type: "number", message: "年龄必须为数字值", trigger: "change" }
        // ],
        mail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "change"
          }
        ],
        phone: [
          {
            pattern: /^1[34578]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
            trigger: "change"
          }
        ],
        age: [
          { required: true, message: "年龄不能为空", trigger: "blur" },
          {
            type: "number",
            message: "年龄必须为数字",
            trigger: "change"
          }
        ],
        idCard: [{ validator: correlation, trigger: "change" }],
        xb: [{ required: true, message: "请输入性别" }],
        type: [{ required: true, message: "请选择身份" }]
      },

      formRules1: {
        password: [
          { validator: validatePass3, trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          { validator: hanzi, trigger: "change" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字母或数字",
            trigger: "change"
          }
        ],
        checkPass: [{ validator: validatePass4, trigger: "blur" }]
      },

      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },

  mounted: function() {
    this.getTree(1, 1);
    this.getTree(2, 1);
    this.getTree(3, 1);
    this.searchByXm();
  },

  methods: {
    //通过姓名模糊查询所有人
    searchByXm() {
      searchUser(this.searchForm.xm).then((result) => {
        //console.log(result)
        //debugger
        this.tableData = result.data.data
      }).catch((err) => {
        
      });
    },
    //关闭同时 清空验证信息
    handleClose(formName) {
      this.dialogFormVisible = false;
      this.dialogUpdataPass = false;
      this.dialogEdit = false;
      this.$refs[formName].clearValidate();
    },
    //设置流程岗位，用户组，机构弹窗关闭回调函数
    dialogClose(tableName) {
      this.dialogUserGroup = false;
      this.dialogUserOrg = false;
      this.dialogUserFlow = false;
      this.$refs.singleTable.setCurrentRow();
      this.relationId = "";
      this.radio = "";
    },

    // 获取树节点
    getTree(type, isShowCrew) {
      let _this = this;
      getTreeNode(type, isShowCrew)
        .then(res => {
          //console.log(res.data);
          switch (type) {
            case 1:
              _this.data1 = res.data.data;
              break;
            case 2:
              _this.data3 = res.data.data;
              break;
            case 3:
              _this.data4 = res.data.data;
              break;
          }
        })
        .catch(err => {
          alert("加载树出错，请重新加载");
        });
    },
    //切换树节点
    handleClick(data, checked, node) {
      this.treeI1++;
      if (this.treeI1 % 2 == 0) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([]);
          this.$refs.tree.setCheckedNodes([data]);
          //交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([]);
          //点击已经选中的节点，置空
        }
      }
    },
    //切换树节点
    orgHandleClick(data, checked, node) {
      this.treeI2++;
      if (this.treeI2 % 2 == 0) {
        if (checked) {
          this.$refs.orgTree.setCheckedNodes([]);
          this.$refs.orgTree.setCheckedNodes([data]);
          //交叉点击节点
        } else {
          this.$refs.orgTree.setCheckedNodes([]);
          //点击已经选中的节点，置空
        }
      }
    },
    //切换树节点
    groupHandleClick(data, checked, node) {
      this.treeI3++;
      if (this.treeI3 % 2 == 0) {
        if (checked) {
          this.$refs.groupTree.setCheckedNodes([]);
          this.$refs.groupTree.setCheckedNodes([data]);
          //交叉点击节点
        } else {
          this.$refs.groupTree.setCheckedNodes([]);
          //点击已经选中的节点，置空
        }
      }
    },
    //切换树节点
    flowHandleClick(data, checked, node) {
      this.treeI4++;
      if (this.treeI4 % 2 == 0) {
        if (checked) {
          this.$refs.flowTree.setCheckedNodes([]);
          this.$refs.flowTree.setCheckedNodes([data]);
          //交叉点击节点
        } else {
          this.$refs.flowTree.setCheckedNodes([]);
          //点击已经选中的节点，置空
        }
      }
    },

    //添加按钮：打开添加用户对话框
    orgAddUser() {
      if (this.orgId !== "") {
        //console.log(checkNode)
        this.dialogFormVisible = true;
        this.resetfrom();
      } else {
        this.$message("请选择一个机构加入人员！");
      }
    },

    //确认勾选状态并插入用户与流程岗位关系
    editUserFlow() {
      var checkNode1 = this.$refs.flowTree.getCheckedNodes();
      if (checkNode1.length === 1) {
        insertFlowRelation(checkNode1[0].id, this.currentRow.guid)
          .then(result => {
            if (result.data.data == 0) {
              this.$message("已存在，请勿重复添加");
            } else {
              this.$message({ message: "加入成功！", type: "success" });
              this.selectFlow(this.currentRow.guid);
            }
          })
          .catch(err => {
            this.$message("加入出错，请重新加入！");
          });
      } else {
        this.$message("请选择一个需要加入的流程岗位！");
      }
    },

    //重置form表单所有字段信息
    resetfrom() {
      (this.formData.guid = ""),
        (this.formData.loginName = ""),
        (this.formData.password = ""),
        (this.formData.checkPass = ""),
        (this.formData.xm = ""),
        (this.formData.age = ""),
        (this.imageUrl = ""),
        (this.formData.xb = ""),
        (this.formData.type = ""),
        (this.formData.cardType = ""),
        (this.formData.idCard = ""),
        (this.formData.phone = ""),
        (this.formData.mail = ""),
        (this.formData.sortNo = ""),
        (this.formData.duty = ""),
        (this.form1.password = ""),
        (this.form1.checkPass = "");
    },

    //确认勾选状态并插入用户与用户组关系
    editUserGroup() {
      var checkNode2 = this.$refs.groupTree.getCheckedNodes();
      if (checkNode2.length === 1) {
        insertGroupRelation(checkNode2[0].id, this.currentRow.guid)
          .then(result => {
            if (result.data.data == 0) {
              this.$message("已存在，请勿重复添加");
            } else {
              this.$message({ message: "加入成功！", type: "success" });
              this.selectGroup(this.currentRow.guid);
            }
          })
          .catch(err => {
            this.$message("加入出错，请重新加入！");
          });
      } else {
        this.$message("请选择一个需要加入的用户组！");
      }
    },

    //确认勾选状态并插入用户与机构关系
    editUserOrg() {
      let that = this;
      var checkNode3 = that.$refs.orgTree.getCheckedNodes();
      if (checkNode3.length === 1) {
        //是否直属1为直属
        let isDirect = 0;
        insertOrgRelation(checkNode3[0].id, that.currentRow.guid, isDirect)
          .then(result => {
            if (result.data.data == 0) {
              that.$message("已存在，请勿重复添加");
            } else {
              that.$message({ message: "加入成功！", type: "success" });
              that.selectOrg(that.currentRow.guid);
            }
          })
          .catch(err => {
            that.$message("加入出错，请重新加入！");
          });
      } else {
        that.$message("请选择一个需要加入的机构！");
      }
    },

    //确认选择状态并移除与机构关系
    removeOrgRelation() {
      let that = this;
      if (that.relationId) {
        removeOrgRelation(that.relationId, that.currentRow.guid)
          .then(result => {
            that.$message({ message: "移除成功！", type: "success" });
            that.relationId = "";
            that.selectOrg(that.currentRow.guid);
          })
          .catch(err => {
            that.$message("移除出错，请重新处理！");
          });
      } else {
        that.$message("请选择需要移除的关系！");
      }
    },

    //修改用户与机构直属关系
    getCurrentRow(index, row) {
      let _this = this;
      //console.log(row)
      updateDirect(row.guid, _this.currentRow.guid)
        .then(resul => {
          _this.$message({ message: "已切换直属机构！", type: "success" });
          _this.selectOrg(_this.currentRow.guid);
        })
        .catch(err => {
          _this.$message("修改直属机构失败，请重试！");
        });
    },

    //确认选择状态并移除与用户组关系
    removeGroupRelation() {
      if (this.relationId) {
        removeGroupRelation(this.relationId, this.currentRow.guid)
          .then(result => {
            this.$message({ message: "移除成功！", type: "success" });
            this.relationId = "";
            this.selectGroup(this.currentRow.guid);
          })
          .catch(err => {
            this.$message("移除出错，请重新处理！");
          });
      } else {
        this.$message("请选择需要移除的关系！");
      }
    },

    //确认选择状态并移除与流程岗位关系
    removeFlowRelation() {
      if (this.relationId) {
        removeFlowRelation(this.relationId, this.currentRow.guid)
          .then(result => {
            this.$message({ message: "移除成功！", type: "success" });
            this.relationId = "";
            this.selectFlow(this.currentRow.guid);
          })
          .catch(err => {
            this.$message("移除出错，请重新处理！");
          });
      } else {
        this.$message("请选择需要移除的关系！");
      }
    },

    //获取对话框表格当前选中行的id
    handleCurrentChange(val) {
      this.relationId = val.guid;
    },

    //添加用户及与机构相关
    submit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(_this.formData)
            .then(result => {
              //console.log(result.data)
              if (result.data.code === 0) {
                _this.findUserByLn(_this.formData.loginName);
              } else {
                _this.$message("新建用户有误，请重新添加！");
              }
            })
            .catch(err => {
              _this.$message("新建失败，请重新添加");
            });
        } else {
          return false;
        }
      });
    },

    //插入用户与部门关系
    orgInsertUser(id) {
      let _this = this;
      let isDirect = 1;
      insertOrgRelation(_this.orgId, id, isDirect).then(re => {
        _this.dialogFormVisible = false;
        this.selectUser("", this.treeNode, "");
        _this.$ref.form.resetFields();
        _this.$message({ message: "添加成功", type: "success" });
      });
    },

    //使用用户名获取对象
    findUserByLn(loginName) {
      let _this = this;
      findUser(loginName)
        .then(res => {
          //console.log(res.data.data);
          _this.orgInsertUser(res.data.data.guid);
        })
        .catch(err => {});
    },

    //提交用户信息修改
    onSubmit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          //密码设为空指，防止对加密后的密码再次加密
          _this.formData.password = "";
          updateUser(_this.formData)
            .then(result => {
              this.selectUser("", this.treeNode, "");
              _this.$message({ message: "修改成功", type: "success" });
              _this.dialogEdit = false;
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },

    //上传头像成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //图片上传
    uploadFile(file) {
      //console.log(file);
      //将文件转化为formdata数据上传
      let fd = new FormData();
      fd.append("file", file.file);
      fd.append("objectName", file.file.name);

      // console.log(fd);
      // post上传头像
      let that = this;
      uploadAvator(fd)
        .then(res => {
          console.log(res);
          that.imageUrl = res.data.data.url;
          that.formData.avator = res.data.data.objectName;
        })
        .catch(err => {
          that.$message("图片上传出错，请重新上传！");
        });
    },

    //上传前验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isPNG || isGIF)) {
        this.$message.error("上传头像图片只能是 JPG/png/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return (isJPG || isPNG || isGIF) && isLt2M;
    },

    //表格全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //根据树节点查询用户
    selectUser(obj, node, data) {
      let _this = this;
      let nodeId = "";
      _this.treeNode = node;
      _this.orgId = node.data.id;

      selectUserByNode(node.data.id)
        .then(result => {
          // console.log(result.data.data)
          _this.currentOrgName = node.data.name;
          _this.currentRow = "";
          _this.$refs.userTable.setCurrentRow();
          if (result.data.data.length == 0) {
            _this.tableData = [];
          } else {
            _this.tableData = result.data.data;
          }
        })
        .catch(err => {
          alert("表格加载出错，请重新加载");
        });
    },

    //格式化性别
    formatRole1(row, column) {
      return row.xb == 1 ? "男" : row.xb == 0 ? "女" : null;
    },

    //格式化状态
    formatRole2(row, column) {
      if (row.isDelete == 1) {
        this.status = false;
        return "禁用";
      } else {
        this.status = true;
        return "启用";
      }
    },

    //格式化选择框
    formatRole3(row, column) {
      if (row.isDirectly == 1) {
        return "直属";
      } else {
        return null;
      }
    },
    //选中用户列表行
    currentChange(val) {
      this.currentRow = val;
    },

    //修改密码按钮：点击验证
    updatePass() {
      // console.log(this.multipleSelection);
      if (this.currentRow == null || this.currentRow == "") {
        this.$message("请单击选中用户进行修改！");
      } else {
        this.dialogUpdataPass = true;
        this.resetfrom();
        this.userName = this.currentRow.xm;
        this.loginName = this.currentRow.loginName;
      }
    },

    //保存按钮--修改密码页面
    updatePassword(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          updatePassword(_this.loginName, _this.form1.password)
            .then(result => {
              this.selectUser("", this.treeNode, "");
              _this.$message({ message: "修改成功", type: "success" });
              this.resetfrom();
              this.dialogUpdataPass = false;
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },

    //用户所在机构按钮勾选验证
    updateUserOrg() {
      // console.log(this.multipleSelection);
      if (this.currentRow == null || this.currentRow == "") {
        this.$message("请单击选中用户进行修改！");
      } else {
        this.dialogUserOrg = true;
        this.searchIuput = "";
        this.userName = this.currentRow.xm;
        this.data2 = this.data1;
        this.selectOrg(this.currentRow.guid);
      }
    },

    //用户所在用户组按钮勾选验证
    updateUserGroup() {
      // console.log(this.multipleSelection);
      if (this.currentRow == null || this.currentRow == "") {
        this.$message("请单击选中用户进行修改！");
      } else {
        this.dialogUserGroup = true;
        this.searchIuput = "";
        this.userName = this.currentRow.xm;
        this.selectGroup(this.currentRow.guid);
      }
    },

    //用户所在流程岗位按钮勾选验证
    updateUserFlow() {
      // console.log(this.multipleSelection);
      if (this.currentRow == null || this.currentRow == "") {
        this.$message("请单击选中用户进行修改！");
      } else {
        this.dialogUserFlow = true;
        this.searchIuput = "";
        this.userName = this.currentRow.xm;
        this.selectFlow(this.currentRow.guid);
        // this.loginName = this.multipleSelection[0].loginName
      }
    },

    //根据用户id查询所在机构
    selectOrg(id) {
      let _this = this;
      selectUserOrg(id)
        .then(result => {
          //console.log(result.data)
          _this.orgTableData = result.data.data;
        })
        .catch(err => {});
    },

    //根据关键字查询用户所在机构
    searchOrg() {
      let _this = this;
      orgFuzzSearch(_this.currentRow.guid, _this.searchIuput)
        .then(result => {
          _this.orgTableData = result.data.data;
        })
        .catch(err => {
          _this.$message("查询出错，请重新查询！");
        });
    },

    //根据用户id查询所在用户组
    selectGroup(id) {
      let _this = this;
      selectUserGroup(id)
        .then(result => {
          //console.log(result.data)
          this.groupTableData = result.data.data;
        })
        .catch(err => {});
    },

    //根据用户id和搜索框查询所在用户组
    searchGroup() {
      let _this = this;
      GroupFuzzSearch(_this.currentRow.guid, _this.searchIuput)
        .then(result => {
          _this.groupTableData = result.data.data;
        })
        .catch(err => {
          _this.$message("查询出错，请重新查询！");
        });
    },

    //根据用户id查询所在流程岗位
    selectFlow(id) {
      let _this = this;
      selectUserFlow(id)
        .then(result => {
          //console.log(result.data)
          this.flowTableData = result.data.data;
        })
        .catch(err => {});
    },

    //根据用户id和关键字查询所在流程岗位
    searchFlow() {
      let _this = this;
      FlowFuzzSearch(_this.currentRow.guid, _this.searchIuput)
        .then(result => {
          _this.flowTableData = result.data.data;
        })
        .catch(err => {
          _this.$message("查询出错，请重新查询！");
        });
    },

    //编辑按钮：回显用户信息
    handleEdit(index, row) {
      let _this = this;
      selectUseMessage(row.guid)
        .then(result => {
          // console.log(result.data.data);
          _this.dialogEdit = true;
          _this.formData = result.data.data.userMessage;
          _this.imageUrl = result.data.data.url;
          _this.formData.xb = result.data.data.userMessage.xb.toString();
          _this.formData.type = result.data.data.userMessage.type.toString();
          _this.formData.cardType = result.data.data.userMessage.cardType.toString();
          _this.formData.duty = result.data.data.userMessage.duty.toString();
        })
        .catch(err => {});
    },

    //修改用户禁用状态为启用状态
    handleAdd(index, row) {
      //console.log(row);
      let _this = this;
      restart(row.guid)
        .then(result => {
          this.selectUser("", this.treeNode, "");
          this.$message({ message: "已启用", type: "success" });
        })
        .catch(err => {});
    },

    //修改用户启用为禁用状态
    handleDelete(index, row) {
      let _this = this;
      deleteUser(row.guid)
        .then(result => {
          this.selectUser("", this.treeNode, "");
          this.$message({ message: "已禁用", type: "success" });
        })
        .catch(err => {});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#user-control {
  height: 100%;
  text-align: center;

  .item1 {
    width: 42%;
    float: left;
  }
  .item2 {
    width: 42%;
    float: right;
    margin-right: 10%;
  }

  .iuput1 {
    width: 70%;
  }

  .digFont {
    margin: 3%;
    font-size: 16px;
  }

  .dialog1 {
    width: 100%;
    height: 520px;
    text-align: right;
  }

  .dialog3 {
    width: 100%;
    height: 550px;
  }

  // 弹出框
  .dialog-left {
    border-right: 1px dashed #ddd;
  }
  .dialog-left,
  .dialog-right {
    margin: 10px;
    padding: 10px;
  }

  .pic-img {
    .el-form-item__content {
      height: 168px;
    }
  }
}


</style>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

