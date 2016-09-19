var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')
var cache = require('gulp-cache')

gulp.task('img', function() {
  gulp.src('app/public/img/*.{png, jpg}')
    .pipe(cache(imagemin({
      progressive: true,
      //不移除svg的viewbox属性
      svgoPlugins: [{
        removeViewBox: false
      }],
      //使用pngquant深度压缩png图片
      use: [pngquant()]
    }))).pipe(gulp.dest('dist/img'))
})

gulp.task('css', function() {
  return gulp.src('app/public/style/main.scss')
           .pipe($.sourcemaps.init())
           .pipe($.sass().on('error', $.sass.logError))
           .pipe($.autoprefixer({
             browsers: ['last 2 versions'],
             cascade: false
           }))
           .pipe($.sourcemaps.write())
           .pipe(gulp.dest('./dist'));
})

gulp.task('css:watch', ['css:build'], function() {
  gulp.watch('app/public/style/**/*.scss', ['img', 'css']);
});

gulp.task('css:build', ['img', 'css'], function() {
  return gulp.src('./dist/main.css')
             .pipe($.rev())
             .pipe(gulp.dest('./dist'))
             .pipe($.rev.manifest())
             .pipe(gulp.dest('./dist'));
})