interface theme {
  bg: string,
  text: string
}
type colorType = keyof theme

const colors = [
  ['--el-bg-color', 'bg'],
  ['--bg-theme-white', 'bg'],
  ['--el-color-white', 'text'],
  ['--el-color-black', 'bg'],
  ['--el-fill-color-blank', 'bg'],
  ['--text-theme-black', 'text'],
  ['--el-menu-bg-color', 'bg'],
  ['--el-menu-text-color', 'text'],
]
export const toggleTheme = (theme: theme) => {
  colors.forEach(v => {
    const type = v[1] as colorType
    changeScssData(v[0], theme[type])
  })
}

// 改变scss全局变量方法
export const changeScssData = (varName: string, varValue: string) => {
  // 使用这个方法改变scss全局变量时，scss定义需要这样：$white: var(--colorWhite, #ffffff); 要加上var(--xxx, xxx)
  document.getElementsByTagName('body')[0].style.setProperty(varName, varValue)
}