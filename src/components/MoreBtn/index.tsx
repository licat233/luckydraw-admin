/*
 * @Author: licat
 * @Date: 2022-12-29 16:18:44
 * @LastEditors: licat
 * @LastEditTime: 2022-12-29 16:40:15
 * @Description:
 */
import { DeleteTwoTone, DownOutlined, EditTwoTone } from "@ant-design/icons";
// import { ProFormInstance } from "@ant-design/pro-components";
import { Dropdown, Modal } from "antd";
import { useAccess } from 'umi';

type ActionHandler = (() => void | boolean) | (() => Promise<void | boolean>)

type MoreBtnProps = {
    onEdit: ActionHandler | undefined;
    onDel: ActionHandler | undefined;
    setHide: ((hide: boolean) => void) | undefined;
}

const MoreActionBtn: React.FC<MoreBtnProps> = (props) => {
    const { onEdit, onDel, setHide } = props;

    const operationList = []

    const access = useAccess();

    if (access.canEdit && onEdit) {
        operationList.push({
            key: 'edit',
            itemIcon: <EditTwoTone twoToneColor='#245cfc' />,
            label: '编辑',
        })
    }

    if (access.canDel && onDel) {
        operationList.push({
            key: 'delete',
            itemIcon: <DeleteTwoTone twoToneColor='#ce2e3f' />,
            danger: true,
            label: '删除',
        })
    }
    if (operationList.length === 0 && setHide) {
        setHide(true)
    }

    const editAndDelete = async (key: string | number) => {
        // let ok:boolean|void = false
        if (key === 'edit' && onEdit) {
            onEdit()
        } else if (key === 'delete' && onDel) {
            Modal.confirm({
                title: '删除警告',
                content: '确定删除该条数据吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                    await onDel();
                },
            });
        }
    };

    return (
        <Dropdown
            menu={{
                selectedKeys: [],
                onClick: async ({ key }) => (await editAndDelete(key)),
                items: operationList,
            }}
        >
            <a href="#!" onClick={(e) => { e.preventDefault() }}>
                操作 <DownOutlined />
            </a>
        </Dropdown>
    );
}

export default MoreActionBtn;