FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
ARG RESEND_API_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY
ARG NEXT_PUBLIC_C15T_URL
ENV NEXT_PUBLIC_C15T_URL=$NEXT_PUBLIC_C15T_URL
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]