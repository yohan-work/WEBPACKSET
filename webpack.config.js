/*
전체 빌드, 모듈 처리, 출력, 플러그인, devServer 설정 등 Webpack의 전반적인 빌드 과정을 관리합니다.
엔트리 관련 설정은 외부에서 불러와서 사용합니다.
*/
// webpack.config.js
const path = require('path');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// entry와 htmlPlugins를 entry-points.js에서 불러옵니다.
const { entry, htmlPlugins } = require('./entry-points');

module.exports = {
  mode: 'development', // 배포 시 production
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    // JS 엔트리의 출력 경로를 동적으로 결정
    filename: (pathData) => {
      const name = pathData.chunk.name;
      if (name.endsWith('-js')) {
        // 예: 'todo-js' → 'components/todo/clientlibs/js/main.js'
        const compName = name.replace('-js', '');
        return `components/${compName}/clientlibs/js/main.js`;
      }
      return '[name].js';
    },
    clean: true,
  },
  module: {
    rules: [
      // Handlebars 템플릿 처리
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      // SCSS 처리
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // CSS를 별도의 파일로 추출
          'css-loader',
          'sass-loader',
        ],
      },
      // JavaScript (Babel) 처리
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(), // CSS 전용 엔트리에서 생성되는 빈 JS 파일 제거
    ...htmlPlugins,                 // entry-points.js에서 생성한 HtmlWebpackPlugin 인스턴스들
    new MiniCssExtractPlugin({
      // CSS 엔트리의 출력 경로를 동적으로 결정
      filename: (pathData) => {
        const name = pathData.chunk.name;
        if (name.endsWith('-css')) {
          // 예: 'todo-css' → 'components/todo/clientlibs/css/main.css'
          const compName = name.replace('-css', '');
          return `components/${compName}/clientlibs/css/main.css`;
        }
        return '[name].css';
      },
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    open: true,
    hot: true,
    watchFiles: ['src/components/**/*'], // 컴포넌트 폴더 내 모든 파일 감시
  },
};
