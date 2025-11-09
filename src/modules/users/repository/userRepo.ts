import Users from "../../../database/models/users";

const createUser= async(body: any)=>{ 
    const user = await Users.create(body);
    const { password, ...safeUser } = user.get({ plain: true });
    return safeUser
};

const findUserByAttributes = async(key: string, value: any)=>{
    return await Users.findOne({where: {[key]: value}})
}

export default {
    createUser,
    findUserByAttributes
}