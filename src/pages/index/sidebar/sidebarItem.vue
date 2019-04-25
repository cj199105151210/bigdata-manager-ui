<template>
  <div class="menu-wrapper">
    <template v-if="show_index == index" v-for="(item,index) in menu">
      <el-menu-item
        v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
        :index="item[pathKey]"
        @click="open(item)"
        :key="item[labelKey]"
        :class="{'is-active':vaildAvtive(item)}"
      >
        <svg-icon :icon-class="item[iconKey]"/>
        <span slot="title" :alt="item[pathKey]">{{item[labelKey]}}</span>
      </el-menu-item>

      <template v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)">
        <template v-for="second in item[childrenKey]">
          <el-menu-item
            v-if="validatenull(second[childrenKey]) && vaildRoles(second)"
            :index="second[pathKey]"
            @click="open(second)"
            :key="second[labelKey]"
            :class="{'is-active':vaildAvtive(second)}"
          >
            <i :class="second[iconKey]"/>
            <span slot="title" :alt="second[pathKey]">{{second[labelKey]}}</span>
          </el-menu-item>

          <el-submenu
            v-else-if="!validatenull(second[childrenKey]) && vaildRoles(second)"
            :index="second[pathKey]"
            :key="second[labelKey]"
          >
            <template slot="title">
              <i :class="second[iconKey]"/>
              <span
                slot="title"
                :class="{'el-menu--display':collapse && first}"
              >{{second[labelKey]}}</span>
            </template>
            <template v-for="(child,cindex) in second[childrenKey]">
              <el-menu-item
                :index="child[pathKey],cindex"
                @click="open(child)"
                :class="{'is-active':vaildAvtive(child)}"
                v-if="validatenull(child[childrenKey])"
                :key="child[labelKey]"
              >
                <i :class="child[iconKey]"/>
                <span slot="title">{{child[labelKey]}}</span>
              </el-menu-item>
              <sidebar-item
                v-else
                :menu="[child]"
                :key="cindex"
                :props="props"
                :screen="screen"
                :collapse="collapse"
              ></sidebar-item>
            </template>
          </el-submenu>
        </template>
      </template>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/utils/validate";
import config from "./config.js";
export default {
  name: "sidebarItem",
  data() {
    return {
      config: config
    };
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    }
  },
  created() {
    
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["roles", "show_index"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  methods: {
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some(ele =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    open(item) {
      // if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: item[this.labelKey],
          src: item[this.pathKey]
        }),
        query: item.query
      });
    }
  }
};
</script>



