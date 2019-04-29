## icon

```bash
# ionic use
本地中有些现有的图标可以使用，如果找不到你想用的图标 可以在阿里字体中下载svg 放在文件的/icons/svg中，然后在页面中直接使用 <svg-icon icon-class="tab" />

```
## Build Setup

```bash
# Clone project
git clone http://58.22.61.222:18001/smartcity/bigdata-base-ui

# Install node
首先需要安装你nodejs 的基础环境

# Install dependencies
npm install
cnpm install

# 建议使用cnpm  使用淘宝镜像安装如下
npm install --registry=https://registry.npm.taobao.org

# 运行项目
npm run dev   
cnpm run dev 

# Build 项目
npm run build
cnpm run build

```

开发环境调整
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {  //跨域问题
      '/api': {
        target: 'http://127.0.0.1:2999',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },

