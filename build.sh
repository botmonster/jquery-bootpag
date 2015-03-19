#!/bin/bash
# Using closure compiler (https://github.com/google/closure-compiler)
# http://dl.google.com/closure-compiler/compiler-latest.zip
java -jar ../compiler-latest/compiler.jar --js lib/jquery.bootpag.js --js_output_file lib/jquery.bootpag.min.js
