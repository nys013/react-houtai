/* 
  富文本编辑器，用了库https://jpuri.github.io/react-draft-wysiwyg
*/
//以下5个为demo中就引入的 
import React, { Component } from 'react';
import { EditorState, convertToRaw , ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import PropTypes from 'prop-types'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const BASE = '/api'

export default class RichTextEditor extends Component {
  static propTypes ={
    detail:PropTypes.string
  }

  /*state = {
    editorState: EditorState.createEmpty()  //创建没有内容的编辑对象
  }*/

  // 图片上传
  uploadImageCallBack = (file)=> {
    return new Promise(
      (resolve, reject) => {
        // 用原生js写法发送ajax请求 
        const xhr = new XMLHttpRequest();
        // 记得加上基础路径api
        xhr.open('POST', BASE + '/manage/img/upload');
        // 不要设置请求头
        //xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          // 不按网上说的方法也可以的
          // resolve(response);
          // 但是还是按照官方文档说的——应答应返回一个对象。 { data: { link: <THE_URL>}}
          resolve({data:{link:response.data.url}})
          console.log(response)
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    )
  }

  // 根据已有的标签结构生成富文本编辑器内容
  constructor (props){
    super(props)
    const html = this.props.detail
    if(html){
      // 如果html存在，就生成内容
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState
        }
      }
    } else {
      // 如果不存在，就创建一个空的编辑器对象
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }


  }

  /* 父组件获取子组件的数据有两种方式：
    1.父组件定义函数，子组件调用，然后通过函数参数将数据传给父组件
    2.子组件定义函数，函数返回值为数据，父组件通过ref取到该函数调用得到数据
    两个方法不同在于函数调用的时机，即得到数据的时机
    在这里，第一种不适合，因为若是在子组件调用，只能是更改数据就要调用，这样才能是最新数据，但这样多次调用效率低，父组件并不需要实时接收数据
        那么就采用第二种，父组件调用，父组件在提交时调用得到数据，只调用一次，而且得到的也是最新（完整）数据
  */
  // 父组件调用该方法获取编辑器中的html代码
  getEditor = () => {
    // 将编辑器的文字样式什么的，转换为html代码
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  // 输入过程中调用
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorStyle={{border:"1px solid black",minHeight:200,padding:"0 10px"}}
          onEditorStateChange={this.onEditorStateChange}  //当editorState改变触发
          // 工具栏，设置图片上传
          toolbar={{
            image: { 
              uploadCallback: this.uploadImageCallBack, 
              alt: { present: true, mandatory: false },  //设置alt字段，present为是否显示设置，mandatory为是否强制
              previewImage: true,   //设置这个配置就可以在缩略虚线框中看到图片了，而不是url
            }
          }}
          />
      </div>
    );
  }
}