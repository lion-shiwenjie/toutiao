<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <el-row>
        <!-- 左区域 -->
        <el-col :span="12">
          <el-form :model="form" label-width="120px" ref="form">
            <el-form-item label="编号:">{{form.id}}</el-form-item>
            <el-form-item label="手机:">{{form.mobile}}</el-form-item>
            <el-form-item label="媒体名称:">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:">
              <el-input rows="3" type="textarea" v-model="form.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="editUserInfo" type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右区域 -->
        <el-col :span="12">
          <!-- 上传组件 -->

          <el-upload
            :headers="headers"
            :http-request="updateimg"
            :show-file-list="false"
            action
            class="avatar-uploader"
            name="image"
          >
            <img :src="uploadImgUrl" class="avatar" v-if="uploadImgUrl" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
import event from '@/eventBus.js'
export default {
  data () {
    return {
      form: {
        name: null,
        intro: null,
        email: null
      },
      // 配置上传文件的请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 上传成功后预览图片地址
      uploadImgUrl: null
    }
  },
  methods: {
    async getUser () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.form = data

      this.uploadImgUrl = data.photo
    },
    async editUserInfo () {
      const {
        data: { data }
      } = await this.$http.patch('user/profile', {
        name: this.form.name,
        intro: this.form.intro,
        email: this.form.email
      })
      // 设置home
      event.$emit('sendUserInfo', data.name)
      // 设置session
      const user = local.getUser()
      user.name = data.name
      local.setUser(user)
    },
    // 覆盖默认的上传行为，自定义上传的实现
    async updateimg (result) {
      const file = result.file
      const formData = new FormData()
      formData.append('photo', file)
      const {
        data: { data }
      } = await this.$http.patch('user/photo', formData)
      // console.log(data)
      this.uploadImgUrl = data.photo
      // console.log(this.uploadImgUrl)
      // 设置home
      event.$emit('sendUserInfoImg', data.photo)
      // 设置session
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style lang="scss" scoped>
</style>
