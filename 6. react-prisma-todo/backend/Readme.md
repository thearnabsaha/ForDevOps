curl -X POST http://localhost:3000/todos \
-H "Content-Type: application/json" \
-d '{"title": "Buy groceries"}'


curl http://localhost:3000/todos


curl -X PUT http://localhost:3000/todos/1 \
-H "Content-Type: application/json" \
-d '{"completed": true}'


curl -X DELETE http://localhost:3000/todos/1

curl -X POST http://54.82.20.126:3000/todos \
-H "Content-Type: application/json" \
-d '{"title": "Buy groceries"}'

curl http://54.82.20.126:3000/todos