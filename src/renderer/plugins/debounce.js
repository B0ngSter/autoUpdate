import Vue from 'vue'
import vueDebounce from 'vue-debounce'

Vue.use(vueDebounce, {
  listenTo: ['input', 'keyup'],
  defaultTime: '700ms'
})
