<template>
  <el-container class="container-home">
    <el-aside :width="isOpen==true?'200px':'60px'" class="asidebar">
      <div :class="{'smallLogo':!isOpen}" class="logo-home"></div>
      <el-menu
        :collapse="!isOpen"
        :collapse-transition="false"
        :default-active="this.$route.path"
        active-text-color="#ffd04b"
        background-color="#002033"
        class="el-menu-vertical-demo"
        router
        style="border-right:none"
        text-color="#fff"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header-home">
        <i @click="toggleMenu" class="el-icon-s-fold icon"></i>
        <span class="text">江苏传智博客科技教育有限公司</span>
        <el-dropdown @command="handleClick">
          <span class="el-dropdown-link">
            <img :src="photo" alt class="img-icon" />
            <span class="login-name">{{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting" icon="el-icon-setting">个人设置</el-dropdown-item>
            <el-dropdown-item command="logout" icon="el-icon-unlock">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
import event from '@/eventBus.js'
export default {
  data () {
    return {
      isOpen: true,
      name: '',
      photo: ''
    }
  },
  created () {
    const user = local.getUser() || {}
    this.photo = user.photo
    this.name = user.name
    event.$on('sendUserInfo', name => {
      this.name = name
    })
    event.$on('sendUserInfoImg', photo => {
      this.photo = photo
    })
  },
  methods: {
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      local.delUser()
      this.$router.push('/login')
    },
    handleClick (command) {
      this[command]()
    }
  }
}
</script>

<style lang="less" scoped>
.container-home {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .asidebar {
    background: #002033;
    .logo-home {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat
        center/140px auto;
    }
    .smallLogo {
      background-image: url(../../assets/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .header-home {
    border-bottom: 1px solid #ccc;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      margin-left: 8px;
    }
    .el-dropdown {
      float: right;
      .login-name {
        font-size: 16px;
        font-weight: bold;
        vertical-align: middle;
        margin-left: 5px;
      }
      .img-icon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
    }
  }
}
</style>
