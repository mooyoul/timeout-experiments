FROM node:lts-alpine
MAINTAINER MooYeol Prescott Lee "mooyoul@gmail.com"

RUN mkdir -p /var/task/
WORKDIR /var/task

COPY package.json package-lock.json /var/task/
RUN npm ci --production

COPY entrypoint.sh /var/task
COPY *.js /var/task/

EXPOSE 53/udp
EXPOSE 8001/tcp
EXPOSE 8002/tcp

ENTRYPOINT ["/var/task/entrypoint.sh"]
