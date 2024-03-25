const http = require("http")
const port= 4000
const server = http.createServer((req,res)=>{
    res.statusCode = 200
    res.end("End")
})

server.listen(port,()=>{
    console.log("Server is running")
})