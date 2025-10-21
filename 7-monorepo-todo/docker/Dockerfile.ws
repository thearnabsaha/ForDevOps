FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm
COPY ./package.json ./package.json

COPY . .
RUN pnpm install

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "run","start:ws"]