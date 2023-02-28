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
import { addAdminer as add, delAdminer as del, getAdminerList as list, putAdminer as put } from '@/services/swagger/luckydraw';
import { Adminer as Item, AddAdminerReq as AddReq, PutAdminerReq as PutReq, GetAdminerListReqParams as Params } from "@/services/swagger/luckydrawComponents";
import OperationModal from './components/OperationModal';
import MoreBtn from '@/components/MoreBtn';
import { Access, useAccess } from '@umijs/max';
import { AccessList } from '@/services/swagger/data';

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

const AdminerList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Item>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  // const defaultAvatar = "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";

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
      title: '账号',
      dataIndex: 'username',
      // tip: 'The adminer uuid is the unique key',
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
      title: '密码',
      dataIndex: 'password',
      valueType: 'password',
    },
    {
      title: '身份',
      dataIndex: 'access',
      valueType: 'select',
      valueEnum: AccessList
    },
    {
      title: '超管?',
      dataIndex: 'isSuper',
      sorter: true,
      valueType: "select",
      valueEnum: {
        0: {
          text: '否',
          status: 'Nomarl',
        },
        1: {
          text: '是',
          status: 'Nomarl',
        },
      },
    },
    {
      hideInTable: hideAction,
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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
        headerTitle={'管理员列表'}
        actionRef={actionRef}
        rowKey="id"
        // search={false}
        // options={{
        //   search: true,
        // }}
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
        dateFormatter="number"
      />
      <OperationModal
        done={done}
        open={visible}
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
        {current?.username && (
          <ProDescriptions<Item>
            column={2}
            title={current?.username}
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

export default AdminerList;
