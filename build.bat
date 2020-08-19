@ECHO OFF
:: Using closure compiler (https://github.com/google/closure-compiler)
npx google-closure-compiler --js=lib/jquery.bootpag.js --js_output_file=lib/jquery.bootpag.min.js
