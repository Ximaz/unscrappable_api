process.env.HOSTNAME = "localhost"
process.env.PORT = 8080

const express = require("express"),
      app = express(),
      { HOSTNAME, PORT } = process.env,
      router = {
          api: require("./routes/api.js")
      }

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/api/", router.api)

app.listen(PORT, HOSTNAME, () => {
    console.log(`API Started at http://${HOSTNAME}:${PORT}/`)
})
