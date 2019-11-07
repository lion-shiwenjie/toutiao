<template>
  <div>
    <el-card>
      <!-- 头 -->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 内容 -->
      <el-form ref="form" :model="form" label-width="80px" size="small ">
        <el-form-item label="状态:">
          <el-radio-group v-model="form.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:">
          <!-- 频道组件 -->
          <mychannel v-model="form.channel_id"></mychannel>
        </el-form-item>
        <el-form-item label="日期:">
          <div class="block">
            <el-date-picker
              v-model="arrayValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 下卡片 -->
    <el-card style="margin-top:40px">
      <div slot="header">根据筛选条件共查询到{{total}}条结果:</div>
      <el-table :data="articles" style="width: 100%">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif" width="150" height="100" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="info" plain v-if="scope.row.status==0" size="small">草稿</el-button>
            <el-button type="primary" plain v-if="scope.row.status==1" size="small">待审核</el-button>
            <el-button type="success" plain v-if="scope.row.status==2" size="small">审核通过</el-button>
            <el-button type="warning" plain v-if="scope.row.status==3" size="small">审核失败</el-button>
            <el-button type="danger" plain v-if="scope.row.status==4" size="small">已删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="toEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delArticle(scope.row.id)"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        style="margin-top:20px"
        :page-size="form.per_page"
        :current-page="form.page"
        @current-change="paper"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求时携带的参数
      form: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页数
        page: 1,
        // 每页数量
        per_page: 10
      },
      // 频道数据后台返回
      options: [],
      // 请求时的 起始时间和结束时间
      arrayValue: [],
      // 文章列表后台返回数据
      articles: [],
      // 总条数
      total: 0
    }
  },
  methods: {
    // 获取频道列表

    // 文章列表
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.form })
      this.articles = data.results
      this.total = data.total_count
    },
    // 分页函数
    paper (newPage) {
      this.form.page = newPage
      this.getArticles()
    },
    // 筛选函数
    search () {
      this.form.page = 1
      if (this.form.channel_id === '') {
        this.form.channel_id = null
      }
      this.getArticles()
    },
    // 日期函数
    changeDate (arrayValue) {
      if (arrayValue) {
        this.form.begin_pubdate = arrayValue[0]
        this.form.end_pubdate = arrayValue[1]
      }
    },
    // 去编辑
    toEdit (id) {
      // this.$router.push(`./publish?id=${id}`)
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除
    delArticle (id) {
      // 提示
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`articles/${id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getArticles()
      })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
      // 发请求
      // 渲染
    }
  },
  created () {
    this.getArticles()
  }
}
</script>

<style>
</style>
