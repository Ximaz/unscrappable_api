const express = require('express'),
      api = require("../api"),
      { nsHashObj, nsDecode } = require("../src/ns.js"),
      route = express.Router(),
      nsConfig = require("../nsConfig.json")

route.get('/endpoints/', async (req, res, next) => {
    return res.json(Object.keys(nsHashObj(api, null, nsConfig)))
})

route.get('/users/', async (req, res, next) => {
    const { h, u, n } = req.query

    if (!h || !u || !n)
        return res.json({ status: 0, error: "missing queries" })

    const now = new Date().getTime(),
          hashTime = nsDecode(parseFloat(n), nsConfig)

    // hashTime can't be higher than now, someone tries
    // to guess a prossible value.
    if (hashTime >= now)
        return res.json({ status: 0, error: "invalid queries" })

    // Hash the API the same way it was when endpoints
    // got hashed for the /entpoints/ request.
    const hashedAPI = nsHashObj(api, hashTime, nsConfig)

    // Here, a good `h` value could be getUser.
    // Request : GET /users/?h=<hashed_getUser>&u=Bob&n=<hashed_timestamp>
    if (!Object.keys(hashedAPI).includes(h))
        return res.json({ status: 0, error: `unknowned endpoint : ${h}` })
    
    // Here you're free to check add extra checks for
    // your required query fields, `u` in this example.
    //
    // ...

    try {
        return res.json({ status: 200, content: hashedAPI[h](u) })
    } catch (e) {
        return res.json({ status: 0, error: e.toString() })
    }
})

module.exports = route
