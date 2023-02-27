
export type PrizeDetailInfo = {
    index: number;
    id: number;  //奖品id
    uuid: string;
    activityId: number;
    key: number | string;
    name: string; //奖品名
    image: string; //图片
    price: number; //价格
    grade: string; //级别
    prob: number; //幸运值
    quantity: number; //总数量
    count: number; //已抽数量
    isWin: number; //是否中奖
}
