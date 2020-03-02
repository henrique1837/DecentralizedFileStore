import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Web3 from "web3";
import Authereum from 'authereum'
import $ from 'jquery';
import {Button,Form,Table,Tabs,Tab,Container,Row,Col,Alert,Nav,Navbar,Card,Modal,Collapse} from 'react-bootstrap';
import FoldersPage from './components/FoldersPage.js';
import "./App.css";
import "./assets/scss/argon-dashboard-react.scss";

const Box = require('3box');
const AppName = 'DecentralizedFilestore_test0';



class App extends Component {
  state = {
    hasWeb3:false,
    coinbase: null,
    box: null,
    space: null,
    doingLogin:false,
    foldersAddr: null,
    page: <Container></Container>,
    footer: <footer style={{marginTop: '20px'}}>
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
   };
  constructor(props){
    super(props)

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);

    this.foldersPage = this.foldersPage.bind(this);
    this.setLoginItem = this.setLoginItem.bind(this);
    this.homePage = this.homePage.bind(this);
    this.loginPageNoWeb3 = this.loginPageNoWeb3.bind(this);
    this.openSpace = this.openSpace.bind(this);
  }
  componentDidMount = async () => {
    this.homePage();
    if(window.ethereum){
      this.setState({
        hasWeb3:true
      })
      await this.login();
      const space = this.state.space;
      const profile = this.state.profile;
      let hasFolders = false;
      let foldersAddr;
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

    } catch (error) {
      // Catch any errors for any of the above operations.

      this.setState({
        doingLogin: false
      });
      console.error(error);
    }
  }
  logout = async function(){
    this.homePage();
    await this.state.box.logout();

    this.setState({
      web3Err:false,
      web3: null,
      coinbase: null,
      box: null,
      space: null
    })
  };
  homePage = function() {
    this.setState({
      page:  <Container>

              <Card>
              <Card.Header as="h3">Welcome to Decentralized Filestore</Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <Card>
                      {/*<Card.Img variant="top" src="./imgs/ipfs.png" />*/}
                      <Card.Body>
                        <Card.Title>Decentralized storage</Card.Title>
                        <Card.Text>Everything is stored in <a href='https://ipfs.io' target='_blank' title='Interplanetary File System'>IPFS</a> using <a href='https://orbitdb.org/' target='_blank' title='OrbitDB'>OrbitDB</a> and linked to your decentralized identity thanks to <a href="https://3box.com" target='_blank' title='3Box'>3Box</a></Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card>
                      {/*<Card.Img variant="top" src="./imgs/ipfs.png" />*/}
                      <Card.Body>
                        <Card.Title>Share same data in multiple dapps</Card.Title>
                        <Card.Text>Every dapp that uses 3Box can request same data you input here.</Card.Text>
                      </Card.Body>
                    </Card>
                    <h4></h4>

                  </Col>
                </Row>
              </Card.Body>
              </Card>
              <hr/>
              <Card>
              <Card.Header as="h3">Informations</Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <Card>
                      {/*<Card.Img variant="top" src="./imgs/ipfs.png" />*/}
                      <Card.Body>
                        <Card.Title>How to use it?</Card.Title>
                        <Card.Text>Step by step on how to use DecentralizedPortfolio</Card.Text>
                        <Button variant="primary" onClick={this.tutorialPage}>Tutorial</Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/*<Col sm={6}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Roadmap</Card.Title>
                      <Card.Text>What will be the future of that dapp?</Card.Text>
                      <Button variant="primary">Roadmap</Button>
                    </Card.Body>
                  </Card>

                  </Col>*/}
                </Row>
              </Card.Body>
              </Card>
            </Container>
    })
    return
  }


  foldersPage = async function(){

    this.setState({
      page: <FoldersPage space={this.state.space} threadAddress={this.state.foldersAddr} />
    })
    return
  }


  tutorialPage = async() =>{
    this.setState({
      page:      <Card>
                  <Card.Header as="h3">Tutorial</Card.Header>
                  <Card.Body>
                    <Card.Title>How to use this dapp?</Card.Title>
                    <Card.Text>
                    <ol>
                      <li>Install <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a></li>
                      <li>
                        Create your ethereum wallet (or import existing one) <br/>
                        <img src={require('./imgs/brave_Crypto0.png')} style={{maxWidth:' 60%'}}/> <br/>
                        <img src={require('./imgs/brave_Crypto1.png')} style={{maxWidth:' 60%'}}/> <br/>
                        <img src={require('./imgs/brave_Crypto2.png')} style={{maxWidth:' 60%'}}/>
                      </li>
                      <li>
                        Accept wallet connection, 3box login/sign up and open DecentralizedPortfolio space <br/>
                        <img src={require('./imgs/brave_3box.png')} style={{maxWidth:' 60%'}}/> <br/>
                      </li>
                      {/*<li>
                        Fill your profile <br/>
                        <img src={require('./imgs/brave_3boxProfiles.png')} style={{maxWidth:' 60%'}}/> <br/>
                      </li>*/}

                    </ol>

                     </Card.Text>
                    <Button variant='primary' onClick={this.homePage}>HomePage</Button>
                  </Card.Body>
                 </Card>
    })
    return
  }
  loginPageNoWeb3 = function(){
    this.setState({
      page: <div>
               <p>Use <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a> or login with <a href="#auth_login" onClick={this.login}>authereum</a></p>
            </div>
    });
    return
  }

  openSpace = async function(){
    const coinbase = this.state.coinbase;
    const box = this.state.box;

    ReactDOM.render(
      <p>Aprove access to open your Decentralized Filestore Space</p>,
      document.getElementById("loading_status")
    );
    $("#alert_info").show();
    const space = await box.openSpace(AppName);

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
    return;
  }

  setLoginItem = function(){
    if(!this.state.hasWeb3){
      return(
        <Nav.Link href="#login" onClick={this.loginPageNoWeb3}>Login</Nav.Link>
      )
    }
    return(
      <Nav.Link href="#login" onClick={this.login}>Login</Nav.Link>
    )
  }
  render() {

    if ((!this.state.box || !this.state.space) && !this.state.doingLogin) {
      return (
        <div>
          <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <Navbar.Brand href="#home" onClick={this.homePage}>Decentralized Filestore</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#home" onClick={this.homePage}>Home</Nav.Link>
                {
                  this.setLoginItem()
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Container className="themed-container" fluid={true}>

          <Container>
          {
            this.state.page
          }
          </Container>
          {
            this.state.footer
          }
          </Container>

        </div>
      );
    }

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
            <Container>
            {
              this.state.page
            }
            </Container>
            {
              this.state.footer
            }
          </Container>

        </div>
      );
    }

    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Navbar.Brand href="#home" onClick={this.homePage}>Decentralized Filestore</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home" onClick={this.foldersPage}>Space</Nav.Link>
              <Nav.Link href="#logout" onClick={this.logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container className="themed-container" fluid={true}>

          <Alert variant="default" style={{textAlign: "center",display:"none"}} id='alert_info'>
            <h4>Loading dapp ...</h4>
            <div id="loading_status"></div>

          </Alert>
          <Container>
          {
            this.state.page
          }
          </Container>
          {
            this.state.footer
          }
        </Container>

      </div>
    );

  }
}

export default App;
