import { defineConfig } from 'vite'
import path from "path"
import autoApi from './autoApi'
import vue from '@vitejs/plugin-vue'
import iconExport from './iconExport'
import ViteImages from "vite-plugin-vue-images" //自动导入图片
import compression from 'vite-plugin-compression' // gzip 压缩
import Components from "unplugin-vue-components/vite" //自动导入组件
import { AntDesignVueResolver,ElementPlusResolver  } from "unplugin-vue-components/resolvers"; //按需加载ant/elementplus

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: { // 本地跨域请求
    host: '0.0.0.0',
    port: 9000,
    open: true, // 是否自动打开浏览器
    proxy: {
      '/dev-api': {
        target: 'http://13.212.17.88:8086/prod-api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, ""),
      }
    }
  },
  resolve: {
    // 别名
    alias: {
      '@': path.resolve(__dirname, "./src")
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/styles/index.scss";`
        additionalData: `@use "@/assets/styles/index.scss" as *;`
      }
    }
  },
  plugins: [
    vue(),
    autoApi(),
    iconExport(),
    ViteImages({
      dirs: ["src/assets"], // 图像目录的相对路径
      extensions: ["jpg", "jpeg", "png", "svg", "webp"], // 有效的图像扩展
      customResolvers: [], // 覆盖名称->图像路径解析的默认行为
      customSearchRegex: "([a-zA-Z0-9]+)", // 重写搜索要替换的变量的Regex。
    }),
    Components({
      //组件自动导入配置
      dirs: ["src/components","src/layout"],
      extensions: ["vue", "tsx", "jsx"],
      // 搜索子目录
      deep: true,
      // ui库解析器，也可以自定义
      resolvers: [AntDesignVueResolver(),ElementPlusResolver()],
    }),
    // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
    compression({
      ext: '.gz',
      deleteOriginFile: false,
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
    })
  ],
  build: {
    outDir: 'admin', // 指定输出路径，与vite.config.ts平级
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
