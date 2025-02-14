// webpack.config.js
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 빈 JS 파일 제거 (CSS 전용 엔트리에서 생성되는 빈 js 파일을 없애기 위해)
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

// 동적으로 모든 컴포넌트를 찾습니다.
const componentTemplates = glob.sync('./src/components/*/component.hbs');

// 엔트리와 HtmlWebpackPlugin 인스턴스들을 저장할 배열/객체
const entries = {};
const htmlPlugins = [];

// 각 컴포넌트마다 엔트리와 HTML 플러그인을 생성
componentTemplates.forEach((templatePath) => {
  // 예: './src/components/todo/component.hbs'
  // 컴포넌트 이름은 템플릿 파일의 상위 폴더 이름으로 결정합니다.
  const componentName = path.basename(path.dirname(templatePath));

  // 엔트리 키를 생성합니다.
  // - JS 엔트리: todo-js, calendar-js, ...
  // - CSS 엔트리: todo-css, calendar-css, ...
  entries[`${componentName}-js`] = `./src/components/${componentName}/clientlibs/js/main.js`;
  entries[`${componentName}-css`] = `./src/components/${componentName}/clientlibs/css/main.scss`;

  // 각 컴포넌트의 HTML 파일 생성 (출력 경로: dist/components/{componentName}/component.html)
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: `components/${componentName}/component.html`,
      title: `${componentName} Component`,
      // 필요한 경우 해당 컴포넌트의 엔트리 청크만 포함시킵니다.
      chunks: [`${componentName}-js`, `${componentName}-css`],
    })
  );
});

module.exports = {
  mode: 'development', // 배포 시 production
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    // JS 엔트리의 출력 경로를 동적으로 결정합니다.
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
          MiniCssExtractPlugin.loader, // CSS 파일 추출
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
    new RemoveEmptyScriptsPlugin(), // CSS 전용 엔트리에서 빈 JS 파일 제거
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      // CSS 엔트리의 출력 경로를 동적으로 결정합니다.
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
  },
};
