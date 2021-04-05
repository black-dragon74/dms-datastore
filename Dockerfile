FROM node:14

WORKDIR /usr/src/app

# Install chromium
RUN apt-get -y update && apt-get install -y zip unzip libnss3
RUN wget "https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-57/stable-headless-chromium-amazonlinux-2.zip"
RUN unzip stable-headless-chromium*
RUN mv headless-chromium /usr/bin/
RUN rm -rf stable-headless-chromium*

# Copy package
COPY package.json .

# Run install
RUN yarn install

# Copy everything else
COPY . .

# Run build
RUN yarn run build

# Strip dev deps
RUN yarn install --production

# Off we go
CMD ["node", "build/index.js"]
