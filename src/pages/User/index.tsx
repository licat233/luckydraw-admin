import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import { addUsers as add, delUsers as del, getActivityEnums, getUsersList as list, putUsers as put } from '@/services/swagger/luckydraw';
import { UserDetail, Users, AddUsersReq as AddReq, PutUsersReq as PutReq, GetUsersListReqParams as Params, Enum, Activity, Awards } from "@/services/swagger/luckydrawComponents";
import OperationModal from './components/OperationModal';
import { PrizeDetailInfo } from './data';
import MoreBtn from '@/components/MoreBtn';
import { useAccess, Access } from 'umi';

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
const handleRemove = async (id: number | undefined) => {
  const hide = message.loading('正在删除...');
  if (!id) return true
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

const prizeColumns: ProColumns<PrizeDetailInfo>[] = [
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

let globalKey = 0;

const UsersList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Users>();

  const [currentDetails, setCurrentDetails] = useState<UserDetail>();
  const [currentDesc, setCurrentDesc] = useState<Users | Activity | Awards | PrizeDetailInfo | number[]>();
  const [currentColumns, setCurrentColumns] = useState<ProColumns<Users>[] | ProColumns<Awards>[] | ProColumns<Activity>[] | ProColumns<PrizeDetailInfo>[]>();

  const showEditModal = (item: Users | undefined) => {
    setVisible(true);
    setCurrent(item);
  };

  const handleDel = async (id: number | undefined) => {
    const ok = await handleRemove(id);
    //刷新列表
    if (actionRef.current && ok) {
      actionRef.current.reload();
    }
  }

  const renderAvailableAwards = (data: Awards[]) => {
    if (!data || data.length === 0) return ""
    return data.map((item: Awards) => {
      return item?.grade || ""
    }).join("、")
  }

  const renderDescription = function <Type extends Record<string, any>>(entity: Type, cloumn: ProColumns<Users>[] | ProColumns<Awards>[] | ProColumns<Activity>[] | ProColumns<PrizeDetailInfo>[] | undefined): JSX.Element {
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

  const [hideAction, setHideAction] = useState<boolean>(false);

  const columns: ProColumns<UserDetail>[] = [
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentDesc(entity.user);
              setCurrentColumns(userColumns)
              setShowDetail(true);
            }}
          >
            {entity.user?.name || '-'}
          </a>
        );
      },
    },
    {
      title: '账号',
      dataIndex: 'passport',
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <span>
            {entity.user?.passport || '-'}
          </span>
        );
      },
    },
    {
      title: '活动',
      dataIndex: 'activityId',
      valueType: 'select',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentDesc(entity.activity);
              setCurrentColumns(activityColumns)
              setShowDetail(true);
            }}
          >
            {entity.activity?.name || '-'}
          </a>
        );
      },
      request: async () => (await getActivityEnums({ parentId: 0 })()).data as Enum[],
    },
    {
      title: '可抽中的奖品',
      dataIndex: 'availableAwards',
      valueType: 'text',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <span>
            {renderAvailableAwards(entity.availableAwards || [])}
          </span>
        );
      },
    },
    {
      title: '已抽次数',
      dataIndex: 'count',
      valueType: 'digit',
      render: (dom, entity) => {
        return (
          <span>
            {entity.user?.count ?? '-'}
          </span>
        );
      },
    },
    {
      title: '可抽次数',
      dataIndex: 'total',
      valueType: 'digit',
      render: (dom, entity) => {
        return (
          <span>
            {entity.user?.total ?? '-'}
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'index',
      hideInTable: hideAction,
      render: (_, record) => [
        <MoreBtn key="more" setHide={setHideAction} onEdit={() => showEditModal(record.user)} onDel={() => handleDel(record.user?.id)} />,
      ]
    },
  ];

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent(undefined);
    setCurrentDetails(undefined);
  };

  const handleSubmit = async (record: Users): Promise<boolean> => {
    const method = record?.id ? 'update' : 'add';
    let ok = false
    if (method === 'update') {
      ok = await handleUpdate(record)
    } else if (method === 'add') {
      ok = await handleAdd(record)
    }
    setDone(ok);
    //刷新列表
    if (actionRef.current && ok) {
      actionRef.current.reload();
    }
    return ok
  };

  const expandedRowRender = (detail: UserDetail) => {
    const list = detail.availableAwards ?? [];
    const data = list.map<PrizeDetailInfo>((award, index) => {
      return {
        index: index,
        id: award.id,
        uuid: award.uuid,
        activityId: award.activityId,
        key: award.uuid,
        name: award.name,
        image: award.image,
        price: award.price,
        grade: award.grade,
        prob: award.prob,
        quantity: award.quantity,
        count: award.count,
        isWin: award.isWin,
      }
    })
    return (
      <ProTable
        columns={[
          {
            title: '预设可抽中的奖品', dataIndex: 'name', key: 'name', valueType: 'text',
            render: (dom, entity) => {
              return (
                <a
                  onClick={() => {
                    setCurrentDesc(entity);
                    setCurrentColumns(prizeColumns)
                    setShowDetail(true);
                  }}
                >
                  {entity.name}
                </a>
              );
            },
          },
          { title: '等级', dataIndex: 'grade', key: 'grade', valueType: 'text' },
          { title: '图片', dataIndex: 'image', key: 'image', valueType: 'image' },
          { title: '价格', dataIndex: 'price', key: 'price', valueType: 'digit' },
          { title: '幸运值', dataIndex: 'prob', key: 'prob', valueType: 'digit' },
          { title: '总数量', dataIndex: 'quantity', key: 'quantity', valueType: 'digit' },
          { title: '已抽数量', dataIndex: 'count', key: 'count', valueType: 'digit' },
          {
            title: '是否中奖',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
              1: {
                text: '是',
                status: 'Success',
              },
              0: {
                text: '否',
                status: 'Default',
              },
            },
          },
        ]}
        rowKey="key"
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    );
  };

  const access = useAccess();
  return (
    <PageContainer>
      <ProTable<UserDetail, Params>
        headerTitle={'用户列表'}
        actionRef={actionRef}
        rowKey={current => current.user?.id ?? globalKey++}
        search={{}}
        toolBarRender={() => [
          <Access
            key="userNewBtn"
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
        expandable={{ expandedRowRender }}
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


export default UsersList;
