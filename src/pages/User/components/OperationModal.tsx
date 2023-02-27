import { FC, useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Enum, getActivityEnums, getAwardsEnums, UserDetail, Users as BasicListItemDataType } from '@/services/swagger/luckydraw';
import { ProFormCheckbox, ProFormInstance } from '@ant-design/pro-components';
import { message } from 'antd';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  details: Partial<UserDetail> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;

  const formRef = useRef<ProFormInstance>();
  const prizeOptionsMark = useRef(0);

  // const [prizeOptions, setPrizeOptions] = useState<DefaultOptionType[]>()
  const [prizeOptions, setPrizeOptions] = useState<Enum[]>()
  useEffect(() => {
    if (!prizeOptions) {
      if (current?.activityId) {
        if (current.activityId > 0) {
          getAwardsEnums({ parentId: current.activityId })().then(res => {
            const data = res.data as Enum[]
            setPrizeOptions(data)
          }).catch(err => {
            message.error(err.message)
          })
        }
      }
    }
  })

  const currentActivityId = useRef<number | undefined>(current?.activityId)
  const isFirst = useRef<boolean>(true)

  const setPrizeData = async (activityId: number | undefined) => {
    if (!activityId) return
    if (activityId === 0) return
    prizeOptionsMark.current = new Date().valueOf()
    const markNumber = prizeOptionsMark.current
    const res = (await getAwardsEnums({ parentId: activityId })()).data as Enum[]
    console.log(res)
    if (markNumber === prizeOptionsMark.current) { //表示是最新请求
      setPrizeOptions(res) //更新产品选项
    }
    if (activityId !== currentActivityId.current) {
      if (isFirst.current) {
        isFirst.current = false
      } else {
        formRef.current?.setFieldValue("awardId", undefined)
      }
    }
    currentActivityId.current = activityId
  }

  if (isFirst.current) (setPrizeData(current?.activityId))

  return (
    <ModalForm<BasicListItemDataType>
      open={visible}
      title={done ? null : `用户${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        values.availableAwards += ""
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
      formRef={formRef}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
          {
            pattern: /^.{2,10}$/,
            message: '长度在2-10之间',
          },
        ]}
        placeholder="请输入用户名"
        width="md"
        name="name"
        label='用户名'
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入凭证"
        width="md"
        name="passport"
        label='账号'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="activityId"
        label='活动'
        request={async () => (await getActivityEnums({ parentId: 0 })()).data as Enum[]}
        fieldProps={{
          onChange: async (val: number) => {
            await setPrizeData(val)
          },
        }}
      />
      <ProFormCheckbox.Group
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="lg"
        layout="vertical"
        name="availableAwards"
        label='预设可抽中的奖品'
        options={prizeOptions || []}
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="count"
        label='已抽次数'
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="total"
        label='可抽次数'
      />
    </ModalForm>
  );
};

export default OperationModal;
