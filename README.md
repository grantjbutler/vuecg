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
