export default [
  {
    path: '/login',
    name: 'login',
    component: './Login',
    layout: false,
  },
  { name: "管理员", path: '/admin/adminer', access: 'canAdmin', icon: 'idcard', component: './Adminer'},
  { name: "用户", icon: 'user', path: 'user', component: './User' },
  { name: "活动", icon: 'flag', path: 'activity', component: './Activity' },
  { name: "奖品", icon: 'gift', path: 'prize', component: './Prize' },
  { name: "抽奖记录", icon: 'container', path: 'record', component: './WinningRecords' },
  { path: '/', redirect: '/record' },
  { path: '*', layout: false, component: './404' },
];
