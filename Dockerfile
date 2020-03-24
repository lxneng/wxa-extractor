FROM node as builder
WORKDIR /app
COPY package.json package-lock.json index.js ./
RUN npm install
FROM astefanutti/scratch-node
COPY --from=builder /app /
ENTRYPOINT ["node", "index.js"]
