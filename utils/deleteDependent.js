/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Customer = require('../model/Customer');
let Task = require('../model/Task');
let ToDo = require('../model/ToDo');
let User = require('../model/user');
let UserAuthSettings = require('../model/userAuthSettings');
let UserToken = require('../model/userToken');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');
const { Op } = require('sequelize');

const deleteCustomer = async (filter) =>{
  try {
    return await Customer.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTask = async (filter) =>{
  try {
    return await Task.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteToDo = async (filter) =>{
  try {
    return await ToDo.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const CustomerFilter3829 = { 'addedBy': { [Op.in]: user } };
      const Customer7467 = await deleteCustomer(CustomerFilter3829);
      const CustomerFilter7327 = { 'updatedBy': { [Op.in]: user } };
      const Customer0384 = await deleteCustomer(CustomerFilter7327);
      const TaskFilter3813 = { 'completedBy': { [Op.in]: user } };
      const Task2620 = await deleteTask(TaskFilter3813);
      const TaskFilter9577 = { 'updatedBy': { [Op.in]: user } };
      const Task2753 = await deleteTask(TaskFilter9577);
      const TaskFilter6004 = { 'addedBy': { [Op.in]: user } };
      const Task9514 = await deleteTask(TaskFilter6004);
      const ToDoFilter9779 = { 'addedBy': { [Op.in]: user } };
      const ToDo7979 = await deleteToDo(ToDoFilter9779);
      const ToDoFilter7924 = { 'updatedBy': { [Op.in]: user } };
      const ToDo4357 = await deleteToDo(ToDoFilter7924);
      const userFilter3039 = { 'addedBy': { [Op.in]: user } };
      const user9712 = await deleteUser(userFilter3039);
      const userFilter5225 = { 'updatedBy': { [Op.in]: user } };
      const user1743 = await deleteUser(userFilter5225);
      const userAuthSettingsFilter9688 = { 'userId': { [Op.in]: user } };
      const userAuthSettings0949 = await deleteUserAuthSettings(userAuthSettingsFilter9688);
      const userTokenFilter6893 = { 'userId': { [Op.in]: user } };
      const userToken3585 = await deleteUserToken(userTokenFilter6893);
      const userRoleFilter4944 = { 'userId': { [Op.in]: user } };
      const userRole3790 = await deleteUserRole(userRoleFilter4944);
      return await User.destroy({ where :filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    return await UserAuthSettings.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    return await UserToken.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter0932 = { 'roleId': { [Op.in]: role } };
      const routeRole5864 = await deleteRouteRole(routeRoleFilter0932);
      const userRoleFilter5123 = { 'roleId': { [Op.in]: role } };
      const userRole4883 = await deleteUserRole(userRoleFilter5123);
      return await Role.destroy({ where :filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter4010 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9038 = await deleteRouteRole(routeRoleFilter4010);
      return await ProjectRoute.destroy({ where :filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const countCustomer = async (filter) =>{
  try {
    const CustomerCnt =  await Customer.count(filter);
    return { Customer : CustomerCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countTask = async (filter) =>{
  try {
    const TaskCnt =  await Task.count(filter);
    return { Task : TaskCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countToDo = async (filter) =>{
  try {
    const ToDoCnt =  await ToDo.count(filter);
    return { ToDo : ToDoCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const CustomerFilter = { [Op.or]: [{                    addedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } }] };
      const CustomerCnt =  await dbService.count(Customer,CustomerFilter);

      const TaskFilter = { [Op.or]: [{                    completedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } },{                    addedBy : { [Op.in] : user } }] };
      const TaskCnt =  await dbService.count(Task,TaskFilter);

      const ToDoFilter = { [Op.or]: [{                    addedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } }] };
      const ToDoCnt =  await dbService.count(ToDo,ToDoFilter);

      const userFilter = { [Op.or]: [{                    addedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const userAuthSettingsFilter = { [Op.or]: [{                    userId : { [Op.in] : user } }] };
      const userAuthSettingsCnt =  await dbService.count(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{                    userId : { [Op.in] : user } }] };
      const userTokenCnt =  await dbService.count(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{                    userId : { [Op.in] : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        Customer : CustomerCnt,
        Task : TaskCnt,
        ToDo : ToDoCnt,
        user : userCnt,
        userAuthSettings : userAuthSettingsCnt,
        userToken : userTokenCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count(filter);
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count(filter);
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{                    roleId : { [Op.in] : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{                    roleId : { [Op.in] : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{                    routeId : { [Op.in] : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.count(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCustomer = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Customer.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTask = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Task.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteToDo = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await ToDo.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const CustomerFilter3580 = { 'addedBy': { [Op.in]: user } };
      const Customer5969 = await softDeleteCustomer(CustomerFilter3580,updateBody);
      const CustomerFilter7068 = { 'updatedBy': { [Op.in]: user } };
      const Customer2169 = await softDeleteCustomer(CustomerFilter7068,updateBody);
      const TaskFilter4277 = { 'completedBy': { [Op.in]: user } };
      const Task2836 = await softDeleteTask(TaskFilter4277,updateBody);
      const TaskFilter9631 = { 'updatedBy': { [Op.in]: user } };
      const Task5053 = await softDeleteTask(TaskFilter9631,updateBody);
      const TaskFilter7255 = { 'addedBy': { [Op.in]: user } };
      const Task3782 = await softDeleteTask(TaskFilter7255,updateBody);
      const ToDoFilter0925 = { 'addedBy': { [Op.in]: user } };
      const ToDo5550 = await softDeleteToDo(ToDoFilter0925,updateBody);
      const ToDoFilter7136 = { 'updatedBy': { [Op.in]: user } };
      const ToDo4079 = await softDeleteToDo(ToDoFilter7136,updateBody);
      const userFilter9472 = { 'addedBy': { [Op.in]: user } };
      const user9335 = await softDeleteUser(userFilter9472,updateBody);
      const userFilter4964 = { 'updatedBy': { [Op.in]: user } };
      const user0949 = await softDeleteUser(userFilter4964,updateBody);
      const userAuthSettingsFilter8407 = { 'userId': { [Op.in]: user } };
      const userAuthSettings9597 = await softDeleteUserAuthSettings(userAuthSettingsFilter8407,updateBody);
      const userTokenFilter5453 = { 'userId': { [Op.in]: user } };
      const userToken5181 = await softDeleteUserToken(userTokenFilter5453,updateBody);
      const userRoleFilter9564 = { 'userId': { [Op.in]: user } };
      const userRole8390 = await softDeleteUserRole(userRoleFilter9564,updateBody);
      return await User.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserAuthSettings.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserToken.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter4620 = { 'roleId': { [Op.in]: role } };
      const routeRole2719 = await softDeleteRouteRole(routeRoleFilter4620,updateBody);
      const userRoleFilter9643 = { 'roleId': { [Op.in]: role } };
      const userRole1817 = await softDeleteUserRole(userRoleFilter9643,updateBody);
      return await Role.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter5578 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole5894 = await softDeleteRouteRole(routeRoleFilter5578,updateBody);
      return await ProjectRoute.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await RouteRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteCustomer,
  deleteTask,
  deleteToDo,
  deleteUser,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countCustomer,
  countTask,
  countToDo,
  countUser,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteCustomer,
  softDeleteTask,
  softDeleteToDo,
  softDeleteUser,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
