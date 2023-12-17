FROM node:18

WORKDIR /usr/app

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Install deps 
RUN yarn install --production

# Copy source
COPY . .

EXPOSE 4000
# Build dist
RUN yarn build

WORKDIR /usr/app/build

CMD [ "node", "src/index.js" ]