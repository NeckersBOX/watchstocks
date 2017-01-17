'use strict';

const gulp = require ('gulp');
const rename = require ('gulp-rename');
const minify = require ('gulp-minify');
const sass = require ('gulp-sass');
const webpack = require ('webpack');
const webpackStream = require ('webpack-stream');

gulp.task ('sass', () =>
  gulp.src ('src/sass/*.sass').pipe (sass ({
    outputStyle: 'compressed'
  }))
  .pipe(rename('bundle.min.css'))
  .pipe (gulp.dest ('dist/css/'))
);

gulp.task ('webpack', (cb) =>
  gulp.src ('src/app-client.js')
    .pipe (webpackStream ({
      output: {
        filename: 'bundle.min.js'
      },
      module: {
        loaders: [{
          loader: ['babel-loader'],
          query: {
            cacheDirectory: 'babel_cache',
            presets: ['react', 'es2015']
          }
        }]
      },
      plugins: [
        new webpack.DefinePlugin ({
          'process.env': {
            NODE_ENV: process.env.NODE_ENV || '"production"'
          }
        })
      ],
    }))
    .pipe (minify ())
    .pipe (gulp.dest ('dist/js'))
);

gulp.task ('build', [ 'sass', 'webpack' ]);
gulp.task ('watch', () => {
  gulp.watch ('src/sass/*.sass', [ 'sass' ]);
  gulp.watch ('src/**/*.js', [ 'webpack' ]);
});
