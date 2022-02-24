/**
 * ToDoController.js
 * @description :: exports action methods for ToDo.
 */

const { Op } = require('sequelize');
const ToDo = require('../../../model/ToDo');
const ToDoSchemaKey = require('../../../utils/validation/ToDoValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of ToDo in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created ToDo. {status, message, data}
 */ 
const addToDo = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      ToDoSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(ToDo,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : find all records of ToDo from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found ToDo(s). {status, message, data}
 */
const findAllToDo = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ToDoSchemaKey.findFilterKeys,
      ToDo.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    let result;
    if (req.body.query !== undefined) {
      query = { ...req.body.query };
    }
    query = dbService.queryBuilderParser(query);
    if (req.body && req.body.isCountOnly){
      result = await dbService.count(ToDo, query);
      if (result) {
        result = { totalRecords: result };
        return res.ok({ data :result });
      } 
      return res.recordNotFound();
    }
    else {
      if (req.body && req.body.options !== undefined) {
        options = { ...req.body.options };
      }
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = dbService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }
      if (options && options.sort){
        options.order = dbService.sortParser(options.sort);
        delete options.sort;
      }
      result = await dbService.findMany( ToDo,query,options);
            
      if (!result){
        return res.recordNotFound();
      }
      return res.ok({ data:result });   
    }
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of ToDo.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getToDoCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ToDoSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(ToDo,where);
    if (result){
      result = { totalRecords:result };
      return res.ok({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of ToDo from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of ToDo.
 * @return {obj} : number of deactivated documents of ToDo. {status, message, data}
 */
const softDeleteManyToDo = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = { isDeleted: true, };
      const options = {};
      let result = await dbService.softDeleteMany(ToDo,query,updateBody, options);
      if (!result) {
        return res.recordNotFound();
      }
      return  res.ok({ data :result });
    }
    return res.badRequest();
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : create multiple records of ToDo in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created ToDos. {status, message, data}
 */
const bulkInsertToDo = async (req, res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;
      data = data.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item = {
          ...{ addedBy : req.user.id },
          ...item
        };
        return item;
      });        
      let result = await dbService.createMany(ToDo,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of ToDo with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ToDos.
 * @return {obj} : updated ToDos. {status, message, data}
 */
const bulkUpdateToDo = async (req, res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = { ...req.body.data };
            
      let result = await dbService.updateMany(ToDo,filter,data);
      if (!result){
        return res.recordNotFound();
      }

      return  res.ok({ data :result });
    }
    else {
      return res.failureResponse();
    }
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : delete records of ToDo in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyToDo = async (req, res) => {
  try {
    let ids = req.body.ids; 
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      let result = await dbService.deleteMany(ToDo,query);
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : deactivate record of ToDo from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of ToDo.
 * @return {obj} : deactivated ToDo. {status, message, data}
 */
const softDeleteToDo = async (req, res) => {
  try {
    let query = { id:req.params.id };
    const updateBody = { isDeleted: true, };
    const options = {};
    let result = await dbService.softDeleteMany(ToDo, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of ToDo with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ToDo.
 * @return {obj} : updated ToDo. {status, message, data}
 */
const partialUpdateToDo = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      ToDoSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(ToDo, query, data);
    if (!result) {
      return res.recordNotFound();
    }
        
    return res.ok({ data :result });
        
  }
  catch (error){
    return res.failureResponse();
  }
};

/**
 * @description : update record of ToDo with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ToDo.
 * @return {obj} : updated ToDo. {status, message, data}
 */
const updateToDo = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      ToDoSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(ToDo,query,data);
    if (!result){
      return res.recordNotFound();
    }

    return  res.ok({ data :result });
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : find record of ToDo from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found ToDo. {status, message, data}
 */
const getToDo = async (req, res) => {
  try {
    let query = {};
    const options = {};
    if (req.body && req.body.select && req.body.select.length) {
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        ToDoSchemaKey.findFilterKeys,
        ToDo.tableAttributes
      );
      if (!validateRequest.isValid) {
        return res.inValidParam({ message: `${validateRequest.message}` });
      }
      options.attributes = req.body.select;
    }
    if (req.body && req.body.include && req.body.include.length) {
      let include = [];
      req.body.include.forEach(i => {
        i.model = models[i.model];
        if (i.query) {
          i.where = dbService.queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    let id = req.params.id;
    let result = await dbService.findByPk(ToDo,id,options);
    if (result){
      return  res.ok({ data :result });
            
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse();
  }
};

/**
 * @description : delete record of ToDo from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted ToDo. {status, message, data}
 */
const deleteToDo = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(ToDo, req.params.id);
    if (result){
      return  res.ok({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

module.exports = {
  addToDo,
  findAllToDo,
  getToDoCount,
  softDeleteManyToDo,
  bulkInsertToDo,
  bulkUpdateToDo,
  deleteManyToDo,
  softDeleteToDo,
  partialUpdateToDo,
  updateToDo,
  getToDo,
  deleteToDo,
};
