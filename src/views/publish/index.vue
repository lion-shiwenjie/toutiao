<template>
  <el-card>
    <div slot="header">
      <my-bread>{{$route.query.id?'修改文章':'发布文章'}}</my-bread>
    </div>
    <el-form :model="form" label-width="120px" ref="form">
      <el-form-item label="标题:">
        <el-input style="width:400px" v-model="form.title"></el-input>
      </el-form-item>
      <!-- 富文本 -->
      <el-form-item label="内容:">
        <quill-editor :options="editorOption" v-model="form.content"></quill-editor>
      </el-form-item>
      <el-form-item label="封面:">
        <el-radio-group @change="form.cover.images=[]" v-model="form.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <!-- 封面图组件 -->
        <div v-if="form.cover.type===1">
          <my-coverimg v-model="form.cover.images[0]"></my-coverimg>
        </div>
        <div v-if="form.cover.type===3">
          <my-coverimg :key="index" v-for="index in 3" v-model="form.cover.images[index-1]"></my-coverimg>
        </div>
        <!-- todo -->
      </el-form-item>
      <el-form-item label="频道:">
        <mychannel v-model="form.channel_id"></mychannel>
      </el-form-item>
      <el-form-item v-if="$route.query.id">
        <el-button @click="updata(false)" type="primary">修改</el-button>
        <el-button @click="updata(true)">存入草稿</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button @click="creat(false)" type="primary">发表</el-button>
        <el-button @click="creat(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 导入富文本样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入富文本组件
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      form: {
        title: null,
        cover: {
          type: 1,
          images: []
        },
        content: null,
        channel_id: null
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  watch: {
    '$route.query.id': function (newValue, oldValue) {
      if (newValue) {
        this.getArticle(newValue)
      } else {
        this.form = {
          title: null,
          cover: {
            type: 1,
            images: []
          },
          content: null,
          channel_id: null
        }
      }
    }
  },
  created () {
    const articleId = this.$route.query.id
    // console.log(articleId)
    if (articleId) {
      this.getArticle(articleId)
    }
  },
  methods: {
    // 新建
    async creat (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.form)
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    // 编辑获取文章
    async getArticle (articleId) {
      const {
        data: { data }
      } = await this.$http.get(`articles/${articleId}`)
      this.form = data
    },
    // 编辑完提交文章
    async updata (draft) {
      await this.$http.put(`articles/${this.form.id}?draft=${draft}`, this.form)
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    }
  }
}
// 封装 封面组件
</script>

<style scoped lang="less">
</style>
