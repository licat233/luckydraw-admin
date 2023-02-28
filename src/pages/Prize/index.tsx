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
import { addAwards as add, delAwards as del, getActivityEnums, getAwardsList as list, putAwards as put } from '@/services/swagger/luckydraw';
import { Awards as Item, AddAwardsReq as AddReq, PutAwardsReq as PutReq, GetAwardsListReqParams as Params, Enum } from "@/services/swagger/luckydrawComponents";
import OperationModal from './components/OperationModal';
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

const handleRemove = async (id: number) => {
  const hide = message.loading('正在删除...');
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

const PrizeList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Item>();


  const showEditModal = (item: Item) => {
    setVisible(true);
    setCurrent(item);
  };

  const handleDel = async (id: number | undefined) => {
    if (typeof id === 'undefined') return;
    const ok = await handleRemove(id);
    //刷新列表
    if (actionRef.current && ok) {
      actionRef.current.reload();
    }
  }

  const [hideAction, setHideAction] = useState<boolean>(false);

  const columns: ProColumns<Item>[] = [
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
      title: '等级',
      dataIndex: 'grade',
      // tip: 'The prize uuid is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrent(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '名称',
      dataIndex: "name",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '所属活动',
      dataIndex: 'activityId',
      valueType: 'select',
      request: async () => (await getActivityEnums({ parentId: -1 })()).data as Enum[]
    },
    {
      title: '图片',
      dataIndex: "image",
      valueType: 'image',
      hideInSearch: true,
    },
    {
      title: '价格',
      dataIndex: "price",
      valueType: 'digit',
    },
    {
      title: '幸运值',
      dataIndex: "prob",
      valueType: 'digit',
    },
    {
      title: '总数',
      dataIndex: "quantity",
      valueType: 'digit',
    },
    {
      title: '已抽个数',
      dataIndex: "count",
      valueType: 'digit',
    },
    {
      title: '是否中奖',
      dataIndex: 'isWin',
      valueType: 'text',
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      hideInTable: hideAction,
      render: (_, record) => [
        <MoreBtn key="more" setHide={setHideAction} onEdit={() => showEditModal(record)} onDel={() => handleDel(record.id)} />,
      ]
    },
  ];

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent(undefined);
  };

  const handleSubmit = async (record: Item): Promise<boolean> => {
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
  const access = useAccess();
  return (
    <PageContainer>
      <ProTable<Item, Params>
        headerTitle={'奖品列表'}
        actionRef={actionRef}
        rowKey="id"
        // search={false}
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
        request={(req) => {
          return list(req)();
        }}
        columns={columns}
      />
      <OperationModal
        done={done}
        visible={visible}
        current={current}
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
        {current?.name && (
          <ProDescriptions<Item>
            column={2}
            title={current?.name}
            request={async () => ({
              data: current || {},
            })}
            params={{
              id: current?.id,
            }}
            columns={columns as ProDescriptionsItemProps<Item>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PrizeList;
