FROM node:18-alpine
WORKDIR /app
# Install Git for packages installed from Git.
RUN apk update && apk add --no-cache git

COPY package*.json ./
COPY ../../package.json ../../package-lock.json ./
COPY ../../packages/infoportal-server/package.json ./packages/infoportal-server/
COPY ../../packages/infoportal-common/package.json ./packages/infoportal-common/

RUN npm install --only=production

COPY ../../packages/infoportal-server ./packages/infoportal-server/
COPY ../../packages/infoportal-common ./packages/infoportal-common/

RUN npm install
RUN npm run --prefix ./packages/infoportal-server build
RUN npm run db-migrate-f
EXPOSE 3000
RUN npm run dev