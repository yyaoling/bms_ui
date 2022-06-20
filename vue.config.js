module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: { '^/api':'' },
        ws: true,
        changeOrigin: true,
      },
    }
  },
  pages: {
    index: {
      entry: 'src/pages/user/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    admin: {
      entry: 'src/pages/admin/main.js',
      template: 'public/admin.html',
      filename: 'admin.html',
    }
  }
}
