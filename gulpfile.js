var gulp = require('gulp');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');

var paths = {
	'style': {
		all: './public/stylesheets/**/*.scss',
		output: './public/stylesheets/',
	},
	'script': {
		all: './public/javascripts/src/**/*.js',
		output: './public/javascripts/',
	},
};

gulp.task('watch:sass', function () {
	gulp.watch(paths.style.all, ['sass'])
	.on('error', onError);
});

gulp.task('watch:js', function() {
	gulp.watch(paths.script.all, ['script'])
	.on('error', onError);
});

gulp.task('sass', function() {
	gulp.src(paths.style.all)
		.pipe(sass().on('error', onError))
		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest(paths.style.output));
});

gulp.task('script', function() {
	return gulp.src(paths.script.all)
		.pipe(concat('bundle.js'))
		.pipe(babel({
			'presets': ['es2015']
		})).on('error', onError)
		// .pipe(uglify()) //add this back in for production
		.pipe(gulp.dest(paths.script.output));
});

gulp.task('watch', [
  'watch:sass',
  'watch:js',
]);

gulp.task('default', ['watch']);

function onError(err) {
	console.log(err);
	this.emit('end');
}
