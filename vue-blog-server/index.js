const Koa       = require('koa')
const logger    = require('koa-logger')
const cors      = require('koa2-cors')
const static    = require('koa-static')

const router    = require("./router")
const app       = new Koa()

// app.use(cors({
//   origin: function (ctx) {
//     return 'http://localhost:8080';
//   },
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }))

app.use(cors())
app.use(logger())

app.use(static('./dist'))

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, 'localhost', () => {
    console.log("server listening")
})
