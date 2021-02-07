import { useEffect, useState, useRef } from "react";
import { Layout, Menu, Typography, Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors'
import Modal from "antd/lib/modal/Modal";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const App = () => {
  const [username, setUsername] = useState()
  const [isVisible, setIsVisible] = useState(!username)
  const [messages, setMessages] = useState([])
  const client = useRef(null)

  useEffect(() => {
    if(!isVisible){
      client.current = new WebSocket(`ws://${window.location.hostname}:5000`)
      
      client.current.onopen = () => {
        client.current.send(JSON.stringify({ 
          type: 'new',
          name: username 
        }))
      }

      client.current.onclose = () => {
        client.current.send(JSON.stringify({
          type: 'exit',
          user: username
        }))
      }

      client.current.onmessage = mess => {
        const message = JSON.parse(mess.data)
        console.log(message)
        setMessages(prev => ([...prev, message] ))
      }     
    }
  }, [isVisible]);

  const handleSend = (value) => {
    client.current.send(JSON.stringify({
      type: 'message',
      sender: username,
      text: value
    }));
  }
  
  return (
    <Layout>
      <Header 
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          textAlign: 'center',
          padding: '20px 0',
          height: 90
        }}
      >
        <Title style={{ color: 'white' }}>WebChat</Title>
      </Header>
      <Layout>
        <Sider 
          width={200}
          style={{
            backgroundColor: '#f0f2f5',
            padding: '100px 10px 0 10px'
          }}
        >
          <Text>Online users:</Text>
          <Menu selectable={false} style={{
              backgroundColor: '#f0f2f5'
            }}>
            <Menu.Item 
              style={{
                marginBottom: 10,
                background: 'white'
              }}
              icon={<UserOutlined />}
            >
              User name
            </Menu.Item>
            <Menu.Item 
              style={{
                marginBottom: 10,
                background: 'white'
              }}
              icon={<UserOutlined />}
            >
              User name
            </Menu.Item>
          </Menu>
        </Sider>
        <Content
          style={{
            paddingTop: 90,
            paddingBottom: 50,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'white',
            position: 'relative'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            {messages.map(message => {
              console.log(message)
              if(message.type === 'new') return <NewUser>{message.name}</NewUser>
              else if(message.type === 'exit') return <ExitUser>{message.exit}</ExitUser>
              else {
                if (message.sender === username) return <YourMessage name={username}>{message.text}</YourMessage>
                else return <OtherMessage name={message.sender}>{message.text}</OtherMessage>
              }
            })}
          </div>
          <Search 
            size="large"
            enterButton="Send message"
            placeholder="Type your message..."
            style={{
              position: 'absolute',
              padding:5
            }}
            onSearch={handleSend}
          />
        </Content>
        <Modal 
          visible={isVisible}
          footer={[
            <Button type="primary" onClick={()=>{
              setIsVisible(false)
            }}>OK</Button>
          ]}
          title="Enter Your Name"
        >
          <Input value={username} onChange={
            (e) => setUsername(e.target.value)
          }></Input>
        </Modal>
      </Layout>
    </Layout>
  );
}

const YourMessage = ({name, children}) => (
  <div style={{
    width:'100%',
    display: 'flex',
    justifyContent: 'flex-end',
  }}>
    
    <div style={{
      minWidth: 100,
      maxWidth: '70%',
      backgroundColor: blue[1],
      minHeight:50,
      borderRadius: 5,
      borderTopRightRadius: 0,
      padding: 10,
      margin: '5px 0'
    }}>
      <div style={{
        color: blue.primary,
        fontWeight: 'bold'
      }}>{name}</div>
      <div>{children}</div>
    </div>
    <div style={{
      paddingTop: 5,
      width: 10,
      height: 20
    }}>
      <div style={{
        width: 0,
        height: 0,
        borderRight: '10px solid transparent',
        borderTop: '10px solid '+ blue[1]
      }}>

      </div>
    </div>
  </div>
)

const OtherMessage = ({name, children}) => (
  <div style={{
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start'
  }}>
    <div style={{
      paddingTop: 5,
      width: 10,
      height: 20
    }}>
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderTop: '10px solid '+ blue[1]
      }}></div>
    </div>
    <div style={{
      minWidth: 100,
      maxWidth: '70%',
      minHeight: 50,
      backgroundColor: blue[1],
      borderRadius: 5,
      borderTopLeftRadius: 0,
      padding: 10,
      margin: '5px 0',
    }}>
      <div style={{
        color: blue.primary,
        fontWeight: 'bold'
      }}>{name}</div>
      <div style={{ width: '100%'}}>{children}</div>
    </div>
  </div>
)

const NewUser = ({children}) => (
  <div style={{
    width: '100%',
    margin: '5px 0',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <div style={{
      height: '100%',
      padding: '5px 10px',
      borderRadius: 10,
      minWidth:50,
      background: 'rgba(34,16,63,0.3)',
      color: 'white'
    }}>
      User {children} connected!  
    </div>
  </div>
)

const ExitUser = ({children}) => (
  <div style={{
    width: '100%',
    display: 'flex',
    margin: '5px 0',
    justifyContent: 'center'
  }}>
    <div style={{
      height: '100%',
      padding: '5px 10px',
      borderRadius: 10,
      minWidth:50,
      background: 'rgba(34,16,63,0.3)',
      color: 'white'
    }}>
      User {children} disconnected!  
    </div>
  </div>
)

export default App;