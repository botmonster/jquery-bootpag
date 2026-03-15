const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const sourcePath = path.join(__dirname, '..', 'src', 'jquery.bootpag.js');
const readmePath = path.join(__dirname, '..', 'README.md');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const source = fs.readFileSync(sourcePath, 'utf8');
const sourceUpdated = source.replace(/(\* Version:\s+).*/, '$1' + version);

const readme = fs.readFileSync(readmePath, 'utf8');
const readmeUpdated = readme.replace(
    /(### For Bootstrap 4\.x[\s\S]*?)(?=###|$)/,
    function(section) {
        return section
            .replace(/(https:\/\/cdn\.jsdelivr\.net\/npm\/bootpag@)[^/]+(\/dist\/jquery\.bootpag\.min\.js)/g, '$1' + version + '$2')
            .replace(/(https:\/\/unpkg\.com\/bootpag@)[^/]+(\/dist\/jquery\.bootpag\.min\.js)/g, '$1' + version + '$2');
    }
);

if (source !== sourceUpdated) {
    fs.writeFileSync(sourcePath, sourceUpdated);
}

if (readme !== readmeUpdated) {
    fs.writeFileSync(readmePath, readmeUpdated);
}
