/* eslint-disable react-hooks/rules-of-hooks */
import { FC } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Awards as BasicListItemDataType, Enum, getActivityEnums } from '@/services/swagger/luckydraw';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  if (!visible) {
    return null;
  }

  return (
    <ModalForm<BasicListItemDataType>
      open={visible}
      title={done ? null : `奖品${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        const ok = await onSubmit({ ...current, ...values });
        if (ok) onDone();
      }}
      initialValues={{ status: 1, ...current }}
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
            message: '必填项',
          },
        ]}
        placeholder="请输入等级昵称"
        width="md"
        name="grade"
        label='等级'
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入奖品名称"
        width="md"
        name="name"
        label='奖品名称'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="选择所属活动"
        request={async () => (await getActivityEnums({ parentId: -1 })()).data as Enum[]}
        width="md"
        name="activityId"
        label='所属活动'
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },]}
        placeholder="请输入图片链接"
        width="md"
        name="image"
        label="图片"
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入价格"
        width="md"
        name="price"
        label='价格'
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入幸运值"
        width="md"
        name="prob"
        label='幸运值'
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入总数量"
        width="md"
        name="quantity"
        label='总数量'
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入已被抽中次数"
        width="md"
        name="count"
        label='已被抽中次数'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="是否中奖"
        options={[{ label: "否", value: 0 }, { label: "是", value: 1 }]}
        width="md"
        name="isWin"
        label='是否中奖'
      />
    </ModalForm>
  );
};

export default OperationModal;
