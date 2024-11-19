import { loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// 需要配置打包去除console与注释
// console.log('env--', process.env)
const envScript = (process.env.npm_lifecycle_script as string).split(' ')
const envName = envScript[envScript.length - 1] // 通过启动命令区分环境
const envData = loadEnv(envName, 'env') as unknown as any
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // plugins: [
  //   '~/utils/jsencrypt.ts'
  // ],
  app: {
    head: {
      script: [
        // {
        //   innerHTML: `
        //   window.__lc = window.__lc || {};
        //   window.__lc.license = 16947177;
        //   ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
        //   `,
        //   async: true,
        //   type: 'text/javascript'
        // },
        // {
        //   src: 'https://www.google.com/recaptcha/enterprise.js?hl=en',
        //   async: true,
        //   defer: true
        // },
        {
          innerHTML: `
            // 动态切换谷歌人机识别语言
            function getQueryParams() {
              var search = location.search;
              var queryParams = {};
              if (search) {
                search = search.substring(1); // 去掉问号
                var params = search.split('&');
                for (var i = 0; i < params.length; i++) {
                  var pair = params[i].split('=');
                  var paramName = decodeURIComponent(pair[0]);
                  var paramValue = decodeURIComponent(pair[1]);
                  queryParams[paramName] = paramValue;
                }
              }
              
              return queryParams;
            }
            var params = getQueryParams();
            let lang = localStorage.getItem('lang');
            if (params.lang) {
              lang = params.lang
            }
            // lang = lang ? lang : 'en';
            if (lang) {
              if (lang == 'zh_CN') {
                lang = 'zh';
              } else if (lang == 'en_US') {
                lang = 'en';
              } else if (lang == 'ru_RU') {
                lang = 'ru';
              } else if (lang == 'ko_KR') {
                lang = 'ko';
              } else {
                lang = 'en';
              }
            } else {
              lang = 'en';
            }
            let s = document.createElement('script');
            s.async = true;
            s.defer = true;
            s.type = "text/javascript";
            s.src = "https://www.google.com/recaptcha/enterprise.js?hl="+lang;
            document.head.appendChild(s);
          `,
          async: true,
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.bootcss.com/vConsole/3.3.0/vconsole.min.js'
        },
        {
          innerHTML: `
            function getQueryParams() {
              var search = location.search;
              var queryParams = {};
              if (search) {
                search = search.substring(1); // 去掉问号
                var params = search.split('&');
                for (var i = 0; i < params.length; i++) {
                  var pair = params[i].split('=');
                  var paramName = decodeURIComponent(pair[0]);
                  var paramValue = decodeURIComponent(pair[1]);
                  queryParams[paramName] = paramValue;
                }
              }
              
              return queryParams;
            }
            
            var params = getQueryParams();
            if (params && params.console == 'true') {
              const vConsole = new VConsole();
            }
          `,
          type: 'text/javascript'
        },
        // {
        //   src: 'https://cdn.livechatinc.com/tracking.js'
        // },
        {
          src: '/flexible.js', type: 'text/javascript'
        },
      ],
      // noscript: [
      //   {
      //     innerHTML: `<a style="position: absolute; top: 0px; left: 0px;" href="https://www.livechat.com/chat-with/16828326/" rel="nofollow">Chat with us</a>, powered by <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a>`
      //   }
      // ]
    },
  },
  runtimeConfig: {
    public: envData
  },
  postcss: {
    plugins: {
      // "autoprefixer": {
      //   overrideBrowserslist: ["last 5 version", ">1%", "ie >= 8"]
      // },
      "autoprefixer": false,
      "postcss-pxtorem": {
        rootValue: 37.5, // 指定转换倍率，1rem = 37.5px
        proList: ['*'], // 属性列表，表示哪些css属性的px转换为rem
        replace: true, // 替换包含rem的规则，而不是添加回退
        minPixelValue: 1, // 需要转换的最小值，一般1px像素不转换，以上才转换
        unitPrecision: 6, // rem单位后的小数点保留位数
        selectorBalckList: ['van'], // 匹配不被转换为rem的选择器
      }
    }
  },
  ssr: true,
  devtools: { enabled: true },
  modules: ["nuxt-swiper", '@nuxtjs/i18n', '@vant/nuxt', 'nuxt-gtag'],
  gtag: {
    id: 'G-M7F7GR6E0F'
  },
  i18n: {
    // lazy: true,
    // langDir: './language/locale',
    // locales: [
    //   {
    //     code: 'en_US',
    //     iso: 'en_US',
    //     name: 'English',
    //     file: 'en_US.ts'
    //   },
    //   {
    //     code: 'zh_CN',
    //     iso: 'zh_CN',
    //     name: '简体中文',
    //     file: 'zh_CN.ts'
    //   },
    // ],
    /* module options */
    vueI18n: './language/i18n.config.ts'
  },
  // webpack: {
  //   aggressiveCodeRemoval: true
  // },
  nitro: {
    devProxy: {
      [envData.VITE_BASE_URL]: {
        // target: "http://192.168.2.113:8881", // 这里是接口地址
        target: "https://www.pcbsuper.com/prod-api", // 这里是接口地址
        changeOrigin: true,
        prependPath: true,
        rewrite: (path: string) => path.replace(new RegExp('^'+envData.VITE_BASE_URL), '')
      } as any,
    },
    // 配置打包后的文件名以及路径
    output: {
      dir: 'mpcb',
      serverDir: 'mpcb/server',
      publicDir: 'mpcb/public'
    }
  },
  css: [
    '@/assets/styles/index.scss'
  ],
  vite: {
    envDir: '~/env',
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'assets/svg')]
      }),
    ]
  },
})