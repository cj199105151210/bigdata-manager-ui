<template>
  <div class="avue-contail avue--collaps" :class="{'avue--collapse':isCollapse}">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top/>
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div class="avue-breadcrumb-breads">
          <breadcrumb class="breadcrumb-container"/>
        </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <!-- 主体视图层 -->
        <router-view class="avue-view"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/utils/admin";
import { validatenull } from "@/utils/validate";
import { calcDate } from "@/utils/date.js";
import { getStore } from "@/utils/store.js";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import store from "@/store";
import Breadcrumb from "./bread-crumb";

export default {
  components: {
    top,
    Breadcrumb,
    sidebar
  },
  name: "index",
  mounted() {
    this.init();
  },
  computed: mapGetters(["isCollapse", "website"]),
  props: [],
  methods: {
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
    }
  }
};
</script>
