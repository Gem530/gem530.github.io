import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  // 配置全局scss 所有文件都可以使用这个文件内的css
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/css/style.scss";'
      }
    }
  },
  plugins: [
    vue(),
    AutoImport ({
      imports: ["vue", "vue-router", "vuex"], // 自动导入vue和vue-router相关函数
      dts: "src/auto-import.d.ts" // 生成 `auto-import.d.ts` 全局声明
    })
  ],
  server: {
    host: 'localhost',
    port: 8081
    // proxy: {
    //   '/': {
    //     target: 'https://dev.pingthe.xyz:443',
    //     ws: true,
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
})
