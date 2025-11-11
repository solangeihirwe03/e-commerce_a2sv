import db from "../../../database/models";

const userFindAllOrders= async(userId:string)=>{
    await db.Orders.findAll({
    where: { userId },
    attributes: ['id', 'status', 'totalPrice', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });
}

export default {
    userFindAllOrders
}