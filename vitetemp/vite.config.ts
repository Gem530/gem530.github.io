import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport ({
      imports: ["vue", "vue-router"], // 自动导入vue和vue-router相关函数
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
