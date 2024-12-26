ARG NODE_VERSION=iron

FROM node:${NODE_VERSION} AS base

USER node

WORKDIR /app

COPY . .

ENV NODE_ENV development

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

FROM base AS dev

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]

FROM base AS build

CMD [ "npm", "run", "build" ]
