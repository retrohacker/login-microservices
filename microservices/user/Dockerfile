FROM nodesource/jessie:0.10

ADD package.json package.json
RUN npm install

ADD . .

CMD ["node","app.js"]
