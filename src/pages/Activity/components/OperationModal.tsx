/* eslint-disable react-hooks/rules-of-hooks */
import { FC } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Activity as BasicListItemDataType } from '@/services/swagger/luckydraw';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  if (!visible) {
    return null;
  }

  return (
    <ModalForm<BasicListItemDataType>
      open={visible}
      title={done ? null : `活动${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        values.status = values.status? 1:0
        const ok = await onSubmit({ ...current, ...values });
        if (ok) onDone();
      }}
      initialValues={{ status: 1, ...current }}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
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
            message: '必填项',
          },
        ]}
        placeholder="请输入活动名称"
        width="md"
        name="name"
        label='活动名称'
      />
      {/* <ProFormSwitch checkedChildren="开启" unCheckedChildren="关闭" name="status" label="状态" rules={[]} /> */}
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="状态"
        options={[{ label: "关闭", value: 0 }, { label: "开启", value: 1 }]}
        width="md"
        name="status"
        label='活动状态'
      />
    </ModalForm>
  );
};

export default OperationModal;
