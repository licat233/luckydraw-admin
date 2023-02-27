export default [
  {
    path: '/login',
    name: 'login',
    component: './Admin/Login',
    layout: false,
  },
  // { path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      // { path: '/admin', redirect: '/admin/sub-page' },
      // { path: '/admin/sub-page', component: './Admin' },
      // { path: '/admin/adminer', name: "管理员",icon: 'idcard', component: './Adminer'},
    ],
  },
  { name: "管理员", path: '/admin/adminer', access: 'canAdmin', icon: 'idcard', component: './Adminer'},
  { name: "用户", icon: 'user', path: 'user', component: './User' },
  { name: "活动", icon: 'flag', path: 'activity', component: './Activity' },
  { name: "奖品", icon: 'gift', path: 'prize', component: './Prize' },
  { name: "抽奖记录", icon: 'container', path: 'record', component: './WinningRecords' },
  { path: '/', redirect: '/record' },
  { path: '*', layout: false, component: './404' },
];
