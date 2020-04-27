/* 
  照片墙
*/

import React from 'react'
import PropTypes from 'prop-types'

import { Upload, Icon, Modal , message } from 'antd';
import {reqDeletePic} from '../../api/index.js'
import {BASE_PIC_URL} from '../../utils/constants.js'

const BASE = '/api'
//base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  //用constructor来初始化状态，因为这里可以进行数据的处理，而state只是一个对象
  constructor(props) {
    super(props)
    /*
     在 constructor() 函数中不要调用 setState() 方法。
     如果你的组件需要使用内部 state，请直接在构造函数中为 this.state 赋值初始 state：
     */
    // 初始化照片墙状态：在修改时，可能原本product就有照片，所以传过来放入filelist中直接展示
    const imgs = this.props.imgs || []
    const fileList = imgs.map((img, index) => ({
      uid: -index,  //每个file都有一个唯一id，建议为负数
      name: img,    //图片名
      status: 'done',//状态，上传完成
      url: BASE_PIC_URL + img   //图片地址
    }))
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }

  //大图Modal（对话框）关闭时隐藏
  handleCancel = () => this.setState({previewVisible: false});

  //大图Modal（对话框）显示
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      // 如果没有url，那就使用base64
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  //图片状态发生变化的回调
  /*file为当前操作的文件对象，filelist为当前的文件列表*/
  handleChange = async ({ file ,fileList }) => {
    console.log('handleChange', fileList, file);
    if (file.status === "done") {
      const result = file.response
      if (result.status === 0) {
        message.success('上传成功了')
        //重新指定file是因为file和fileList的最后一个数据虽然相同，但是并非指定同一个对象，并不相等
        file = fileList[fileList.length - 1]
        //对fileList中的系统内定的name和url重新设定
        const {name, url} = result.data
        file.name = name  //将文件名设为我们设定的文件名（在response.data中）
        file.url = url
      } else {
        message.error('上传失败了')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeletePic(file.name)
      if (result.status === 0) {
        message.success("删除图片成功")
      } else {
        message.error('删除图片失败')
      }
    }

    // 在改变（上传、删除）中更新filelist状态
    this.setState({fileList})
  };

  //定义一个方法获取当前图片，得到所有图片名字数组，传给父组件
  getPictures = () => {
    return this.state.fileList.map(file => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>

        <div>Upload</div>
      </div>
    )
    return (
      <div>
        <Upload
          accept="image/*" //接受的文件类型
          action={BASE +"/manage/img/upload"} //上传图片的地址
          name='image' //发送给后台的参数名，默认是file，所以必须指定，不指定后台无法得到数据
          listType="picture-card"   //图片样式：卡片样式
          fileList={fileList}   //已上传文件列表
          onPreview={this.handlePreview}    //显示指定图的大图
          onChange={this.handleChange}    //当filelist改变时调用
          >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}
