import path from "path"
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import postcssToRem from 'postcss-pxtorem'
import { defineConfig, loadEnv } from 'vite'
import Components from "unplugin-vue-components/vite" //自动导入组件
import { VantResolver } from "unplugin-vue-components/resolvers"; //按需加载vant

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的mode加载 .env 文件
  // 设置第三个参数位 '' 来加载所有环境变量，而不管是否有 'VITE_' 前缀
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // server: { // 本地跨域请求
    //   host: '0.0.0.0',
    //   port: 9000,
    //   open: true, // 是否自动打开浏览器
    //   proxy: {
    //     '/api': {
    //       target: 'http://54.151.135.104:9001',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     }
    //   }
    // },
    resolve: {
      alias: {
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          /** index.scss 设置样式，结果页面中样式未生效，例：h1{color:red;}
           * scss文件失效问题 http://events.jianshu.io/p/4918f8d9f2b4
           * 原来这不是一个bug，
           * 只有在main.js引入一个其他scss文件或者在.vue文件中使用<style lang="scss"><style>，
           * 并且里面有内容，则 scss.additionalData 配置的全局scss文件就可以正确引入了，
           * 还建议我们在 scss.additionalData 引入的文件最好只写scss变量，别写css变量，
           * 因为css变量是运行时属性
          */
          additionalData: `@import "@/assets/styles/index.scss";`
        }
      },
      postcss: {
        plugins: [
          postcssToRem({ // 搭配 amfe-flexible 使用，amfe-flexible 在main.ts中引入
            rootValue: 37.5, //1rem的大小
            propList: ["*"], //需要转换的属性
            // selectorBlackList: ['.norem'] // 过滤掉.norem- 开头的class，不进行rem转换
          }),
          autoprefixer(), // 自动补全css浏览器前缀
        ],
      },
    },
    plugins: [
      vue(),
      Components({
        //组件自动导入配置
        dirs: ["src/components"],
        extensions: ["vue", "tsx", "jsx"],
        // 搜索子目录
        deep: true,
        // ui库解析器，也可以自定义
        resolvers: [VantResolver()],
      })
    ]
  }
})
