const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const PATHS = {
    DEV: 'dev',
    LIB_SRC: 'lib/**/*.ts',
    TEST_SRC: 'test/**/*.ts',
    LIB_DEV: 'dev/lib/**/*.js',
    TEST_DEV: 'dev/test/**/*.js',
    PROJ: ['*.js', '*.json'],
}

const tsProject = ts.createProject('tsconfig.json');

function compileTypeScript(src, dst, errhandler) {
    return gulp.src(src)
        // lint
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }))
        /*.on('error', function (err) {
            errhandler(err)
        })*/
        // prepare sourcemaps
        .pipe(sourcemaps.init())
        // transpile
        .pipe(tsProject())
        // write sourcemaps
        .pipe(sourcemaps.write())
        //.on('error', errhandler)
        .pipe(gulp.dest(dst));
}

gulp.task('build:ts', function () {
    return compileTypeScript(PATHS.LIB_SRC, 'dev/lib/', function (err) {
        //taskFailed('build', EXITCODES.BUILD_FAILED, err);
    });
});

gulp.task('build:browser', () => {
    return browserify({
        entries: 'dev/lib/client.js',
        standalone: 'remo',
        debug: true
    })
        .bundle()
        .pipe(source('remo.js'))
        .pipe(buffer())
        //.pipe(uglify())
        //.pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dev/browser'));
});

gulp.task('build', gulp.series('build:ts', 'build:browser'));