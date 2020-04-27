import React, {Component} from 'react'
import {Card , Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {
  state = {
    sales:[5, 20, 36, 10, 10, 20],
    stores:[7, 50, 53, 20, 9, 20]
  }
  update = ()=>{
    this.setState(state => ({
      sales:state.sales.map(item => item + 1),
      stores:state.stores.map(item => item - 1)
    }))
  }

  setOption = ()=>{
    return  {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data:['销量','库存']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: this.state.sales
      },
        {
          name: '库存',
          type: 'line',
          data: this.state.stores
        }
      ]
    }
  }

  render (){
    return(
      <div>
        <Card title='柱状图'>
          <Button type='primary' onClick={this.update} >更新</Button>
        </Card>
        <Card title='柱状图'>
          <ReactEcharts option={this.setOption()} />
        </Card>
      </div>
    )
  }
}