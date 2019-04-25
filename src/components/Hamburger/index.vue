<template>
  <div class="hamburger" :class="{'is-active':isActive}" @click="toggleClick">
    <img src="./../../assets/meau.png">
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  color: white;
  cursor: pointer;
  img {
    width: 30px;
    height: auto;
    position: relative;
    top: 10px;
  }
}
.hamburger.is-active {
  img {
    display: block;
    transform: rotate(360deg);
    -ms-transform: rotate(360deg); /* IE 9 */
    -moz-transform: rotate(360deg); /* Firefox */
    -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
    -o-transform: rotate(360deg); /* Opera */
  }
}
</style>
