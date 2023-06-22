// vue.config.js

module.exports = {
  transpileDependencies: [
    'vuetify',
    'chart.js' // Agrega 'chart.js' como una dependencia a transpilar
  ],
  
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }
};
