# 迁移数据库
```bash
mongorestore -h localhost -d vote ./migrate/vote
```

# 安装依赖
```bash
npm i
```

# 启动
## parse-server
```bash
tsx --watch ./index.ts
```
## parse-dashboard
```bash
parse-dashboard --config ./parse-dashboard-config.json
```

# API doc
[api-doc.jsonc](https://github.com/zukhok/vote/blob/main/api-doc.jsonc)

# prefix
http://localhost:1024/functions/

# [parse-dashboard](http://localhost:4040)
开启投票：[opening](http://localhost:4040/apps/vote/config)