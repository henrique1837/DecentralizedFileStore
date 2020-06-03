import React,{Component} from 'react';
import {Button,Form,Table,Tabs,Tab,Container,Row,Col,Alert,Nav,Navbar,Card,Modal,Collapse} from 'react-bootstrap';
class Home extends Component {
  state = {
    tutorial: false
  }

  render(){
    if(this.state.tutorial){
      return(
        <Card>
              <Card.Header as="h3">Tutorial</Card.Header>
              <Card.Body>
                <Card.Title>How to use this dapp?</Card.Title>
                <Card.Text>
                <ol>
                  <li>Install <a href="https://brave.com/?ref=hen956" target='_blank' title='Brave Browser'>Brave Browser</a></li>
                  <li>
                    Create your ethereum wallet (or import existing one) <br/>
                    <img src={require('../imgs/brave_Crypto0.png')} style={{maxWidth:' 60%'}}/> <br/>
                    <img src={require('../imgs/brave_Crypto1.png')} style={{maxWidth:' 60%'}}/> <br/>
                    <img src={require('../imgs/brave_Crypto2.png')} style={{maxWidth:' 60%'}}/>
                  </li>
                  <li>
                    Accept wallet connection, 3box login/sign up and open DecentralizedFileStore space <br/>
                    <img src={require('../imgs/brave_3box.png')} style={{maxWidth:' 60%'}}/> <br/>
                  </li>
                  {/*<li>
                    Fill your profile <br/>
                    <img src={require('./imgs/brave_3boxProfiles.png')} style={{maxWidth:' 60%'}}/> <br/>
                  </li>*/}

                </ol>

                 </Card.Text>
                <Button variant='primary' onClick={()=>{
                  this.setState({
                    tutorial: false
                  });
                }}>HomePage</Button>
              </Card.Body>
             </Card>
      );
    }
    return(
      <Container>

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
                      <Card.Body>
                        <Card.Title>How to use it?</Card.Title>
                        <Card.Text>Step by step on how to use DecentralizedFileStore</Card.Text>
                        <Button variant="primary" onClick={()=>{
                          this.setState({
                            tutorial: true
                          });
                        }}>Tutorial</Button>
                      </Card.Body>
                    </Card>
                  </Col>


                </Row>
              </Card.Body>
              </Card>
            </Container>
    )
  }
}
export default Home;
