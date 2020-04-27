// 一个简单的UI组件：自定义按钮
// 一般我们需要点击的效果，用a标签，然后禁止其默认跳转行为，但是其实a标签本身会有一些问题，官方文档也不建议这样使用
// 那么我们就用button来替代a，但是button，很丑啊
// 所以就需要对样式进行修改，让它外表是a，功能还是button

import React from 'react'

import './index.less'

export default function LinkButton (props){
  return <button {...props} className='link-button'></button>
}
