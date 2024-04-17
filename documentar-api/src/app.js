import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import config from "./config/config.js"
import passport from "passport";
import session from "express-session"
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import { initializedPassport } from "./config/passport.config.js";
import errorMiddleware from "./middlewares/error/error.middleware.js";
import { middlewareLogger } from "./middlewares/logger/logger.middleware.js";

import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"

import { router as producstRouter } from "./routes/products.router.js"
import { router as cartsRouter } from "./routes/carts.router.js"
import { router as viewsRouter } from "./routes/views.router.js"
import { router as sessionsRouter } from "./routes/sessions.router.js";
import { router as ticketsRouter } from "./routes/tickets.router.js";
import { router as usersRouter } from "./routes/user.router.js"

const { PORT, MongoURL, MongoSecret, MongoTestURL } = config
const app = express()
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API",
      description: "PracticaIntegradora4"
    }
  },
  apis: [`${process.cwd()}/src/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(process.cwd() + "/public"))

app.engine("handlebars", handlebars.engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
}))
app.set("views", process.cwd() + "/src/views")
app.set("view engine", "handlebars")

app.use(errorMiddleware)
app.use(middlewareLogger)

mongoose.connect(MongoTestURL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
    process.exit(1);
  });

app.use(session({
  store: MongoStore.create({
    mongoUrl: MongoTestURL,
  }),
  secret: MongoSecret,
  resave: false,
  saveUninitialized: false
}))

app.use(cookieParser())
initializedPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", producstRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/tickets", ticketsRouter)
app.use("/api/users", usersRouter)
app.use(viewsRouter)

app.get("/", (req, res) => {
  res.send("PracticaIntegradora4")
})
