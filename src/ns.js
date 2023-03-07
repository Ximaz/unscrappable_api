function nsEncode(n, { i, j }) {
    return n / j * (i >> j)
}

function nsDecode(n, { i, j }) {
    return n / (i >> j) * j
}

function nsHashString(s, n) {
    return Math.abs(parseInt(s.split('').reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0) + n
        return a & a
    }, 0))).toString()
}

function nsHashObj(o, n, { i, j }) {
    const _o = {},
          ns = nsEncode(n || new Date().getTime(), { i, j })
    let z = 0;

    // We need `z` so keys are at their place when doing
    // Object.keys(o) on hashed object. Else, keys are
    // sorted by hash which may not be accurate.
    for (const [k, v] of Object.entries(o))
        _o[`${z++}_${nsHashString(k.toString(), ns)}`] = v
    _o[ns] = nsHashString(ns.toString(), ns)
    return _o
}

module.exports = {
    nsEncode,
    nsDecode,
    nsHashString,
    nsHashObj
}
