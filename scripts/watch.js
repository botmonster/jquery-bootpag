'use strict';
var bs = require('browser-sync').create();
var execSync = require('child_process').execSync;
var fs = require('fs');

// Initial build
console.log('Building...');
execSync('npm run build', { stdio: 'inherit' });

// Start browser-sync: serve examples/, watch index.html directly
bs.init({
    server: '.',
    startPath: 'examples/index.html',
    files: ['examples/index.html'],
    open: true,
    notify: false
});

// Watch src file: rebuild then reload
var debounce;
fs.watch('src/jquery.bootpag.js', function () {
    clearTimeout(debounce);
    debounce = setTimeout(function () {
        console.log('Source changed, rebuilding...');
        try {
            execSync('npm run build', { stdio: 'inherit' });
            bs.reload('dist/jquery.bootpag.min.js');
        } catch (e) {
            // build error already printed by execSync stdio:inherit
        }
    }, 100);
});
