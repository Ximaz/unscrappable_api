# Unscrappable API
The method is simple. The API server serves a route called `endpoints` like so : `/api/endpoints/`. Consider an Object containing methods to db fetch, or whatever function like so :

```js
const api = {
      getUser: async (u) => { ... },
      deleteUser: async (u) => { ... },
}
```

Each key of the API route is representing a query field from a future API request like so : `/api/users/?h=getUser&u=Bob`.

The `endpoints` route is going to render keys of this API but will apply a hash function to it :

```js
const hashedAPI = {
      "1_188293": async (u) => { ... },
      "2_99388425": async (u) => { ... },
      "22183775322952.22": 22183775322952.22
}
```

The hash function will add an extra field at the end which represents an encoded key. The encoded key contains a timestamp at which endpoints got sent. This way, each future request is tracable. And obviously, if the timestamp is incorrect or higher than the time a new reqeust is made, it's an invalid timestamp and we can return an error.

The `endpoints` route then returns the list of keys of the hashed API : `["1_188293", "2_993884", "22183775322952.22"]`

But how to do requests if the keys are hashed ? You have to provide the hashed key with it's timestamp creation, followed by your query fields : `/api/users/?h=1_188293&u=Bob&n=22183775322952.22` (equivalent to the example query above.)

Finally, in the server, in your `/api/users/` route, you can imagine the following code :

```js
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
```
# Security

You **HAVE** to modify the `ns` lib default values to yours and keep them secret. To do so, please, edit the `nsConfig.json` file and change `i` and `j` values by your numerical values. `i` accepts an `Int` or a `Float` whereas `j` can only be binded to an `Int` because it's used for bit shifting operations.
