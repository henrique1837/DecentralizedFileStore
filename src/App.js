import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Web3 from "web3";
import Authereum from 'authereum'
import $ from 'jquery';
import {Button,Form,Table,Tabs,Tab,Container,Row,Col,Alert,Nav,Navbar,Card,Modal,Collapse} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from './components/Home.js';
import Logout from './components/Logout.js';
import Menu from './components/Menu.js';
import FoldersPage from './components/FoldersPage.js';
import "./App.css";
import "./assets/scss/argon-dashboard-react.scss";

const Box = require('3box')
const AppName = 'DecentralizedFilestore_test1';
class App extends Component {
  state = {
    hasWeb3:false,
    coinbase: null,
    box: null,
    space: null,
    doingLogin:false,
    foldersAddr: null
   };
  constructor(props){
    super(props)

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);

    this.openSpace = this.openSpace.bind(this);

    this.setRedirect = this.setRedirect.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }
  componentDidMount = async () => {

    if(window.ethereum){
      this.setState({
        hasWeb3:true
      })
      await this.login();
      const space = this.state.space;
      const profile = this.state.profile;
      let hasFolders = false;
      let foldersAddr;
      if(profile){
        for(const item of Object.values(profile)){
          if(item.address.split(".").pop()=="Folders"){
            hasFolders = true
            foldersAddr = item.address
          }
        }
        if(!hasFolders){
          const thread = await space.createConfidentialThread("Folders");
          foldersAddr = thread.address;
        }
      }


      this.setState({
        foldersAddr: foldersAddr
      })


    }

  };

  login = async function(){
    try {
      // Get network provider and web3 instance.
      let web3;
      if(window.ethereum){
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      } else {
        const authereum = new Authereum('mainnet');
        const provider = await authereum.getProvider()
        web3 = new Web3(provider);
        await provider.enable()
      }

      this.setState({
        doingLogin: true
      });

      // Use web3 to get the user's coinbase.
      const coinbase = await web3.eth.getCoinbase();
      console.log(coinbase);
      ReactDOM.render(
        <p>Aprove access to your 3Box account</p>,
        document.getElementById("loading_status")
      );
      const box = await Box.openBox(coinbase,window.ethereum);

      //const space = await box.openSpace(AppName);
      ReactDOM.render(
        <p>Syncing your profile</p>,
        document.getElementById("loading_status")
      );
      await box.syncDone;
      this.setState({
        coinbase:coinbase,
        box: box
      });
      await this.openSpace();
      console.log(box._3id);
    } catch (error) {
      // Catch any errors for any of the above operations.

      this.setState({
        doingLogin: false
      });
      console.error(error);
    }
  }
  logout = function(){

    this.setState({
      web3Err:false,
      coinbase: null,
      box: null,
      space: null
    })
    console.log(this.state)
    return
  };

  openSpace = async function(){
    const coinbase = this.state.coinbase;
    const box = this.state.box;

    ReactDOM.render(
      <p>Aprove access to open your Decentralized Filestore Space</p>,
      document.getElementById("loading_status")
    );
    $("#alert_info").show();
    const space = await box.openSpace(AppName);
    console.log(await space.user.encrypt("cu"));
    console.log(space)
    ReactDOM.render(
      <p>Opening your profile</p>,
      document.getElementById("loading_status")
    );
    await space.syncDone;
    const profile = await space.public.all();
    console.log(profile);
    $("#alert_info").hide();
    this.setState({
      profile: profile,
      space: space,
      doingLogin: false
    });
    this.setRedirect();
    return
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return(
        <Redirect to='/space' />
      );
    }
  }
  render() {
    if(this.state.doingLogin){
      return(
        <div>
          <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" >
            <Navbar.Brand href="#home">Decentralized Filestore</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar>
          <Container className="themed-container" fluid={true}>

            <Alert variant="default" style={{textAlign: "center"}}>
              <h4>Loading dapp ...</h4>
              <div id="loading_status"></div>

            </Alert>
          </Container>
          <footer style={{marginTop: '20px'}}>
                    <Row>
                      <Col lg={4}>
                        <p>Proudly done using <a href="https://3box.com" target='_blank' title='3Box'>3Box</a></p>
                      </Col>
                      <Col lg={4}>
                        <p>Support by using <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a> or donating</p>
                      </Col>
                      <Col lg={4}>
                        <p>Use a private,fast and secure browser</p>
                        <p>Earn rewards in BAT token while browsing</p>
                        <p>Install <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a></p>
                      </Col>
                    </Row>
          </footer>
        </div>
      );
    }
    return (
      <div>
        <Router>
          {this.renderRedirect()}
          <Menu box={this.state.box} space={this.state.space} hasWeb3={this.state.hasWeb3}/>

          <Container className="themed-container" fluid={true}>

           <Alert variant="default" style={{textAlign: "center",display:"none"}} id='alert_info'>
                <h4>Loading dapp ...</h4>
                <div id="loading_status"></div>
            </Alert>

            <Switch>
                  <Route path="/home" component={Home} />
                  <Route path="/space" render={() => {
                    if(!this.state.foldersAddr){
                      return(
                        <Redirect to="/home" />
                      )
                    }
                    return(
                      <FoldersPage coinbase={this.state.coinbase}
                                        box={this.state.box}
                                        space={this.state.space}
                                        threadAddress={this.state.foldersAddr} />
                    )
                  }} />
                  <Route path="/loginNoWeb3" render={() => {
                    return(
                      <div>
                         <p>Use <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a> or login with <a href="#auth_login" onClick={this.login}>authereum</a></p>
                      </div>
                    )
                  }} />
                  <Route path="/login" render={() => {
                    if(!this.state.hasWeb3){
                      return(
                        <Redirect to="/loginNoWeb3" />
                      );
                    }
                    return(
                      <div>
                         <p><a href="#auth_login" onClick={this.login}>Login</a></p>
                      </div>
                    )
                  }} />
                  <Route path="/logout" component={() => {
                    if(!this.state.space){
                      return(
                        <Redirect to="/home" />
                      );
                    }
                    this.setState({
                      web3Err:false,
                      coinbase: null,
                      box: null,
                      space: null
                    })
                    console.log(this.state)
                    this.logout();
                    return(
                      <Redirect to="/home" />
                    )
                  }} />
                  <Route render={() => {
                    return(
                      <Redirect to="/home" />
                    );
                  }} />
            </Switch>

          </Container>
        </Router>
        <footer style={{marginTop: '20px'}}>
                  <Row>
                    <Col lg={4}>
                      <p>Proudly done using <a href="https://3box.com" target='_blank' title='3Box'>3Box</a></p>
                    </Col>
                    <Col lg={4}>
                      <p>Support by using <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a> or donating</p>
                    </Col>
                    <Col lg={4}>
                      <p>Use a private,fast and secure browser</p>
                      <p>Earn rewards in BAT token while browsing</p>
                      <p>Install <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a></p>
                    </Col>
                  </Row>
         </footer>
      </div>
    );



  }
}

export default App;
