<template>
  <el-card>
    <div slot="header">
      <my-bread>素材管理</my-bread>
    </div>
    <div>
      <!-- 全部与 收藏 -->
      <el-radio-group @change="changeCollect" size="small" v-model="reqParams.collect">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button @click="showAddImage" size="small" style="float:right" type="success">添加素材</el-button>
    </div>
    <!-- 对话框 -->

    <el-dialog :visible.sync="dialogVisible" title="添加素材" width="300px">
      <!-- 上传组件 -->
      <el-upload
        :headers="headers"
        :on-success="onsuccess"
        :show-file-list="false"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        class="avatar-uploader"
        name="image"
      >
        <img :src="imageUrl" class="avatar" v-if="imageUrl" />
        <i class="el-icon-plus avatar-uploader-icon" v-else></i>
      </el-upload>
    </el-dialog>

    <div class="img_list">
      <div :key="item.id" class="img-item" v-for="item in  images">
        <img :src="item.url" />
        <div class="footer" v-show="!reqParams.collect">
          <span
            :class="{red: item.is_collected}"
            @click="tiggleCollect(item)"
            class="el-icon-star-off"
          ></span>
          <span @click="delectImg(item.id)" class="el-icon-delete"></span>
        </div>
      </div>
    </div>
    <el-pagination
      :current-page="reqParams.page"
      :page-size="reqParams.per_page"
      :total="total"
      @current-change="changePage"
      background
      layout="prev, pager, next"
    ></el-pagination>
  </el-card>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        // 单选标签是否为收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      images: [],
      // 总条数
      total: 0,
      // 显示对话框
      dialogVisible: false,
      // 上传成功后预览图片地址
      imageUrl: null,
      // 配置上传文件的请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  methods: {
    // 获取图片列表
    async getIamges () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })

      this.images = data.results
      this.total = data.total_count
    },
    // 改变 页码
    changePage (page) {
      this.reqParams.page = page
      this.getIamges()
    },
    // 切换收藏与全部
    changeCollect () {
      this.reqParams.page = 1
      this.getIamges()
    },
    // 切换收藏与否
    async tiggleCollect (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        // collect: !this.reqParams.collect is_colected是图片是否收藏
        collect: !item.is_collected
      })
      item.is_collected = data.collect
      this.$message.success(data.collect ? '收藏成功' : '取消收藏成功')
    },
    // 删除图片
    delectImg (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(`user/images/${id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getIamges()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示对话框
    showAddImage () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    // 上传成功的取到图片地址
    onsuccess (res) {
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getIamges()
      }, 2000)
    }
  },
  created () {
    this.getIamges()
  }
}
</script>

<style scoped lang="less">
.img_list {
  margin-top: 20px;
  .img-item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 130px;
    margin-bottom: 30px;

    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      text-align: center;
      position: absolute;
      left: 0;
      bottom: 0;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
