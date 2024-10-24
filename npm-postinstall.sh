#!/bin/sh

# Copy all node_modules css and scss files to _sass/node_modules so we can import and build them with Jekyll
cd node_modules || exit
cp --parents -Rf "$(find . -name '*.scss')" ../_sass/node_modules
cp --parents -Rf "$(find . -name '*.css' ! -path "*/dist/*|*/bundle/*")" ../_sass/node_modules

# Rename all css files to scss, so we can import them in other scss files and they get bundled propery
cd ../_sass/node_modules || exit
find . -name '*.css' -exec sh -c 'mv "$0" "${0%.css}.scss"' {} \;
