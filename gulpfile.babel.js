'use strict';

// import runSequence    from 'run-sequence';
import webpack        from 'webpack';
import webpackConfig  from './webpack.config';
import server         from './server';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

gulp.task('server', () => {
  const port  = process.env.PORT || 8080;
  server.listen(port);
  console.log('listening on http://localhost:' + port);
});

gulp.task('webpack:dev', () =>
  gulp.src('src/scripts/index.jsx')
    .pipe($.webpack(Object.assign(webpackConfig, {
      watch: true,
      devtool: 'inline-sourcemap',
      debug: true
    })))
    .pipe(gulp.dest('dist/assets'))
);

gulp.task('webpack:build', () =>
  gulp.src('src/scripts/index.jsx')
    .pipe($.webpack(Object.assign(webpackConfig, {
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        })
      ]
    })))
    .pipe(gulp.dest('dist/assets'))
);

gulp.task('styles:dev', () =>
  gulp.src('src/styles/index.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('dist/assets'))
);

gulp.task('styles:build', () =>
  gulp.src('src/styles/index.scss')
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('dist/assets'))
    .pipe($.size({ title: 'styles' }))
);

gulp.task('images', () =>
  gulp.src('src/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size({ title: 'images' }))
);

gulp.task('copy', () =>
  gulp.src(['src/index.html', 'src/.htaccesse'])
    .pipe(gulp.dest('dist'))
    .pipe($.size({ title: 'copy' }))
);

gulp.task('rsync', $.shell.task([
  'rsync -avz --delete -e ssh dist/* yhey:/home/yhey/www/record'
]));

gulp.task('watch', ['styles:dev', 'images', 'copy'], () => {
  gulp.watch(['src/styles/**/*.scss'], ['styles:dev']);
  gulp.watch(['src/images/**/*'], ['images']);
  gulp.watch(['src/index.html', 'src/.htaccesse'], ['copy']);
});

gulp.task('default', ['server', 'webpack:dev', 'watch']);

gulp.task('build', ['webpack:build', 'styles:build', 'images', 'copy']);

gulp.task('deploy', ['rsync']);
