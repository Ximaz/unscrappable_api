# Unscrappable API
The method is simple. The API server serves a route called `endpoints` like so : `/api/endpoints/`. Consider an Object containing methods to db fetch, or whatever function like so :

```js
const api = {
      getUser: (u) => { ... },
      deleteUser: (u) => { ... },
}
```

Each key of the API route is representing a query field from a future API request like so : `/api/users/?h=getUser&u=Bob`.

The `endpoints` route is going to render keys of this API but will apply a hash function to it :

```js
const hashedAPI = {
      "1_188293": (u) => { ... },
      "2_99388425": (u) => { ... },
      "22183775322952.22": 22183775322952.22
}
```

The hash function will add an extra field at the end which represents an encoded key. The encoded key contains a timestamp at which endpoints got sent. This way, each future request is tracable. And obviously, if the timestamp is incorrect or higher than the time a new reqeust is made, it's an invalid timestamp and we can return an error.

The `endpoints` route then returns the list of keys of the hashed API : ["1_188293", "2_993884", "22183775322952.22"]

But how to do requests if the keys are hashed ? You have to provide the hashed key with it's timestamp creation, followed by your query fields : `/api/users/?h=1_188293&u=Bob&n=22183775322952.22` (equivalent to the example query above.)

