FROM node:14-alpine

WORKDIR /usr/src/app

# Install chromium
RUN set -x \
  && apk update \
  && apk upgrade \
  # replacing default repositories with edge ones
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  \
  # Add the packages
  && apk add --no-cache dumb-init curl make gcc g++ python3 linux-headers binutils-gold gnupg libstdc++ nss chromium \

  # Do some cleanup
  && apk del --no-cache dumb-init linux-headers make gcc g++ python3 binutils-gold gnupg libstdc++ \
  && rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
  && echo

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

# Remove build-tools (npm and yarn)
RUN apk del --no-cache nodejs-npm yarn

# Off we go
CMD ["node", "build/index.js"]
