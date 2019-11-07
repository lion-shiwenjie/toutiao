<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <div class="fans_list">
            <div :key="item.id.toString()" class="fans_item" v-for="item in res">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button plain size="small" type="primary">+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            :current-page="reqparmas.page"
            :page-size="reqparmas.per_page"
            :total="total"
            @current-change="changepage"
            background
            layout="prev, pager, next"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="pic">
          <div ref="dom" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'list',
      circleUrl: null,
      reqparmas: {
        page: 1,
        per_page: 21
      },
      res: [],
      total: 0
    }
  },
  created () {
    this.getFansList()
  },
  mounted () {
    const dom = this.$refs.dom
    const myEcharts = echarts.init(dom)
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    myEcharts.setOption(option)
  },
  methods: {
    async getFansList () {
      const {
        data: { data }
      } = await this.$http.get('followers', {
        params: this.reqparmas
      })
      console.log(1)
      this.res = data.results
      this.total = data.total_count
    },
    changepage (newPage) {
      this.reqparmas.page = newPage
      this.getFansList()
    }
  }
}
</script>

<style scoped lang="less">
.fans_list {
  .fans_item {
    width: 150px;
    height: 190px;
    padding-top: 20px;
    margin: 0 20px 20px 0;
    border: 1px dashed #ddd;
    text-align: center;
    display: inline-block;
  }
}
</style>
