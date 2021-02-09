export default {
  pages: [
    'pages/index/index',
    'pages/sign-success/sign-success',
    'pages/person-data/person-data',
    'pages/my-create/my-create',
    'pages/my-sign/my-sign',
    'pages/already-sign/already-sign',
    'pages/org-info/org-info',
    'pages/create-sign-act/create-sign-act',
    'pages/sign-qrcode/sign-qrcode'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    // navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "permission": {
    "scope.userLocation": {
      "desc": "是否允许?"
    }
  },
}
