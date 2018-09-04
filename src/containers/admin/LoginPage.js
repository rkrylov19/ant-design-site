import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { signIn } from '../../ducks/auth';

const FormItem = Form.Item;

class LoginPage extends Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submit(values);
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.props.auth) return <Redirect to="/admin/dashboard" />;
    return (
      <div>
        <Row
          type="flex"
          justify="space-around"
          align="middle"
          style={{ paddingTop: '150px' }}
        >
          <Col span={6}>
            <Form
              onSubmit={this.handleSubmit}
              className="login-form"
              style={{ maxWidth: '300px', margin: '0 auto' }}
            >
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      required: true,
                      message: 'The input is not valid E-mail!'
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Email"
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please input your Password!' },
                    { validator: this.validateToNextPassword }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    type="password"
                    placeholder="Password"
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true
                })(<Checkbox>Remember me</Checkbox>)}
                <Link
                  className="login-form-forgot"
                  to="/admin/forgot-password"
                  style={{ float: 'right' }}
                >
                  Forgot password
                </Link>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: '100%' }}
                >
                  Log in
                </Button>
                Or <Link to="/admin/signup">register now!</Link>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: !!state.auth.user
  };
}

export default connect(
  mapStateToProps,
  { submit: signIn }
)(Form.create()(LoginPage));
