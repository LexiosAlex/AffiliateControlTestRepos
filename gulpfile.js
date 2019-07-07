const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const include = require("posthtml-include");
const posthtml = require("gulp-posthtml");
const jsminify = require('gulp-uglify');
const pump = require('pump');
const htmlmin = require('gulp-htmlmin');
const del = require("del");

gulp.task("css", () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("server", () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/**", gulp.series("compressjs", "refresh"));
});

gulp.task("refresh", (done) => {
  server.reload();
  done();
});

gulp.task("compressjs", function (cb) {
  pump([
      gulp.src("source/js/script.js"),
      jsminify(),
      rename("script.min.js"),
      gulp.dest("build/js/")
    ],
    cb
  );
});

gulp.task("images", () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", () =>  {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img/webp"));
});

gulp.task("html", () =>  {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", () =>  {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "libs/**"
  ], {
    base: "source/",
    cwd: "source/"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", () =>  {
  return del("build");
});

gulp.task("build", gulp.series("clean", "compressjs", "copy", "css", "html"));
gulp.task("start", gulp.series("build", "server"));
