/*
프로젝트의 파일 구조를 기반으로 여러 엔트리 포인트와 HTML 플러그인 인스턴스를 동적으로 생성합니다.
이를 통해 새 컴포넌트를 추가할 때 설정 변경을 최소화하고, 관리 및 유지보수를 쉽게 합니다.
*/

const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// src/components 하위의 모든 component.hbs 파일을 검색합니다.
const componentTemplates = glob.sync('./src/components/*/component.hbs');

const entries = {};
const htmlPlugins = [];

// 각 컴포넌트마다 엔트리와 HtmlWebpackPlugin 인스턴스를 생성합니다.
componentTemplates.forEach((templatePath) => {
  // 예: './src/components/todo/component.hbs'
  // 컴포넌트 이름은 템플릿 파일의 상위 폴더 이름으로 결정합니다.
  const componentName = path.basename(path.dirname(templatePath));

  // 엔트리 생성
  // JS 엔트리: todo-js, calendar-js, ...
  // CSS 엔트리: todo-css, calendar-css, ...
  entries[`${componentName}-js`] = `./src/components/${componentName}/clientlibs/js/main.js`;
  entries[`${componentName}-css`] = `./src/components/${componentName}/clientlibs/css/main.scss`;

  // HtmlWebpackPlugin 인스턴스 생성
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: `components/${componentName}/index.html`,
      title: `${componentName} Component`,
      // 해당 컴포넌트의 엔트리 청크만 포함
      chunks: [`${componentName}-js`, `${componentName}-css`],
    })
  );
});

module.exports = {
  entry: entries,
  htmlPlugins,
};
