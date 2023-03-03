# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

使用了接口，跨域了，所以只能在本地查看，并且只能使用ip打开查看，不能使用localhost查看
https://57k67j9137.zicp.fun/#/  反向代理的地址，公司电脑启动了服务，nginx配置文件可以查看 ./nginx.conf
短横线命名：
  文件名
  组件使用
  css类名

https://aitrade.ga/books/lightweight-charts-docs-cn/book/home.html k线图学习链接

package.json
scripts {
  build: 'vue-tsc --noEmit && vite build' // 打包时校验ts
  build: 'vite build' // 打包时不校验ts
}

实现vite小插件时，遇到的问题：
  1.vite打包结束后，未结束命令行 https://segmentfault.com/q/1010000020963015与该链接中的问题类似
  解决，注释fs.watch，不使用该方法监听文件，因为vite插件钩子函数handleHotUpdate能做到相似的效果，文件改变时也能监听到
  2.热更新handleHotUpdate(ctx) ctx.file的路径是'/'，而通过path获取的地址是'\'，所以在匹配时，需要替换为一样的'/'