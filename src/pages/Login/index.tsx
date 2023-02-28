import Footer from '@/components/Footer';
import { adminerLogin, AdminerLoginReq, CaptchaInfo, CaptchaReq, getMathCaptcha } from '@/services/swagger/luckydraw';
import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { Input, message, Tabs } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../config/defaultSettings';
import styles from './index.less';
// const LoginMessage: React.FC<{
//   content: string;
// }> = ({ content }) => {
//   return (
//     <Alert
//       style={{
//         marginBottom: 24,
//       }}
//       message={content}
//       type="error"
//       showIcon
//     />
//   );
// };

const captchaParams: CaptchaReq = {
  height: 40,
  width: 150,
  BgColor: {
    R: 254,
    G: 254,
    B: 254,
    A: 254,
  },
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<boolean>(false);
  // const [userLoginError, setUserLoginError] = useState<boolean>(false);
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [imgCaptcha, setImgCaptcha] = useState<CaptchaInfo>({ captchaId: "", base64Image: "" });
  const [form] = useForm()

  const getCaptchaImage = async () => {
    if (userLoginState) return;
    try {
      const result = await getMathCaptcha(captchaParams)();
      setImgCaptcha((result as API.BaseResp).data as CaptchaInfo);
    } catch (error) {
      message.error('获取验证码失败！');
    }
  };

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: AdminerLoginReq) => {
    try {
      // 登录
      const msg = await adminerLogin({
        ...values as unknown as AdminerLoginReq,
      })();
      setUserLoginState(true);
      // setUserLoginError(false);
      if (msg.success) {
        //保存token
        if (msg.data) {
          const jwtToken = JSON.stringify(msg.data as API.JwtToken)
          localStorage.setItem("jwtToken", jwtToken)
        }

        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // console.log(msg); // 如果失败去设置用户错误信息
    } catch (error) {
      setUserLoginState(false);
      // setUserLoginError(true);
      getCaptchaImage();
      // const defaultLoginFailureMessage = '登录失败，请重试！';
      // message.error(defaultLoginFailureMessage);
    }
  };

  useEffect(() => {
    if (!imgCaptcha.base64Image) {
      getCaptchaImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgCaptcha.base64Image]);

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          title="LUCKY DRAW"
          subTitle={'幸运抽奖管理后台'}
          initialValues={{
            autoLogin: false,
          }}
          form={form}
          onFinish={async (values) => {
            await handleSubmit({...values, captchaId: imgCaptcha.captchaId});
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />

          {/* {userLoginError && (
            <LoginMessage content={'错误的用户名和密码'} />
          )} */}
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={'请输入用户名'}
            rules={[
              {
                required: true,
                message: '用户名是必填项！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={'请输入密码'}
            rules={[
              {
                required: true,
                message: '密码是必填项！',
              },
            ]}
          />
          <Input.Group compact className={styles.captchagrounp}>
                <div className={styles.captchainput}>
                  <ProFormText
                    key="account_solution"
                    name="solution"
                    fieldProps={{
                      size: 'large',
                      prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
                    }}
                    allowClear={true}
                    width="xs"
                    placeholder="验证码"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                      {
                        pattern: /^-?\d{1,4}$/,
                        message: '验证码格式错误！',
                      },
                    ]}
                  />
                </div>
                <div className={styles.captchaimg} key="account_captchaImag" onClick={getCaptchaImage}>
                  <img src={imgCaptcha?.base64Image || ''} />
                </div>
              </Input.Group>
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
