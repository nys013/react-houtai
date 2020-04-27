// 入口js，主要进行store的引入，以及渲染至主index.html（其实将app.js的内容直接写在这里也可）
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import App from './app'
//import 'antd/dist/antd.css'
import store from './redux/store.js'

render(
  <Provider store={store} >
    <App/>
  </Provider>
  ,document.getElementById('root')
)