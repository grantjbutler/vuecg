let _Vue

/**
 * @param {Array|Object}
 * @return {Object}
 */
function normalizeMap (map) {
    return Array.isArray(map)
        ? map.map(key => ({ key, val: normalizeReplicantConfig(key) }))
        : Object.keys(map).map(key => ({ key, val: normalizeReplicantConfig(map[key]) }))
}

function normalizeReplicantConfig(val) {
    if (typeof val === 'string') {
        return {
            name: val,
            persistent: true,
            defaultValue: undefined
        }
    } else if (typeof val === 'object') {
        return {
            name: val.name,
            persistent: ('persistent' in val) ? val.persistent : true,
            defaultValue: ('defaultValue' in val) ? val.defaultValue : undefined
        }
    } else {
        throw new Error(`Unexpected type ${typeof val} for normalizing replicant config`)
    }
}

/**
 * @param {Array|Object}
 */
function mapReplicants (replicants) {
    return normalizeMap(replicants).reduce((mapping, { key, val }) => {
        mapping[key] = new VueReplicant(val)
        return mapping
    }, {})
}

class VueReplicant {
    constructor({ name, persistent, defaultValue }) {
        _Vue.util.defineReactive(this, 'value')

        this.value = defaultValue
        
        this._replicant = nodecg.Replicant(name, { persistent, defaultValue })
        this._replicant.on('change', (newValue) => {
            if (newValue != undefined) {
                this.value = JSON.parse(JSON.stringify(newValue))
            }
            else {
                this.value = undefined
            }
        })
    }
}

/**
 * @param {Object}
 * @param {Object}
 * @return {Object}
 */
function extendComputed (to, from) {
    let extended = {}
    for (const key in to) {
        extended[key] = to[key]
    }
    
    for (const key in from) {
        if (key in extended) {
            _Vue.util.warn(`A value for ${key} is already defined in the destination object`, to)
        }

        extended[key] = from[key]
    }
    return extended
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
