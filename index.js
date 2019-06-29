let _Vue

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
        _Vue.util.defineReactive(this, 'value')
        
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
            _Vue.util.warn(`A value for ${key} is already defined in the destination object`, to)
        }

        to[key] = from[key]
    }
    return to
}

export default {
    install (Vue) {
        _Vue = Vue
        
        Vue.mixin({
            beforeCreate () {
                if ('replicants' in this.constructor.options) {
                    this.$replicants = mapReplicants(this.constructor.options.replicants)
                    
                    let replicantGetters = Object.keys(this.$replicants).reduce((replicants, key) => {
                        replicants[key] = () => { return this.$replicants[key].value }
                        return replicants
                    }, {})
                    
                    this.$options.computed = extendComputed(this.$options.computed || {}, replicantGetters)
                }
            }
        })
    }
}