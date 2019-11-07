import mybread from '@/components/my-bread.vue'
import mychannel from '@/components/my-channel.vue'
import mycoverimg from '@/components/my-coverimg.vue'

export default {
  install (Vue) {
    Vue.component(mybread.name, mybread)
    Vue.component(mychannel.name, mychannel)
    Vue.component(mycoverimg.name, mycoverimg)
  }
}
