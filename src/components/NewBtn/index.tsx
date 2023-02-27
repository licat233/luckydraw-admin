import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAccess } from 'umi';

type NewRecordBtnProps = {
    setVisible: (hide: boolean) => void;
}

const NewRecordBtn: React.FC<NewRecordBtnProps> = (props) => {
    const { setVisible } = props;
    const access = useAccess();

    if (!access.canNew) {
        return null;
    }

    return (
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
    );
}

export default NewRecordBtn;