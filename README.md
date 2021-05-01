# VueCG

vuecg is an npm package that provides bindings in vue.js for nodecg's replicants.

It automatically listens to replicants you define in the `replicants` property on your component, and exposes the values to you as computed properties.

## Example

```js
<template>
  <div>Count: {{ count }}</div>
</template>

<script>
export default {
    replicants: [
        'count'
    ]
}
```

## Use

For the most basic case, you can specify your replicants as an array of replicant names for the `replicant` key in your component, as shown in the example above. However, there may be some cases where the name of your replicant cannot work as a JavaScript identifier (for example, if you name space your replicants in a bundle in a format such as `namespace:replicant-name`. In cases like this, can you specify your replicants as an object, where the key is the name of the computed property generated for the replicant and the key is the name of the replicant.

```js
<template>
  <div>Is Playing: {{ isPlaying }}</div>
</template>

<script>
export default {
    replicants: {
        isPlaying: 'my-bundle:isPlaying'
    }
}
```

Replicants won't have a value by the time Vue will do an initial rendering pass of your compontent. As a result, you'll need to handle a `null` value you for your replicant by using something like `v-if` to hide content until the replicant has a value. You can alternatively specify a default value for your replicant that will be used until a value for your replicant has been loaded.

```js
<template>
  <div>
    <div v-for="item in todos" :key="item">
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
    replicants: {
        todos: {
            name: 'todo-list',
            defaultValue: []
        }
    }
}
```

If you want a non-persistent replicant, you can specify that in the configuration object for the replicant. If you don't specify a value, then the replicant will be persistent.

```js
<template>
  <div>Is Playing: {{ isPlaying }}</div>
</template>

<script>
export default {
    replicants: {
        isPlaying: {
            name: 'my-bundle:isPlaying',
            persistent: false
        }
    }
}
```
