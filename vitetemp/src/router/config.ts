export const menu = [
  {
    title: '首页',
    icon: '',
    meta: { keepAlive: true },
    key: '/home'
  },
  {
    title: 'canvs',
    icon: '',
    meta: { keepAlive: true },
    key: 'one',
    children: [
      {
        title: '签字板',
        icon: '',
        meta: { keepAlive: true },
        key: '/drawBoard'
      },
      {
        title: '文字绘制',
        icon: '',
        meta: { keepAlive: true },
        key: '/drawFont'
      },
      {
        title: '梅花背景',
        icon: '',
        meta: { keepAlive: true },
        key: '/plumTree'
      },
      {
        title: '取景框',
        icon: '',
        meta: { keepAlive: true },
        key: '/findFrame'
      },
      {
        title: '刮刮乐',
        icon: '',
        meta: { keepAlive: true },
        key: '/scrapeMusic'
      },
      {
        title: '转盘抽奖',
        icon: '',
        meta: { keepAlive: true },
        key: '/luckyTurn'
      },
      {
        title: '海报',
        icon: '',
        meta: { keepAlive: true },
        key: '/poster'
      },
      {
        title: '高斯模糊',
        icon: '',
        meta: { keepAlive: true },
        key: '/canvasBlur'
      },
      {
        title: '临时文件',
        icon: '',
        meta: { keepAlive: true },
        key: '/temp',
      }
    ]
  },
  {
    title: '九宫格',
    icon: '',
    meta: { keepAlive: true },
    key: '/shopGame'
  },
  {
    title: '上拉下拉组件',
    icon: '',
    meta: { keepAlive: true },
    key: '/refersh'
  },
  {
    title: '无限列表',
    icon: '',
    meta: { keepAlive: true },
    key: '/wirlessList'
  },
  {
    title: '一级菜单',
    icon: '',
    meta: { keepAlive: true },
    key: 'one',
    children: [
      {
        title: '二级菜单',
        icon: '',
        meta: { keepAlive: true },
        key: 'two',
        children: [
          {
            title: '三级菜单1',
            icon: '',
            meta: { keepAlive: true },
            key: '/three'
          },
          {
            title: '三级菜单2',
            icon: '',
            meta: { keepAlive: true },
            key: '/three'
          },
        ]
      },
    ]
  },
]