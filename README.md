# Popup-Remote
A Popup Remote to use in OBS for content creators with moderators. Build on Socket.io Express and React.js. 
Vite is used as a bundler and frontend tooling.


## Example Docker Compose

``` yaml
version: '3'
services:
  mongo:
    image: mongo:4.4.6
    environment:
      - MONGO_INITDB_ROOT_USERNAME=user
      - MONGO_INITDB_ROOT_PASSWORD=pass

    networks:
      - backend
    volumes:
      - popup-remote-data:/data/db
  server:
     image: popup-remote-server:latest
     environment:
      - CONN_STR=mongodb://user:pass@mongo:27017
      - CORS_STR=http://localhost:3000 http://192.168.1.100:3000 http://10.8.0.1:3000
      - SERVERPORT=3005
     depends_on:
      - db
     ports:
      - "3005:3005"
     networks:
      - backend
  lois-remote:
     image: popup-remote:latest
     ports:
      - "3000:3000"
     depends_on:
      - server
     networks:
      - backend
      - frontend
networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge
volumes:
  popup-remote-data:
```
