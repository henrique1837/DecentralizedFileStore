import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Button,Form,Table,Tabs,Tab,Container,Row,Col,Alert,Nav,Navbar,Card,Modal,Collapse} from 'react-bootstrap';
import Folder from './Folder.js';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
const AppName = 'DecentralizedFilestore_test1';

class FoldersPage extends Component {
  state = {
    space: null,
    thread: null,
    posts: []
  }

  constructor(props){
    super(props);
    this.openFolder = this.openFolder.bind(this);
    this.createFolder = this.createFolder.bind(this);
  }


  componentDidMount = async ()  => {
    const thread = await this.props.space.joinThreadByAddress(this.props.threadAddress);
    const coinbase = this.props.coinbase;
    const box = this.props.box;
    this.setState({
      box: this.props.box,
      space: this.props.space,
      thread: thread

    })
    const posts = await this.state.thread.getPosts();
    this.setState({posts});

     await this.state.thread.onUpdate(async()=> {
       const posts = await this.state.thread.getPosts();
       this.setState({posts});
     });
  };

  createFolder = async function(){
    if($("#folder_name").val().replace(/\s/g, '')){
      const name = $("#folder_name").val()
      const thread = await this.state.space.createConfidentialThread(name);
      await this.state.thread.post({
        name: name,
        address: thread.address
      });
      alert('Folder created');
    }
    return;
  };

  deleteFolder = async function(postId,threadAddress){
    const ok = window.confirm("Confirm to delete ALL data from that folder");
    if(ok){
      const thread = await this.props.space.joinThreadByAddress(threadAddress);
      const posts = await thread.getPosts();
      for(const post of posts){
        const itemId = post.postId;
        await thread.deletePost(itemId);
      }
      const removed = ReactDOM.unmountComponentAtNode(document.getElementById("div_folder"))
      await this.state.thread.deletePost(postId);
    }
  };

  openFolder = function(threadAddress){
    /*
    const removed = ReactDOM.unmountComponentAtNode(document.getElementById("div_folder"))


    ReactDOM.render(
      <Folder box={this.state.box}
              space={this.state.space}
              threadAddress={threadAddress} />,
      document.getElementById('div_folder')


    );

    return
    */
    return(
      <Folder box={this.state.box}
              space={this.state.space}
              threadAddress={threadAddress} />
    )
  }

  render(){
    const that = this;
    if(this.state.thread && this.state.posts){
      return(
        <div>
          <Row>
            <Col lg={4} style={{heigth:'300px',overflowY: 'auto'}}>
              <h4>Your folders</h4>
              {
                this.state.posts.map(function(post){
                    const name = post.message.name;
                    const threadAddress = post.message.address;
                    const postId = post.postId;
                    return(
                      <div>
                        <Row>
                          <Col lg={8}>
                            <Button variant="primary"><Link to={"/space"+threadAddress}
                                                            style={{all: 'unset'}}>{name}</Link></Button>
                          </Col>
                          <Col lg={4}>
                            <Button variant="danger" onClick={()=>{that.deleteFolder(postId,threadAddress)}}>X</Button>
                          </Col>
                        </Row>
                      </div>
                    )
                })

              }
            </Col>
            <Col style={{heigth:'300px',overflowY: 'auto'}}>
              <h4>Add folder</h4>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Name" id='folder_name'/>
              </Form.Group>
              <Button onClick={this.createFolder}>Create</Button>
            </Col>
          </Row>
          <Switch>
            <Route path="/space/:threadAddress" render={() => {
              return(
                <Folder box={this.state.box}
                        space={this.state.space}/>
              )
            }} />
          </Switch>
          <div  style={{paddingTop: '20px'}} id='div_folder'></div>
        </div>
      )
    }
    return(
      <div>Loading ...</div>
    )
  }

}

export default FoldersPage;
