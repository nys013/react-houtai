import React, {Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import Home from './home.jsx'
import AddUpdate from './add-update.jsx'
import Detail from './detail.jsx'
import './product.less'

export default class Product extends Component {
  render (){
    return(
      <div  >
        <Switch>
          {/* 写在前面，就要写exact，使其精准（完全）配备*/}
          <Route path='/product' component={Home} exact/>
          <Route path='/product/addupdate' component={AddUpdate} />
          <Route path='/product/detail' component={Detail} />
          {/*写在后面，就可以不用exact就可以解决带有/product就只跳转home的问题*/}
          {/* <Route path='/product' component={Home} /> */}
          <Redirect to='/product'/>
        </Switch>
      </div>
    )
  }
}