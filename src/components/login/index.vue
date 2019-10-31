<template>
  <div class="container">
    <el-card>
      <img src="../../assets/logo_index.png" alt class="login-name01" />
      <el-form ref="form" status-icon :model="form" :rules="Formrules">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="form.code" placeholder="请输入验证码" style="width:240px;margin-right:8px"></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="checksend">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local.js'
export default {
  data () {
    const checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不对'))
      }
    }
    return {
      form: {
        mobile: '18888888888',
        code: '246810'
      },
      Formrules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码是六位的', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checksend () {
      this.$refs['form'].validate(async valid => {
        // if (valid) {
        //   this.$http
        //     .post('authorizations', this.form)
        //     .then(res => {
        //       local.setUser(res.data.data)

        //       this.$router.push('/')
        //     })
        //     .catch(() => {
        //       this.$message.error('账号或者密码错误')
        //     })
        // }
        if (valid) {
          try {
            const { data: { data } } = await this.$http.post('authorizations', this.form)
            local.setUser(data)
            this.$router.push('/')
          } catch (e) {
            this.$message.error('账号或者密码错误')
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.container {
  width: 100%;
  height: 100%;
  background: url(../../assets/login_bg.jpg) no-repeat center / cover;
  position: absolute;
  top: 0;
  left: 0;
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login-name01 {
      width: 200px;
      display: block;
      margin: 0 auto 30px;
    }
  }
}
</style>
