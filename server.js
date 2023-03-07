const express = require("express"),
      app = express(),
      router = {
          api: require("./routes/api.js")
      },
      config = {
          hostname: "localhost",
          port: 8080
      }

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/api/", router.api)

app.listen(config.port, config.hostname, () => {
    console.log(`API Started at http://${config.hostname}:${config.port}/`)
})
