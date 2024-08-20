# 切换到nginx镜像
FROM nginx:alpine

# 复制生成的前端项目文件到nginx的默认html目录
ADD ./dist /usr/share/nginx/html

# 复制nginx配置文件到容器中
ADD ./nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /etc/nginx/conf.d/default.conf # 删掉默认的

# 暴露nginx默认端口
EXPOSE 80

# 启动nginx
CMD ["nginx","-g","daemon off;"]
