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
import { addActivity as add, delActivity as del, getActivityList as list, putActivity as put } from '@/services/swagger/luckydraw';
import { Activity as Item, AddActivityReq as AddReq, PutActivityReq as PutReq, GetActivityListReqParams as Params } from "@/services/swagger/luckydrawComponents";
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


const ActivityList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Item>();

  const showEditModal = (item: Item) => {
    setVisible(true);
    setCurrent(item);
  };

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
      title: '活动名称',
      dataIndex: 'name',
      // tip: 'The project uuid is the unique key',
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
      title: '活动状态',
      dataIndex: 'status',
      sorter: true,
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
    {
      hideInTable: hideAction,
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <MoreBtn key="more" setHide={setHideAction} onEdit={() => showEditModal(record)} onDel={() => handleRemove(record.id)} />,
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
        headerTitle={'项目列表'}
        actionRef={actionRef}
        rowKey="id"
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

export default ActivityList;
