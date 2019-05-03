// gulp の基本とユーティリティー
const gulp = require("gulp") // 本体
const sourcemaps = require('gulp-sourcemaps') // ソースマップを作成してくれる、initとwriteの差分を読むので言語は問わない
const plumber = require("gulp-plumber") // fileをwatchしているときに文法エラーなどがあると例外で落ちるのでこれでキャッチ
const notify = require("gulp-notify") // ↑キャッチした例外をコンソールとデスクトップへ通知

// pug -> html
const pug = require("gulp-pug") // 本体

// stylus -> css
const stylus = require("gulp-stylus") // 本体
const autoprefixer = require("gulp-autoprefixer") // プレフィックスが必要なものに自動で付与
const cleanCSS = require('gulp-clean-css') // 最適化

// js(ES6) -> js(ES5)
const webpack = require('webpack-stream')

const browserSync = require('browser-sync')


gulp.task('pug', done => {
  gulp.src('./src/pug/**/*.pug')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(pug({
      pretty: true // <- 圧縮オプション
    }))
    .pipe(gulp.dest('./dist/'))
  done()
})

gulp.task('stylus', done => {
  gulp.src('./src/stylus/**/*.styl')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({
      compatibility: 'ie9,-properties.merging'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css/'))
  done()
})

gulp.task('js', done => {
  gulp.src('./src/js/**/*.js')
    .pipe(webpack(
      require('./webpack.config.js')
    ))
    .pipe(gulp.dest('./dist/'))
  done()
})

gulp.task('browserReload', done => {
  browserSync.reload()
  done()
});
gulp.task('server', done => {
  browserSync({
    server: {
      baseDir: './dist/',
      // directory: true //ディレクトリを表示
    },
    open: "external" //LAN内実機テスト用オプション
  })
})

gulp.task('build', gulp.parallel('pug', 'stylus'))


gulp.task('watch', () => {
  gulp.watch('./src/pug/**/*.pug', gulp.task('pug'))
  gulp.watch('./src/stylus/**/*.styl', gulp.task('stylus'))
  gulp.watch('./src/js/**/*.js', gulp.task('js'))
  gulp.watch('./dist/**/*', gulp.task('browserReload'))
})

gulp.task('default',
  gulp.series(
    'build',
    gulp.parallel(
      'server',
      'watch'
    )
  )
)
