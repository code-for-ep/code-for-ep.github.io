'use strict';

var g = require('gulp');
var u = require('gulp-util');
var exec = require('child_process').exec;
var bs = require('browser-sync');
var sass = require('gulp-sass');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
  browserReload: '<span style="color: green">Reloaded!</span>'
};

g.task('default', function(){
  console.log('default');
});

// html - jekyll build
g.task('jekyll-build', function(cb){
  exec('bundle exec jekyll build -q -D -I', function(err){
    if (err) return cb(err); cb();
  });
});

// browsersync - live reload
g.task('browser-sync', ['jekyll-build'], function(){
  bs({ server: { baseDir: "_site" } });
});

g.task('browser-reload', ['jekyll-build', 'sass'], function () {
  bs.reload();
  bs.notify(messages.browserReload);
});

// css - sass, minify, sourcemap
g.task('sass', function(){
  return g.src('_src/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(g.dest('_site/assets'))
    .pipe(bs.reload({stream:true}))
    .pipe(g.dest('assets'));
});

// js - minify, sourcemap

// images - minify

// watch
g.task('watch', function(){
  // html
  g.watch(['*.html', '*.md', '_draft/*.*', '_includes/*.*', '_layouts/*.*', '_posts/*.*', '_config*'], ['browser-reload']);
  g.watch(['_src/main.sass', '_sass/*.*'], ['sass', 'browser-reload']);
});

g.task('default', ['browser-sync', 'watch']);



