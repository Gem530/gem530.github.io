import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  return {
    base: './',
    resolve: {
      alias: {
        "~": path.resolve(__dirname, './'),
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
      port: 8081,
      open: true
      // proxy: {
      //   '/': {
      //     target: 'https://dev.pingthe.xyz:443',
      //     ws: true,
      //     changeOrigin: true,
      //     secure: false
      //   }
      // }
    },
    // Vue3+Vite+TypeScript打包时报类型错误，dev启动不报错 删除"vue-tsc --noEmit && "只保留vite build
    // 打包时，分包，可以在首次加载时更快打开页面
    build: {
      chunkSizeWarningLimit: 1500, //单个模块文件超过了默认块儿限制，超过1500k时，提示建议进行代码分块儿后进行动态导入可以加速页面加载速度
      minify: 'terser', // drop_console/drop_debugger 需要开启这个才会生效
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: command === 'build' && process.env.NODE_ENV === 'production',
          drop_debugger: command === 'build' && process.env.NODE_ENV === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id: string) { // 分包
            // 根据名字 node_modules/xx/ xx的名字分包
            // if (id.includes('echarts')) { // 包括在node_modules中
            //   console.log('echarts', id)
            //   echarts D:/gem/gem530.github.io/vitetemp/node_modules/echarts/lib/coord/parallel/Parallel.js
            //   return 'echarts'
            // }
            if (id.includes('node_modules')) {
              // console.log('node_modules', id, id.toString().split('node_modules/')[1].split('/')[0].toString())
              // node_modules D:/gem/gem530.github.io/vitetemp/node_modules/zrender/lib/svg/core.js zrender
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    }
  }
})
