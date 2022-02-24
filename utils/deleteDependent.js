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
      const CustomerFilter2654 = { 'addedBy': { [Op.in]: user } };
      const Customer6834 = await deleteCustomer(CustomerFilter2654);
      const CustomerFilter3429 = { 'updatedBy': { [Op.in]: user } };
      const Customer5763 = await deleteCustomer(CustomerFilter3429);
      const TaskFilter3143 = { 'completedBy': { [Op.in]: user } };
      const Task7025 = await deleteTask(TaskFilter3143);
      const TaskFilter8327 = { 'updatedBy': { [Op.in]: user } };
      const Task3808 = await deleteTask(TaskFilter8327);
      const TaskFilter8705 = { 'addedBy': { [Op.in]: user } };
      const Task3511 = await deleteTask(TaskFilter8705);
      const ToDoFilter9102 = { 'addedBy': { [Op.in]: user } };
      const ToDo1414 = await deleteToDo(ToDoFilter9102);
      const ToDoFilter2394 = { 'updatedBy': { [Op.in]: user } };
      const ToDo9937 = await deleteToDo(ToDoFilter2394);
      const userFilter0617 = { 'addedBy': { [Op.in]: user } };
      const user7363 = await deleteUser(userFilter0617);
      const userFilter5352 = { 'updatedBy': { [Op.in]: user } };
      const user5953 = await deleteUser(userFilter5352);
      const userAuthSettingsFilter7794 = { 'userId': { [Op.in]: user } };
      const userAuthSettings7073 = await deleteUserAuthSettings(userAuthSettingsFilter7794);
      const userTokenFilter5962 = { 'userId': { [Op.in]: user } };
      const userToken7938 = await deleteUserToken(userTokenFilter5962);
      const userRoleFilter7802 = { 'userId': { [Op.in]: user } };
      const userRole0480 = await deleteUserRole(userRoleFilter7802);
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
      const routeRoleFilter0968 = { 'roleId': { [Op.in]: role } };
      const routeRole7609 = await deleteRouteRole(routeRoleFilter0968);
      const userRoleFilter8893 = { 'roleId': { [Op.in]: role } };
      const userRole3357 = await deleteUserRole(userRoleFilter8893);
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
      const routeRoleFilter5419 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole3817 = await deleteRouteRole(routeRoleFilter5419);
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
      const CustomerFilter4148 = { 'addedBy': { [Op.in]: user } };
      const Customer1027 = await softDeleteCustomer(CustomerFilter4148,updateBody);
      const CustomerFilter9921 = { 'updatedBy': { [Op.in]: user } };
      const Customer0376 = await softDeleteCustomer(CustomerFilter9921,updateBody);
      const TaskFilter4563 = { 'completedBy': { [Op.in]: user } };
      const Task0301 = await softDeleteTask(TaskFilter4563,updateBody);
      const TaskFilter7335 = { 'updatedBy': { [Op.in]: user } };
      const Task2116 = await softDeleteTask(TaskFilter7335,updateBody);
      const TaskFilter1983 = { 'addedBy': { [Op.in]: user } };
      const Task4233 = await softDeleteTask(TaskFilter1983,updateBody);
      const ToDoFilter6136 = { 'addedBy': { [Op.in]: user } };
      const ToDo6932 = await softDeleteToDo(ToDoFilter6136,updateBody);
      const ToDoFilter1510 = { 'updatedBy': { [Op.in]: user } };
      const ToDo0766 = await softDeleteToDo(ToDoFilter1510,updateBody);
      const userFilter6527 = { 'addedBy': { [Op.in]: user } };
      const user7624 = await softDeleteUser(userFilter6527,updateBody);
      const userFilter4763 = { 'updatedBy': { [Op.in]: user } };
      const user8244 = await softDeleteUser(userFilter4763,updateBody);
      const userAuthSettingsFilter7676 = { 'userId': { [Op.in]: user } };
      const userAuthSettings0694 = await softDeleteUserAuthSettings(userAuthSettingsFilter7676,updateBody);
      const userTokenFilter2472 = { 'userId': { [Op.in]: user } };
      const userToken6223 = await softDeleteUserToken(userTokenFilter2472,updateBody);
      const userRoleFilter6739 = { 'userId': { [Op.in]: user } };
      const userRole6186 = await softDeleteUserRole(userRoleFilter6739,updateBody);
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
      const routeRoleFilter1047 = { 'roleId': { [Op.in]: role } };
      const routeRole0437 = await softDeleteRouteRole(routeRoleFilter1047,updateBody);
      const userRoleFilter5891 = { 'roleId': { [Op.in]: role } };
      const userRole6718 = await softDeleteUserRole(userRoleFilter5891,updateBody);
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
      const routeRoleFilter3006 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole5360 = await softDeleteRouteRole(routeRoleFilter3006,updateBody);
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
