/**
 * @param {Array|Object}
 * @return {Object}
 */
function normalizeMap (map) {
    return Array.isArray(map)
        ? map.map(key => ({ key, val: key }))
        : Object.keys(map).map(key => ({ key, val: map[key] }))
}

/**
 * @param {Array|Object}
 */
function mapReplicants (replicants) {
    return normalizeMap(replicants).reduce((mapping, { key, val }) => {
        mapping[val] = new VueReplicant(key)
        return mapping
    }, {})
}

class VueReplicant {
    constructor(name) {
        Vue.util.defineReactive(this, 'value')
        
        this._replicant = nodecg.Replicant(name)
        this._replicant.on('change', (newValue) => { this.value = newValue })
    }
}

/**
 * @param {Object}
 * @param {Object}
 * @return {Object}
 */
function extendComputed (to, from) {
    for (const key in from) {
        if (key in to) {
            Vue.util.warn(`A value for ${key} is already defined in the destination object`, to)
        }

        to[key] = from[key]
    }
    return to
}

export default {
    install (Vue) {
        Vue.mixin({
            beforeCreate () {
                if ('replicants' in this) {
                    this.$replicants = mapReplicants(this.replicants)
                    this.$options.computed = extendComputed(this.$options.computed || {}, Object.keys(this.$replicants).map((replicant) => { return () => { return replicant.value }}))
                }
            }
        })
    }
}