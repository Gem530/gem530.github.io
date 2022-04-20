export const menu = [
  {
    title: '首页',
    icon: '',
    meta: { keepAlive: true },
    key: '/home'
  },
  {
    title: '一次菜单',
    icon: '',
    meta: { keepAlive: true },
    key: 'one',
    children: [
      {
        title: '画布-二级',
        icon: '',
        meta: { keepAlive: true },
        key: 'two',
        children: [
          {
            title: '画布',
            icon: '',
            meta: { keepAlive: true },
            key: '/canvas'
          },
          {
            title: '画布-0',
            icon: '',
            meta: { keepAlive: true },
            key: '/canvas0'
          }
        ]
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
    title: '转盘',
    icon: '',
    meta: { keepAlive: true },
    key: '/luckTurn'
  },
]