import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  return {
    plugins: [
      vue(),
      qiankun('childModule', {
        useDevMode: true
      })
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    base: command === 'build' ? 'https://57k67j9137.zicp.fun/children/child/' : './',
    server: {
      hmr: true,
      // 服务器主机名，如果允许外部访问，可设置为0.0.0.0
      host: "0.0.0.0",
      port: 9001, //服务器端口号
      open: false, //是否自动打开浏览器
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        "/api": {
          target: "https://gm.beihest.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  
  }
})
