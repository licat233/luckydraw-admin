/* eslint-disable react-hooks/rules-of-hooks */
import { FC } from 'react';
import {
  ModalForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Adminer as BasicListItemDataType } from '@/services/swagger/luckydraw';
import { ProFormSelect } from '@ant-design/pro-components';
import { AccessList } from '@/services/swagger/data';

type OperationModalProps = {
  done: boolean;
  open: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};


const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, open, current, onDone, onSubmit } = props;
  if (!open) {
    return null;
  }

  return (
    <ModalForm<BasicListItemDataType>
      open={open}
      title={done ? null : `管理员${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      key={current?.id}
      onFinish={async (values) => {
        values.isSuper = values.isSuper?1:0;
        const ok = await onSubmit({ ...current, ...values });
        if (ok) onDone();
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >

      <ProFormText
        rules={[
          {
            required: true,
            message: '账号为必填项',
          },
          {
            pattern: /^[A-Za-z0-9]{3,20}$/,
            message: '用户名由3-20位数字或者字母组成',
          },
        ]}
        placeholder="请输入账号"
        width="md"
        name="username"
        label="账号"
      />
      <ProFormText.Password
        rules={[
          {
            required: !current || false,
            message: '密码为必填项',
          },
          {
            pattern: /^.{6,34}$/,
            message: '密码长度有误',
          },
        ]}
        placeholder="请输入密码"
        width="md"
        name="password"
        label="密码"
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="access"
        label='身份'
        valueEnum={AccessList}
      />
      <ProFormSwitch
        // options={[{ label: "否", value: 0 }, { label: "是", value: 1 }]}
        width="md"
        name="isSuper"
        label="是否为超级管理员"
      />
    </ModalForm>
  );
};

export default OperationModal;
