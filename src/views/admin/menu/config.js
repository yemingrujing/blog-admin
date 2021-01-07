export const types = ['目录', '菜单', '按钮'];

export function getSvg() {
  const files = require.context('../../../icons/svg', false, /.(svg)$/);
  for (let i = 0; i < files.keys().length; i++) {
    this.svg.push(files.keys()[i].match(/\.\/(\S*)\.svg/)[1]);
  }
}
