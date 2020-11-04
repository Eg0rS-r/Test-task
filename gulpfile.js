const { src, dest, task, series, watch, parallel } = require("gulp");

const rm = require("gulp-rm");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const sassGlob = require('gulp-sass-glob');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
var gulpif = require('gulp-if');

var concat = require('gulp-concat');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify');

const env = process.env.NODE_ENV;

const {SRC_PATH, DIST_PATH} = require('./gulp.config');

sass.compiler = require('node-sass');

task("clean", () => {
  return src(`${DIST_PATH}/**/*`, { read: false })
    .pipe(rm());
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({ stream: true }));
})

task("copy:img", () => {
  return src(`${SRC_PATH}/img/**/*`)
    .pipe(dest(`${DIST_PATH}/img`))
    .pipe(reload({ stream: true }));
})

task("copy:fonts", () => {
  return src(`${SRC_PATH}/fonts/**/*`)
    .pipe(dest(`${DIST_PATH}/fonts`))
    .pipe(reload({ stream: true }));
})

task("styles", () => {
  return src(`${SRC_PATH}/style/main.scss`)
    .pipe(gulpif(env === 'dev',
      sourcemaps.init()
    ))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gcmq())
    // .pipe(px2rem())
    .pipe(gulpif(env === 'prod',
      autoprefixer({
        cascade: false
      })
    ))
    .pipe(gulpif(env === "prod",
      cleanCSS({ compatibility: 'ie8' })
    ))
    .pipe(gulpif(env === "dev",
      sourcemaps.write()
    ))
    .pipe(dest(`${DIST_PATH}/style`))
    .pipe(reload({ stream: true }));
});

task("scripts", () => {
  return src(`${SRC_PATH}/scripts/*.js`)
    .pipe(gulpif(env === 'dev',
      sourcemaps.init()
    ))
    .pipe(concat('main.min.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(env === "prod",
      uglify()
    ))
    .pipe(gulpif(env === "dev",
      sourcemaps.write()
    ))
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({ stream: true }));
})


task("server", () => {
  browserSync.init({
    server: {
      baseDir: `${DIST_PATH}`
    },
    open: false
  })
})


task("watch", () => {
  watch(`${SRC_PATH}/style/**/*`, series("styles"))
  watch(`${SRC_PATH}/*.html`, series("copy:html"))
  watch(`${SRC_PATH}/fonts/**/*`, series("copy:fonts"))
  watch(`${SRC_PATH}/script/*.js`, series("scripts"))
  watch(`${SRC_PATH}/img/**/*`, series("copy:img"))
})

task("default", series(
  "clean",
  parallel("copy:html", "copy:img", "copy:fonts", "scripts", "styles"),
  parallel("server", "watch")
))