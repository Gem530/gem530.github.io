import { defineConfig } from 'vite'
import path from "path"
import autoApi from './autoApi'
import vue from '@vitejs/plugin-vue'
import iconExport from './iconExport'
import ViteImages from "vite-plugin-vue-images" //自动导入图片
import compression from 'vite-plugin-compression' // gzip 压缩
import Components from "unplugin-vue-components/vite" //自动导入组件
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers"; //按需加载ant/elementplus

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  // console.log('command-----', command, command !== 'build')
  return {
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
      chunkSizeWarningLimit: 1500, //单个模块文件超过了默认块儿限制，超过1500k时，提示建议进行代码分块儿后进行动态导入可以加速页面加载速度
      // outDir: 'admin', // 指定输出路径，与vite.config.ts平级
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
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
      },
    },
  }
})
