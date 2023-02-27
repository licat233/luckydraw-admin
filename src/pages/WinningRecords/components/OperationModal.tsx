/* eslint-disable react-hooks/rules-of-hooks */
import { FC,useRef, useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormInstance,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Enum, getActivityEnums, getAwardsEnums, getUsersEnums, WinningRecords as BasicListItemDataType, WinningRecordsDetail } from '@/services/swagger/luckydraw';
import { DefaultOptionType } from 'antd/es/select';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  details: Partial<WinningRecordsDetail> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const formRef = useRef<ProFormInstance>();
  const prizeOptionsMark = useRef(0);

  const [prizeOptions, setPrizeOptions] = useState<DefaultOptionType[]>()

  const currentActivityId = useRef<number | undefined>(current?.activityId)
  const isFirst = useRef<boolean>(true)

  const setPrizeData = async (activityId: number | undefined) => {
    if (!activityId) return
    if (activityId===0) return
    prizeOptionsMark.current = new Date().valueOf()
    const markNumber = prizeOptionsMark.current
    const res = (await getAwardsEnums({ parentId: activityId })()).data as Enum[]
    if (markNumber === prizeOptionsMark.current) { //表示是最新请求
      setPrizeOptions(res) //更新产品选项
    }
    if (activityId !== currentActivityId.current) {
      if (isFirst.current) {
        isFirst.current = false
      }else{
        formRef.current?.setFieldValue("awardId", undefined)
      }
    }
    currentActivityId.current = activityId
  }

  if(isFirst.current) (setPrizeData(current?.activityId))

  return (
    <ModalForm<BasicListItemDataType>
      open={visible}
      title={done ? null : `抽奖记录${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        const ok = await onSubmit({ ...current, ...values });
        if (ok) onDone();
      }}
      initialValues={{ ...current }}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      // trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
      formRef={formRef}
    >
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="userId"
        label='抽奖用户'
        request={async () => (await getUsersEnums({ parentId: 0 })()).data as Enum[]}
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
        label='参与活动'
        request={async () => (await getActivityEnums({ parentId: 0 })()).data as Enum[]}
        fieldProps={{
          onChange: async (val: number) => {
            await setPrizeData(val)
          },
        }}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="awardId"
        label='所中奖品'
        options={prizeOptions}
        allowClear={true}
      />
      <ProFormText
        width="md"
        name="ip"
        label='位置IP'
      />
    </ModalForm>
  );
};

export default OperationModal;
