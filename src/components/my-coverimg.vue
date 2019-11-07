<template>
  <div class="container-coverimg">
    <!-- 图片按钮 -->
    <div @click="open" class="box_img">
      <img :src="value|| defalutImgUrl" alt />
    </div>
    <!-- 对话框组件 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <!-- tabs组件选项卡组件 -->
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="素材库" name="image">
          <!-- 全部与收藏 -->
          <el-radio-group @change="changeCollect" size="small" v-model="reqParams.collect">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片列表的渲染 -->
          <div class="img_list">
            <div
              :class="{checked:item.url===checkedImgUrl}"
              :key="item.id"
              @click="checkImg(item)"
              class="img-item"
              v-for="item in  images"
            >
              <img :src="item.url" />
              <!-- 遮罩层 使用伪元素-->
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            :current-page="reqParams.page"
            :page-size="reqParams.per_page"
            :total="total"
            @current-change="changePage"
            background
            layout="prev, pager, next"
          ></el-pagination>
          <!-- 选中图片 -->
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上传组件 -->
          <el-upload
            :headers="headers"
            :on-success="onsuccess"
            :show-file-list="false"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            class="avatar-uploader"
            name="image"
          >
            <img :src="uploadImgUrl" class="avatar" v-if="uploadImgUrl" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <!-- 对话框下按钮 -->
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="confirmImg" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
import defalutImgUrl from '../assets/default.png'
export default {
  props: ['value'],
  name: 'my-coverimg',
  data () {
    return {
      // 控制对话框显示 和隐藏
      dialogVisible: false,
      // 当前激活选项卡的name的值
      activeName: 'image',
      // 获取图片列表提交的数据
      reqParams: {
        // 单选标签是否为收藏
        collect: false,
        // 当前页
        page: 1,
        // 一页多少数据
        per_page: 8
      },
      // 图片列表数据
      images: [],
      // 总条数
      total: 0,
      // 被选中的图片地址
      checkedImgUrl: null,
      // 配置上传文件的请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 上传成功后预览图片地址
      uploadImgUrl: null,
      // 图片按钮的默认地址
      defalutImgUrl
    }
  },
  methods: {
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.getIamges()
    },
    // 切换收藏与全部
    changeCollect () {
      this.reqParams.page = 1
      this.getIamges()
    },
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
    // 选中图片
    checkImg (item) {
      this.checkedImgUrl = item.url
    },
    // 上传成功的取到图片地址
    onsuccess (res) {
      this.uploadImgUrl = res.data.url
      this.$message.success('上传成功')
    },
    // 确认预览图片
    confirmImg () {
      if (this.activeName === 'image') {
        // 素材图片
        if (!this.checkedImgUrl) {
          return this.$message.warning('请选择一张图片')
        }
        // this.defalutImgUrl = this.checkedImgUrl
        this.$emit('input', this.checkedImgUrl)
        this.dialogVisible = false
      } else {
        // 上传图片
        if (!this.uploadImgUrl) {
          return this.$message.warning('请选择上传一张图片')
        }
        // this.defalutImgUrl = this.uploadImgUrl
        this.$emit('input', this.uploadImgUrl)
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container-coverimg {
  display: inline-block;
  margin-right: 30px;
}
.box_img {
  width: 150px;
  height: 150px;

  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  width: 100%;
  text-align: center;
  display: block;
}
.img_list {
  margin-top: 20px;
  .img-item {
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    &.checked::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url('../assets/selected.png') no-repeat
        center/50px 50px;
    }
  }
}
</style>
