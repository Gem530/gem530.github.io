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
        {
          innerHTML: `
          window.__lc = window.__lc || {};
          window.__lc.license = 16947177;
          ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
          `,
          async: true,
          type: 'text/javascript'
        },
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
        //   src: 'https://polyfill.io/v3/polyfill.min.js?features=default'
        // },
        // {
        //   src: 'https://maps.googleapis.com/maps/api/js?key=INSERT_YOUR_API_KEY&callback=initMap&v=weekly'
        // }
        // {
        //   innerHTML: `
        //   (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src='https://maps.'+c+'apis.com/maps/api/js?'+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        //     key: "YOUR_API_KEY_HERE",
        //     // Add other bootstrap parameters as needed, using camel case.
        //     // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
        //   });
        //   `
        // }
        // {
        //   src: 'https://cdn.livechatinc.com/tracking.js'
        // }
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
  ssr: true,
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "nuxt-swiper", '@nuxtjs/i18n', '@vant/nuxt', 'nuxt-gtag'],
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
        target: "http://192.168.0.105:8881", // 这里是接口地址
        // target: "https://www.pcbsuper.com/prod-api", // 这里是接口地址
        changeOrigin: true,
        prependPath: true,
        rewrite: (path: string) => path.replace(new RegExp('^'+envData.VITE_BASE_URL), '')
      } as any,
      '/prod-api1': {
        target: 'https://www.pcbsuper.com/prod-api1',
        changeOrigin: true,
        prependPath: true,
        rewrite: (path: string) => path.replace(new RegExp('^/prod-api1'), '')
      } as any
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
      })
    ]
  }
})