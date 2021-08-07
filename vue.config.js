module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // 脚手架3中起别名可以用@代替src
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}

