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

function nsHashObj(o, n, nsConfig) {
    const _o = {},
          ns = nsEncode(n || new Date().getTime(), nsConfig)
    let i = 0;

    for (const [k, v] of Object.entries(o))
        _o[`${i++}_${nsHashString(k.toString(), ns)}`] = v
    _o[ns] = nsHashString(ns.toString(), ns)
    return _o
}

module.exports = {
    nsEncode,
    nsDecode,
    nsHashString,
    nsHashObj
}
