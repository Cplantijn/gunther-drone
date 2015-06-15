var gulp = require('gulp');
var gls = require('gulp-live-server');
var server = gls.new('drone.js');

//plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

//lint
gulp.task('lint', function(){
    return gulp.src('*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//sass compile
gulp.task('sass', function(){
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});

//watch
gulp.task('watch', function(){
    gulp.watch(['*.js','**/**/*.js', '**/**/*.jsx'], ['lint', 'run']);
    gulp.watch('sass/*.scss', ['sass', 'run']);
});

//run
gulp.task('run', function(){
    server.start();
});

gulp.task('default', ['lint', 'sass', 'watch', 'run']);