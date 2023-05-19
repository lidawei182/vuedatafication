
//const formal = 'http://www.mmcall.test.net/index.php';

const formal = 'http://www.mmcall.net:7002/index.php';

export default {
  // 应用appid
  appid: 123456, //ty9fd2848a039ab554

  // 应用秘钥
  appSecret: 123456,//ec32286d0718118861afdbf6e401ee81

  // 配置显示在浏览器标签的title
  title: 'datafication',

  // token在Cookie中存储的天数，默认1天
  cookieExpires: 1,

  // api请求基础路径,注意和代理配合使用
  baseUrl: {
    dev: formal,
    pro: formal
  },

  // 上传路径
  uploadUrl: {
    img: formal+'/admin/upload/upimage',
    video: '',
    file: ''
  },

  // 上传路径
  uploadWangeditorUrl: {
    img: formal+'/admin/upload/upimageWangeditor',
    video: '',
    file: 'file'
  }

}
