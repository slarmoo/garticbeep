cd frontend
npm run build

cd ../backend
npm run build

cd ..

mkdir build
cp -rf frontend/dist build/public
cp frontend/*.ico build/public
cp frontend/*.png build/public
cp backend/dist/* build
cp backend/src/adminConfig.json build
cp backend/src/dbConfig.json build
cp backend/package.json build
cp origin.json build
rm -rf backend/dist
rm -rf frontend/dist
rm backend/tsconfig.tsbuildinfo