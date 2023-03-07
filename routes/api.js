const express = require('express'),
      route = express.Router(),
      { nsHashObj, nsDecode } = require("../src/noscrap.js"),
      nsConfig = { i: 423, j: 32 }

const apiExample = {
    getUser: (user) => { return { user, found: true } }, // Fake function
    deleteUser: (user) => { return { user, found: false } } // Fake function
}

route.get('/endpoints/', async (req, res, next) => {
    return res.json(Object.keys(nsHashObj(apiExample, null, nsConfig)))
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
    const hashedAPI = nsHashObj(apiExample, hashTime, nsConfig)

    // Here, a good `h` value could be searchUser.
    // Request : GET /users/?h=<hashed_searchUser>&u=Bob&n=<hashed_timestamp>
    if (!Object.keys(hashedAPI).includes(h))
        return res.json({ status: 0, error: `unknowned endpoint : ${h}` })

    try {
        return res.json({ status: 200, content: hashedAPI[h](u) })
    } catch (e) {
        return res.json({ status: 0, error: e.toString() })
    }
})

module.exports = route
