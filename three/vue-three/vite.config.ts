import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: process.env.NODE_ENV == 'production' ? '/three/vue-three/dist/':'',
    resolve: {
      alias: {
        // 设置路径
        "~": path.resolve(__dirname, "./"),
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
        // "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    server: {
      port: 8080,
      host: '0.0.0.0',
      https:false,
      // proxy: {
      //   "/": {
      //     target: "http://54.255.187.191:9220", //测试
      //     changeOrigin: true,
      //   },
      // },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@import "@/assets/styles/index.scss";`
          additionalData: `@use "@/assets/styles/common.scss";`
        }
      }
    },
    plugins: [vue()],
  }
})
