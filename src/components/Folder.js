import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Button,Form,Table,Tabs,Tab,Container,Row,Col,Alert,Nav,Navbar,Card,Modal,Collapse} from 'react-bootstrap';

class Folder extends Component {
  state = {
    space: null,
    thread: null,
    posts: []
  }

  constructor(props){
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }


  componentDidMount = async ()  => {
    console.log(window.location.href)
    const threadAddress = window.location.href.split("/space").pop();
    console.log(threadAddress)
    const thread = await this.props.space.joinThreadByAddress(threadAddress);
    this.setState({
      space: this.props.space,
      thread: thread
    })
    const posts = await this.state.thread.getPosts();
    console.log(posts)
    this.setState({posts});

     await this.state.thread.onUpdate(async()=> {
       const posts = await this.state.thread.getPosts();
       this.setState({posts});
     });
     this.setState({
       profile: this.props.profile
     });

  };
  addItem = async function(){
    let item
    try {
      item = {
          name: $("#item_name").val(),
          description: $("#item_description").val(),
          content: JSON.parse($("#item_content").html()).content,
          fileType: JSON.parse($("#item_content").html()).fileType
      }
    } catch(err){
      item = {
          name: $("#item_name").val(),
          description: $("#item_description").val(),
          content: null
      }
    }
    await this.state.thread.post(item);
    alert('Item saved');
    return;
  };
  removeItem = async function(postId){
    try{
      await this.state.thread.deletePost(postId);
      alert("removed");
    } catch(err){
      alert(err)
    }

  };

  fileUpload = async function(){
    try{
      ReactDOM.unmountComponentAtNode(document.getElementById('progress_upload'))
      var file = $("#input_file")[0].files[0];

      var fileName = file.name;
      var fileType = file.type;

      $("#item_name").val(fileName);


      const reader  = new FileReader();

      reader.onload = function(e) {

                const base64 = btoa(
                  new Uint8Array(e.target.result)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                const content = "data:"+fileType+";base64,"+base64
                $("#item_content").html(JSON.stringify({
                  fileName: fileName,
                  fileType: fileType,
                  content: content
                }));
                console.log(JSON.stringify({
                  fileName: fileName,
                  fileType: fileType,
                  content: content
                }))
                ReactDOM.render(
                  <div>Complete</div>,
                  document.getElementById('progress_upload')
                )
      };
      //reader.readAsDataURL(file);
      reader.readAsArrayBuffer(file);

    } catch(err){
      console.log(err)
      $("#item_content").html("");
    }
  }
  render(){

    const that = this;
    if(this.state.thread && this.state.posts){
      return(
        <div>
          <Tabs defaultActiveKey="itemsadded" className="nav-fill flex-column flex-md-row">
            <Tab eventKey="itemsadded" title="Items">
              <div>
                <h4>Files added</h4>
                <Row>
                {

                  this.state.posts.map(function(post){
                    const item = post.message;
                    const postId = post.postId;
                    console.log(item)
                    if(!item.content){
                      return(
                        <Col lg={4}>
                          <hr/>
                          <p>Name: {item.name}</p>
                          <p>Description: {item.description}</p>
                          <Button onClick={()=>{ that.removeItem(postId)}} type="primary">Remove Item</Button>
                        </Col>
                      )
                    }

                    return(
                      <Col lg={4}>
                        <hr/>
                        <p>Name: {item.name}</p>
                        <p>Description: {item.description}</p>
                        <embed src={item.content} style={{maxWidth: '200px'}} />

                        <p><a href={item.content} download={item.name}>Download</a></p>
                        <Button onClick={()=>{ that.removeItem(postId)}} type="primary">Remove Item</Button>
                      </Col>
                    )

                  })
                }
                </Row>
              </div>
            </Tab>
            <Tab eventKey="addItem" title="Add Item">
              <div>
                <h4>Add item</h4>
                <Form>
                  <Form.Group>
                    <Form.Label>File</Form.Label>

                    {/*<Button variant="primary" onClick={this.fileUpload}>Select File</Button>*/}
                    <input type="file" id='input_file'
                           onChange={this.fileUpload}
                           accept="image/*,text/*,application/json"/>
                    <div id='progress_upload'></div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Name" id='item_name'/>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control placeholder="Description" id='item_description'/>
                  </Form.Group>
                </Form>
                <div id='item_content' style={{display: 'none'}}></div>
                <Button onClick={this.addItem} variant="primary">Add item</Button>
              </div>
            </Tab>
          </Tabs>
        </div>
      )
    }
    return(
      <div>Loading ...</div>
    )
  }

}

export default Folder;
