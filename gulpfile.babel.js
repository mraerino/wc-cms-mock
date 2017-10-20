import gulp from 'gulp';
import gutil from "gulp-util";
import watch from 'gulp-watch';
import path from 'path';
import BrowserSync from 'browser-sync';
import debug from 'gulp-debug';
import rollup from 'rollup-stream';
import glob from 'glob';
import source from 'vinyl-source-stream';
import eventStream from 'event-stream';


import rollupConfig from './rollup.config';

const dist = "dist";
const tmp = ".tmp";
const browserSync = BrowserSync.create();

gulp.task("js", () =>
    eventStream.merge(...glob.sync('cms/*.js', { ignore: 'cms/index.js' })
        .map(file => rollup(Object.assign({}, rollupConfig, {
                input: file
            }))
            .pipe(source(path.join('cms', path.basename(file))))
            .pipe(gulp.dest(tmp))
            .pipe(gulp.dest(dist))
            .pipe(browserSync.stream())
        )
));

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