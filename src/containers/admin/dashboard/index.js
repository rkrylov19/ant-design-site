import React, { Component } from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import { connect } from 'react-redux';

import { signOut } from '../../../ducks/auth';

const { Header, Content, Sider } = Layout;

class Dashboard extends Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div
            className="logo"
            style={{
              height: '32px',
              background: 'rgba(255,255,255,.2)',
              margin: '16px'
            }}
          />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{
                fontSize: '18px',
                lineHeight: '64px',
                padding: '0 24px',
                cursor: 'pointer',
                transition: 'color .3s'
              }}
            />
            <div style={{ float: 'right', height: '100%' }}>
              <Button
                shape="circle"
                icon="logout"
                style={{ margin: '0 24px' }}
                onClick={() => this.props.signOut()}
              />
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  null,
  {
    signOut
  }
)(Dashboard);
