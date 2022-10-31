const {src, dest, series, watch, parallel} = require('gulp')
const imagemin = require('gulp-imagemin');
const cssmin = require('gulp-cssmin');
const connect = require('gulp-connect');
const favicons = require('gulp-favicons');


const appPath = {
    css: './app/css/*.css',
    img: [
        './app/images/**/*.jpg',
        './app/images/**/*.png',
        './app/images/**/*.svg',
    ],
    fonts: './app/fonts/**/*.*',
}
const destPath = {
    css: './dist/css/',
    // js: './dist/js/',
    img: './dist/images/',
    fonts: './dist/fonts',
}

function imageMin() {
    return src(appPath.img)
        .pipe(imagemin())
        .pipe(dest(destPath.img))
        .pipe(connect.reload())
}

function copyHtml() {
    return src('./app/*.html')
        .pipe(dest('./dist/'))
        .pipe(connect.reload())
}

function cssMin() {
    return src(appPath.css)
        .pipe(cssmin())
        .pipe(dest(destPath.css))
        .pipe(connect.reload())
}

function server() {
    connect.server({
        name: 'Dev App',
        root: 'dist',
        port: 8080,
        livereload: true
    })
}

function copyFonts() {
    return src(appPath.fonts)
        .pipe(dest(destPath.fonts))
}


function makeFavicon() {
    return src('./app/images/favicon.png')
        .pipe(
            favicons({
                appName: 'Dev App',
                appShortName: 'App',
                appDescription: 'This is my application',
                developerName: 'Hayden Bleasel',
                developerURL: 'http://haydenbleasel.com/',
                background: '#020307',
                path: 'favicons/',
                url: 'http://haydenbleasel.com/',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/?homescreen=1',
                version: 1.0,
                logging: false,
                html: 'index.html',
                pipeHTML: true,
                replace: true,
            })
        )
        .pipe(dest('./dist/favicons/'));
}


function watchCode() {
    watch('app/*.html', copyHtml);
    watch(appPath.css, cssMin);
    watch(appPath.img, {events: 'add'}, imageMin);
}

exports.build = series(makeFavicon, copyHtml, imageMin, copyFonts, cssMin)
exports.default = series(makeFavicon, copyHtml, imageMin, copyFonts, cssMin, parallel(server, watchCode))
