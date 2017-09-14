"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("dev/less/style.less")
  .pipe(plumber())
  .pipe(less())
  .pipe(postcss([
    autoprefixer({browsers: [
      "last 2 versions"
    ]})
  ]))
  .pipe(gulp.dest("build/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
  .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("html:copy", function() {
  return gulp.src("dev/*.html")
  .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("dev/less/**/*.less", ["style"]);
  gulp.watch("dev/*.html", ["html:update"]);
  gulp.watch("dev/img/**/*.*", ["copy"]);
})

gulp.task("build", function(fn) {
  run("clean", "copy", "style", "images", fn);
})

gulp.task("copy", function() {
  return gulp.src([
    "dev/img/**/*.*",
    "dev/*.html"
  ], {
    base: "dev"
  })
  .pipe(gulp.dest("build"));
})

gulp.task("clean", function() {
  return del("build");
});

gulp.task("default", function() {
  run("build", "serve");
})