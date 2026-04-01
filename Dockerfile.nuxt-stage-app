FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

WORKDIR /src

RUN npm install -f -g pnpm@9

COPY . .

RUN pnpm install

RUN cd /src && pnpm --filter=@interview/nuxt-app build

EXPOSE 8080

CMD ["node", "/src/apps/nuxt-app/.output/server/index.mjs"]
