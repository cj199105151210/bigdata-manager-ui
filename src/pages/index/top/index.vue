<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div
        class="avue-breadcrumb"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]"
      >
        <i class="collapse-icon" @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-nav__left">
      <topbar :props="website.menu.props" :menu="menu" />
    </div>
    <div class="top-bar__right">
      <el-tooltip v-if="this.userInfo.avatar" effect="dark" content="用户头像" placement="bottom">
        <img id="thumbnail" class="top-bar__img">
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info">个人信息</router-link>
          </el-dropdown-item>
           <el-dropdown-item>
            <a @click="logout">退出系统</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { listenfullscreen, handleImg } from "@/utils/util";
import topbar from "./top-bar";

export default {
  name: "top",
  data() {
    return {};
  },
  components: {
    topbar
  },
  filters: {},
  created() {
    handleImg(this.avatar, "thumbnail");
  },
  mounted() {
    listenfullscreen(this.setScreen);
    // this.$store.dispatch('setAavtar',"thumbnail").then((res) => {
    //   }).catch((err)=>{
    //   })
  },
  computed: {
    ...mapState({
      showCollapse: state => state.common.showCollapse
    }),
    ...mapGetters(["userInfo",'avatar','website','menu', "isCollapse"])
  },
  methods: {
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    logout() {
      this.$confirm("退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal:false
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    }
  }
};
</script>
<style lang="scss">
.el-dropdown-menu {
  .el-dropdown-menu__item{
    padding: 0;
    a {
      display: block;
      width: 100%;
      padding:0 20px;
    }
  }
}
</style>


