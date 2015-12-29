// 設定ファイル
// 対象パスやオプションを指定

const DIR = module.exports.DIR = {
  PATH: '',
  SRC: 'src',
  DST: 'dst'
};

module.exports.serve = {
  notify: false,
  startPath: `${DIR.PATH}`,
  ghostMode: false,
  server: {
    baseDir: DIR.DEST,
    index: 'index.html',
    routes: {
      [DIR.PATH]: `${DIR.DEST}${DIR.PATH}/`
    }
  }
};

module.exports.sass = {
  src: [`${DIR.SRC}/css/main.css`],
  dst: `${DIR.DST}/css/`
};
