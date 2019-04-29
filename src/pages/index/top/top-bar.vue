<template>
  <ul class="top-bar clearfix">
    <li class="item" :class="{active:show_index == -1}">
      <a @click="getRouter('',-1,false)" href="javascript:;" onfocus="this.blur();">
        <i class="iconfont icon-home"/>
        <span>首页</span>
      </a>
    </li>
    <li class="item" :class="{active:show_index == index}" v-for="(item,index) in menu" :key="index">
      <a @click="getRouter(item,index,true)" href="javascript:;" onfocus="this.blur();">
        <i :class="item[iconKey]"/>
        <span>{{item[labelKey]}}</span>
      </a>
    </li>
  </ul>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/utils/validate";
import config from "./config.js";
export default {
  name: "topbar",
  data() {
    return {
    };
  },
  props: {
    menu: {
      type: Array
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
   
  },
  computed: {
    ...mapGetters(["website", "tag", "keyCollapse", "screen", "show_index"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
  },
  methods: {
    getRouter(item, index, logo) {
      if (logo) {
        this.$router.$avueRouter.group = item.group;
        if (item.children.length == 0) {
          this.$router.push(item.path);
        } else if (item.children[0].children.length == 0) {
          this.$router.push(item.children[0].path);
        } else {
          this.$router.push(item.children[0].children[0].path);
        }
      } else {
        this.$router.push("/wel");
      }
      this.$store.commit("SET_SHOW_INDEX", index);
    }
  }
};
</script>

