import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer,  message } from 'antd';
import React, { useRef, useState } from 'react';
import { addWinningRecords as add, delWinningRecords as del, getActivityEnums, getAwardsEnums, getUsersEnums, getWinningRecordsList as list, putWinningRecords as put } from '@/services/swagger/luckydraw';
import { WinningRecordsDetail, AddWinningRecordsReq as AddReq, PutWinningRecordsReq as PutReq, GetWinningRecordsListReqParams as Params, Users, Activity, Awards, WinningRecords, Enum } from "@/services/swagger/luckydrawComponents";
import OperationModal from './components/OperationModal';
import { DefaultOptionType } from 'antd/es/select';
import MoreBtn from '@/components/MoreBtn';
import { useAccess, Access } from '@umijs/max';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param record
 */
const handleAdd = async (record: AddReq) => {
  const hide = message.loading('正在添加');
  try {
    await add(record)();
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param record
 */
const handleUpdate = async (record: PutReq) => {
  const hide = message.loading('更新中...');
  try {
    await put(record)();
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param id
 */

const handleRemove = async (id: number|undefined) => {
  const hide = message.loading('正在删除...');
  if(!id) return true;
  if (typeof id === 'undefined') return true;

  try {
    await del({ id })();
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const userColumns: ProColumns<Users>[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    valueType: 'digit',
  },
  {
    title: '名称',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '账号',
    dataIndex: 'passport',
    valueType: 'text',
  },
  {
    title: '已抽次数',
    dataIndex: 'count',
    valueType: 'digit',
  },
  {
    title: '可抽次数',
    dataIndex: 'total',
    valueType: 'digit',
  },
];

const activityColumns: ProColumns<Activity>[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    valueType: 'digit',
  },
  {
    title: 'uuid',
    dataIndex: 'uuid',
    valueType: 'text',
  },
  {
    title: '名称',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '关闭',
        status: 'Default',
      },
      1: {
        text: '开启',
        status: 'Success',
      },
    },
  },
];

const prizeColumns: ProColumns<Awards>[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    valueType: 'digit',
  },
  {
    title: 'uuid',
    dataIndex: 'uuid',
    valueType: 'text',
  },
  {
    title: '等级',
    dataIndex: 'grade',
    valueType: 'text',
  },
  {
    title: '名称',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '图片',
    dataIndex: 'image',
    valueType: 'image',
  },
  {
    title: '价格',
    dataIndex: 'price',
    valueType: 'money',
  },
  {
    title: '幸运值',
    dataIndex: 'prob',
    valueType: 'digit',
  },
  {
    title: '总数量',
    dataIndex: 'quantity',
    valueType: 'digit',
  },
  {
    title: '已抽数量',
    dataIndex: 'count',
    valueType: 'digit',
  },
  {
    title: '是否中奖',
    dataIndex: 'isWin',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '否',
        status: 'Default',
      },
      1: {
        text: '是',
        status: 'Success',
      },
    },
  },
];

const renderDescription = function <Type extends Record<string, any>>(entity: Type, cloumn: ProColumns<WinningRecords>[] | ProColumns<Users>[] | ProColumns<Awards>[] | ProColumns<Activity>[] | undefined): JSX.Element {
  return (
    <ProDescriptions<Type>
      column={2}
      title={entity?.name}
      request={async () => ({
        data: entity || {},
      })}
      params={{
        id: entity?.id,
      }}
      columns={cloumn as ProDescriptionsItemProps<Type>[]}
    />
  )
}

let globalKey = 0;

const WinningRecordsList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<WinningRecords>();

  const [currentDetails, setCurrentDetails] = useState<WinningRecordsDetail>();
  const [currentDesc, setCurrentDesc] = useState<WinningRecords | Users | Awards | Activity>();
  const [currentColumns, setCurrentColumns] = useState<ProColumns<Users>[] | ProColumns<Awards>[] | ProColumns<Activity>[]>();

  const formRef = useRef<ProFormInstance>();
  const prizeOptionsMark = useRef(0);
  const [prizeOptions, setPrizeOptions] = useState<DefaultOptionType[]>()

  const showEditModal = (item: WinningRecordsDetail) => {
    setVisible(true);
    setCurrent(item.winningRecord);
    setCurrentDetails(item)
  };


  const [hideAction, setHideAction] = useState<boolean>(false);
  const columns: ProColumns<WinningRecordsDetail>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      hideInTable: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '用户',
      dataIndex: "userId",
      valueType: "select",
      request: async () => (await getUsersEnums({ parentId: 0 })()).data as Enum[],
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentDesc(entity.user)
              setCurrentColumns(userColumns)
              setShowDetail(true);
            }}
          >
            {entity?.user?.name || "不存在"}
          </a>
        );
      },
    },
    {
      title: '活动',
      dataIndex: "activityId",
      valueType: "select",
      // tip: 'The project uuid is the unique key',
      request: async () => (await getActivityEnums({ parentId: 0 })()).data as Enum[],
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentDesc(entity.activity)
              setCurrentColumns(activityColumns)
              setShowDetail(true);
            }}
          >
            {entity?.activity?.name || "不存在"}
          </a>
        );
      },
      fieldProps: {
        onChange: async (val: number) => {
          if (val === 0) return
          prizeOptionsMark.current = new Date().valueOf()
          const markNumber = prizeOptionsMark.current
          const res = (await getAwardsEnums({ parentId: val })()).data as Enum[]
          if (markNumber === prizeOptionsMark.current) { //表示是最新请求
            setPrizeOptions(res) //更新产品选项
            formRef.current?.setFieldValue("awardsId", undefined)
          }
        },
      }
    },
    {
      title: '奖品',
      dataIndex: "awardId",
      valueType: "select",
      // tip: 'The project uuid is the unique key',
      fieldProps: {
        options: prizeOptions || [],
      },
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentDesc(entity.award)
              setCurrentColumns(prizeColumns)
              setShowDetail(true);
            }}
          >
            {entity?.award?.name || "不存在"}
          </a>
        );
      },
    },
    {
      title: '等级',
      dataIndex: 'awardGrade',
      valueType: 'select',
      hideInSearch: true,
      // tip: 'The project uuid is the unique key',
      render: (dom, entity) => {
        return (
          <>{entity?.award?.grade || "不存在"}</>
        );
      },
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      valueType: 'text',
      // hideInForm: true,
      render: (dom, entity) => {
        return (
          <span >
            {entity?.winningRecord?.ip || "不存在"}
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: hideAction,
      render: (_, record) => [
        <MoreBtn key="more" setHide={setHideAction} onEdit={() => showEditModal(record)} onDel={() => handleRemove(record.winningRecord?.id)} />,
      ]
    },
  ];



  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent(undefined);
    setCurrentDetails(undefined);
  };

  const handleSubmit = async (record: AddReq & PutReq ): Promise<boolean> => {
    const method = record.id ? 'update' : 'add';
    let ok = false
    if (method === 'update') {
      ok = await handleUpdate(record as PutReq)
    } else if (method === 'add') {
      ok = await handleAdd(record as AddReq)
    }
    setDone(ok);
    //刷新列表
    if (actionRef.current && ok) {
      actionRef.current.reload();
    }
    return ok
  };
  const access = useAccess();
  return (
    <PageContainer>
      <ProTable<WinningRecordsDetail, Params>
        headerTitle={'中奖记录列表'}
        actionRef={actionRef}
        rowKey={current => current.winningRecord?.id??globalKey++}
        search={{}}
        toolBarRender={() => [
          <Access
            key="newbtn"
            accessible={!!access.canNew}
          >
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setVisible(true);
              }}
              hidden={true}
            >
              <PlusOutlined /> 新建
            </Button>
          </Access>,
        ]}
        request={async (params) => list(params)()}
        columns={columns}
      />
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        details={currentDetails}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrent(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentDesc && currentColumns && renderDescription(currentDesc, currentColumns)}
      </Drawer>
    </PageContainer>
  );
};

export default WinningRecordsList;
