import { defineConfig } from 'vite'
import path from "path"
import vue from '@vitejs/plugin-vue'
import ViteImages from "vite-plugin-vue-images" //自动导入图片
import Components from "unplugin-vue-components/vite" //自动导入组件
import { AntDesignVueResolver,ElementPlusResolver  } from "unplugin-vue-components/resolvers"; //按需加载ant/elementplus

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: { // 本地跨域请求
    host: '0.0.0.0',
    port: 8080,
    open: true, // 是否自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://13.168.2.107:9001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  },
  resolve: {
    // 别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@http": path.resolve(__dirname, "./src/request"),
      "@utils": path.resolve(__dirname, "./src/utils/index.js"),
      "@api": path.resolve(__dirname, "./src/api")
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/index.scss";`
      }
    }
  },
  plugins: [
    vue(),
    ViteImages({
      dirs: ["src/assets"], // 图像目录的相对路径
      extensions: ["jpg", "jpeg", "png", "svg", "webp"], // 有效的图像扩展
      customResolvers: [], // 覆盖名称->图像路径解析的默认行为
      customSearchRegex: "([a-zA-Z0-9]+)", // 重写搜索要替换的变量的Regex。
    }),
    Components({
      //组件自动导入配置
      dirs: ["src/components"],
      extensions: ["vue", "tsx", "jsx"],
      // 搜索子目录
      deep: true,
      // ui库解析器，也可以自定义
      resolvers: [AntDesignVueResolver(),ElementPlusResolver()],
    }),
  ]
})
