<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <el-table :data="rescomment" style="width: 100%">
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="120">
            <el-button
              @click="toggleStatus(scope.row)"
              size="small"
              type="success"
              v-if="!scope.row.comment_status"
            >打开评论</el-button>
            <el-button @click="toggleStatus(scope.row)" size="small" type="danger" v-else>关闭评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求参数
      reqparams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      },
      // 返回的数据
      rescomment: []
      // 评论状态
      // comment_status: false,
      // 总评论数
      // total_comment_count: 1,
      // 粉丝评论数
      // fans_comment_count: 1
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    // 获取评论列表数据
    async getInfo () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqparams })
      this.rescomment = data.results
    },
    // 关闭评论
    toggleStatus (row) {
      const text = row.comment_status ? '关闭' : '打开'
      this.$confirm(`${text}评论, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${row.id}`, {
            allow_comment: !row.comment_status
          })
          this.$message.success(
            data.allow_comment ? '关闭评论成功' : '打开评论成功'
          )
          row.comment_status = data.allow_comment
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
