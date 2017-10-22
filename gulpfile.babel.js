import gulp from 'gulp';
import gutil from "gulp-util";
import watch from 'gulp-watch';
import path from 'path';
import BrowserSync from 'browser-sync';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';


import rollupConfig from './rollup.config';

const dist = "dist";
const tmp = ".tmp";
const browserSync = BrowserSync.create();

gulp.task("js", () =>
    rollup(Object.assign({}, rollupConfig))
        .pipe(source(path.join('cms', 'index.js')))
        .pipe(gulp.dest(tmp))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream())
);

gulp.task('serve', ['js'], () => {
    browserSync.init({
        server: {
            baseDir: [tmp, './']
        },
        open: false
    });

    watch("cms/**/*.js", () => { gulp.start(["js"]) });
    watch("**/*.html", () => { browserSync.reload() });
});
