var gulp = require('gulp')
var $ = require('gulp-load-plugins')();

//postcss plugins
var autoprefixer = require('autoprefixer')
var cssnext = require('cssnext')
var precss = require('precss')
var cssnano = require('cssnano')

// Gulp task to process CSS with PostCSS plugins
gulp.task('css', function() {
    var processPlguins = [
        autoprefixer,
        cssnext,
        precss,
        cssnano({
            zindex: false
        })
    ]
    return gulp.src('app/styles/*.css')
        .pipe($.sourcemaps.init())
        .pipe($.postcss(processPlguins))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('./dist'))
})

gulp.task('css:watch', function() {
    gulp.watch('app/styles/**/*.css', ['css'])
})

gulp.task('css:build', ['css'], function() {
    return gulp.src('./dist/main.css')
        .pipe($.rev())
        .pipe(gulp.dest('./dist'))
        .pipe($.rev.mainfest())
        .pipe(gulp.dest('./dist'))
})