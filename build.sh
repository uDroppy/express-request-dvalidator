echo "Destroying older dist files"
rm -rf dist
echo "Creating dist folder"
mkdir dist
echo "compiling..."
./node_modules/.bin/tsc
echo "copying package.json"
cp package.json dist/package.json
echo "copying tsconfig.json"
cp tsconfig.json dist/tsconfig.json
echo "done"%      