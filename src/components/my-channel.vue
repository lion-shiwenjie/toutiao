<template>
  <el-select :value="value" @change="getChannelid" placeholder="请选择" clearable>
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'mychannel',
  props: ['value'],
  data () {
    return {
      options: []
    }
  },
  methods: {
    async getArticleOptions () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.options = data.channels
    },
    getChannelid (data) {
      if (data === '') {
        data = null
      }
      this.$emit('input', data)
    }
  },
  created () {
    this.getArticleOptions()
  }
}
</script>

<style>
</style>
