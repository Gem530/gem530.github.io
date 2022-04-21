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