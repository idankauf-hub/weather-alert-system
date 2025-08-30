FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
# Pin host + port so it’s reachable from your Mac:
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
