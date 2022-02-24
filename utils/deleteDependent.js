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
      const CustomerFilter4519 = { 'addedBy': { [Op.in]: user } };
      const Customer3533 = await deleteCustomer(CustomerFilter4519);
      const CustomerFilter9927 = { 'updatedBy': { [Op.in]: user } };
      const Customer2247 = await deleteCustomer(CustomerFilter9927);
      const TaskFilter5415 = { 'completedBy': { [Op.in]: user } };
      const Task1743 = await deleteTask(TaskFilter5415);
      const TaskFilter8272 = { 'updatedBy': { [Op.in]: user } };
      const Task5541 = await deleteTask(TaskFilter8272);
      const TaskFilter8031 = { 'addedBy': { [Op.in]: user } };
      const Task7468 = await deleteTask(TaskFilter8031);
      const ToDoFilter3306 = { 'addedBy': { [Op.in]: user } };
      const ToDo5265 = await deleteToDo(ToDoFilter3306);
      const ToDoFilter5758 = { 'updatedBy': { [Op.in]: user } };
      const ToDo6883 = await deleteToDo(ToDoFilter5758);
      const userFilter5870 = { 'addedBy': { [Op.in]: user } };
      const user2376 = await deleteUser(userFilter5870);
      const userFilter8270 = { 'updatedBy': { [Op.in]: user } };
      const user3671 = await deleteUser(userFilter8270);
      const userAuthSettingsFilter2827 = { 'userId': { [Op.in]: user } };
      const userAuthSettings9627 = await deleteUserAuthSettings(userAuthSettingsFilter2827);
      const userTokenFilter4397 = { 'userId': { [Op.in]: user } };
      const userToken7792 = await deleteUserToken(userTokenFilter4397);
      const userRoleFilter3648 = { 'userId': { [Op.in]: user } };
      const userRole7337 = await deleteUserRole(userRoleFilter3648);
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
      const routeRoleFilter7232 = { 'roleId': { [Op.in]: role } };
      const routeRole0049 = await deleteRouteRole(routeRoleFilter7232);
      const userRoleFilter7784 = { 'roleId': { [Op.in]: role } };
      const userRole4152 = await deleteUserRole(userRoleFilter7784);
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
      const routeRoleFilter2376 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole7907 = await deleteRouteRole(routeRoleFilter2376);
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
      const CustomerFilter4687 = { 'addedBy': { [Op.in]: user } };
      const Customer3822 = await softDeleteCustomer(CustomerFilter4687,updateBody);
      const CustomerFilter3632 = { 'updatedBy': { [Op.in]: user } };
      const Customer8092 = await softDeleteCustomer(CustomerFilter3632,updateBody);
      const TaskFilter5809 = { 'completedBy': { [Op.in]: user } };
      const Task6679 = await softDeleteTask(TaskFilter5809,updateBody);
      const TaskFilter4230 = { 'updatedBy': { [Op.in]: user } };
      const Task3246 = await softDeleteTask(TaskFilter4230,updateBody);
      const TaskFilter3922 = { 'addedBy': { [Op.in]: user } };
      const Task9209 = await softDeleteTask(TaskFilter3922,updateBody);
      const ToDoFilter8353 = { 'addedBy': { [Op.in]: user } };
      const ToDo6000 = await softDeleteToDo(ToDoFilter8353,updateBody);
      const ToDoFilter9609 = { 'updatedBy': { [Op.in]: user } };
      const ToDo8647 = await softDeleteToDo(ToDoFilter9609,updateBody);
      const userFilter9610 = { 'addedBy': { [Op.in]: user } };
      const user3258 = await softDeleteUser(userFilter9610,updateBody);
      const userFilter2257 = { 'updatedBy': { [Op.in]: user } };
      const user3673 = await softDeleteUser(userFilter2257,updateBody);
      const userAuthSettingsFilter1027 = { 'userId': { [Op.in]: user } };
      const userAuthSettings2693 = await softDeleteUserAuthSettings(userAuthSettingsFilter1027,updateBody);
      const userTokenFilter7050 = { 'userId': { [Op.in]: user } };
      const userToken0985 = await softDeleteUserToken(userTokenFilter7050,updateBody);
      const userRoleFilter6555 = { 'userId': { [Op.in]: user } };
      const userRole1111 = await softDeleteUserRole(userRoleFilter6555,updateBody);
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
      const routeRoleFilter6496 = { 'roleId': { [Op.in]: role } };
      const routeRole1535 = await softDeleteRouteRole(routeRoleFilter6496,updateBody);
      const userRoleFilter3664 = { 'roleId': { [Op.in]: role } };
      const userRole5073 = await softDeleteUserRole(userRoleFilter3664,updateBody);
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
      const routeRoleFilter9506 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole2688 = await softDeleteRouteRole(routeRoleFilter9506,updateBody);
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
