/*
 * @Author: licat
 * @Date: 2022-12-29 16:18:44
 * @LastEditors: licat
 * @LastEditTime: 2022-12-29 16:40:15
 * @Description:
 */
import { DeleteTwoTone, DownOutlined, EditTwoTone } from "@ant-design/icons";
import { Dropdown, Modal } from "antd";
import { useAccess } from 'umi';

type ActionHandler = (() => void | boolean) | (() => Promise<void | boolean>)

type MoreBtnProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // onEdit: <Type>(current: Type) => void;
    onEdit: ActionHandler;
    onDel: ActionHandler;
    setHide: ((hide: boolean) => void) | undefined;
    // editAndDelete: <Type>(key: string | number, currentItem: Type)=>void;
    // record: Type;
}

const MoreActionBtn: React.FC<MoreBtnProps> = (props) => {
    const { onEdit, onDel, setHide } = props;

    const operationList = [
    ]

    const access = useAccess();

    if (access.canEdit) {
        operationList.push({
            key: 'edit',
            itemIcon: <EditTwoTone twoToneColor='#245cfc' />,
            label: '编辑',
        })
    }

    if (access.canDel) {
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
        if (key === 'edit') {
            onEdit();
        } else if (key === 'delete') {
            Modal.confirm({
                title: '删除警告',
                content: '确定删除该条数据吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                    onDel();
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