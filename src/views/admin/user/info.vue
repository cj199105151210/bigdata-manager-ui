<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="main_middle_content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="信息管理" name="first">
            <div class="grid-content bg-purple" v-if="activeName === 'first'? true:false ">
              <el-form
                :model="ruleForm2"
                :rules="rules2"
                ref="ruleForm2"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input type="text" v-model="ruleForm2.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="ruleForm2.phone" placeholder="验证码登录使用"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                  <el-upload
                    class="avatar-uploader"
                    action="/api/admin/file/upload"
                    :headers="headers"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                  >
                    <img id="avatar" v-if="ruleForm2.avatar" :src="avatarUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="error-tips">支持格式JPG/PNG/GIF,上传头像图片大小不能超过 2MB!</div>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                  <el-button size="small" @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="密码管理" name="second">
            <div class="grid-content bg-purple" v-if="activeName === 'second'? true:false ">
              <el-form
                :model="ruleForm2"
                :rules="rules2"
                ref="ruleForm2"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="原密码" prop="password">
                  <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="newpassword1">
                  <el-input type="password" v-model="ruleForm2.newpassword1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newpassword2">
                  <el-input type="password" v-model="ruleForm2.newpassword2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="submitForm('ruleForm2')">提交</el-button>
                  <el-button size="small" @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { handleImg, openWindow } from "@/utils/util";
import { mapGetters, mapState } from "vuex";
import store from "@/store/";
import request from "@/utils/request";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm2.password !== "") {
        if (value !== this.ruleForm2.newpassword1) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      activeName: "first",
      picTrue: true,
      avatarUrl: "",
      show: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token
      },
      ruleForm2: {
        username: "",
        password: "",
        newpassword1: "",
        newpassword2: "",
        avatar: "",
        phone: ""
      },
      rules2: {
        password: [
          {
            required: true,
            min: 6,
            message: "原密码不能为空且不少于6位",
            trigger: "change"
          }
        ],
        newpassword1: [
          { required: false, min: 6, message: "不少于6位", trigger: "change" }
        ],
        newpassword2: [
          { required: false, validator: validatePass, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.initInFo();
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(["userInfo"])
  },
  methods: {
    initInFo() {
      this.$store.dispatch("GetInfo").then(data => {
        this.ruleForm2.username = data.sysUser.username;
        this.ruleForm2.phone = data.sysUser.phone;
        this.ruleForm2.avatar = data.sysUser.avatar;
        handleImg(data.sysUser.avatar, "avatar");
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.picTrue) {
          request({
            url: "/api/admin/user/edit",
            method: "put",
            data: this.ruleForm2
          })
            .then(response => {
              if (response.data.data) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
                // 修改密码之后强制重新登录
                if (this.activeName === "second") {
                  this.$store.dispatch("LogOut").then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                  });
                } 
              } else {
                this.$notify({
                  title: "失败",
                  message: response.data.msg,
                  type: "error",
                  duration: 2000
                });
              }
            })
            .catch(() => {
              this.$notify({
                title: "失败",
                message: "修改失败",
                type: "error",
                duration: 2000
              });
            });
        } else {
          return false;
        }
      });
    },
    handleClick(tab, event) {
      if (tab.name == "first") {
        handleImg(this.userInfo.avatar, "avatar");
        this.ruleForm2.username = this.userInfo.username;
        this.ruleForm2.phone = this.userInfo.phone;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw);
      this.ruleForm2.avatar = res.data.bucketName + "-" + res.data.fileName;
      this.$store.dispatch('setAavtar', 'avatar').then(res=>{
      }).catch(()=>{
      })
    },
    // 上传图片后基本大小格式验证
    beforeAvatarUpload(file) {
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isPIC = isGIF || isPNG || isJPG;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if ((!isGIF && !isPNG && !isJPG) || file.type == "") {
        this.$message.error("上传头像图片只能是 JPG,PNG,GIF格式!");
      } else if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      this.picTrue = isPIC && isLt2M;
      return;
    }
  }
};
</script>
<style>
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
  font-size: 28px !important;
  color: #8c939d !important;
  width: 178px !important;
  height: 178px !important;
  line-height: 178px !important;
  text-align: center !important;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.error-tips {
  color: red;
  font-size: 12px;
}
</style>
