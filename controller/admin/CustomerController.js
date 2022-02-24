/**
 * CustomerController.js
 * @description :: exports action methods for Customer.
 */

const { Op } = require('sequelize');
const Customer = require('../../model/Customer');
const CustomerSchemaKey = require('../../utils/validation/CustomerValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of Customer in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created Customer. {status, message, data}
 */ 
const addCustomer = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      CustomerSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(Customer,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : find all records of Customer from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found Customer(s). {status, message, data}
 */
const findAllCustomer = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CustomerSchemaKey.findFilterKeys,
      Customer.tableAttributes
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
      result = await dbService.count(Customer, query);
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
      result = await dbService.findMany( Customer,query,options);
            
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
 * @description : returns total number of records of Customer.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getCustomerCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CustomerSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(Customer,where);
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
 * @description : deactivate multiple records of Customer from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of Customer.
 * @return {obj} : number of deactivated documents of Customer. {status, message, data}
 */
const softDeleteManyCustomer = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = { isDeleted: true, };
      const options = {};
      let result = await dbService.softDeleteMany(Customer,query,updateBody, options);
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
 * @description : create multiple records of Customer in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created Customers. {status, message, data}
 */
const bulkInsertCustomer = async (req, res)=>{
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
      let result = await dbService.createMany(Customer,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Customer with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Customers.
 * @return {obj} : updated Customers. {status, message, data}
 */
const bulkUpdateCustomer = async (req, res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = { ...req.body.data };
            
      let result = await dbService.updateMany(Customer,filter,data);
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
 * @description : delete records of Customer in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyCustomer = async (req, res) => {
  try {
    let ids = req.body.ids; 
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      let result = await dbService.deleteMany(Customer,query);
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : deactivate record of Customer from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of Customer.
 * @return {obj} : deactivated Customer. {status, message, data}
 */
const softDeleteCustomer = async (req, res) => {
  try {
    let query = { id:req.params.id };
    const updateBody = { isDeleted: true, };
    const options = {};
    let result = await dbService.softDeleteMany(Customer, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of Customer with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Customer.
 * @return {obj} : updated Customer. {status, message, data}
 */
const partialUpdateCustomer = async (req, res) => {
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
      CustomerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(Customer, query, data);
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
 * @description : update record of Customer with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Customer.
 * @return {obj} : updated Customer. {status, message, data}
 */
const updateCustomer = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      CustomerSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(Customer,query,data);
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
 * @description : find record of Customer from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found Customer. {status, message, data}
 */
const getCustomer = async (req, res) => {
  try {
    let query = {};
    const options = {};
    if (req.body && req.body.select && req.body.select.length) {
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        CustomerSchemaKey.findFilterKeys,
        Customer.tableAttributes
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
    let result = await dbService.findByPk(Customer,id,options);
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
 * @description : delete record of Customer from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted Customer. {status, message, data}
 */
const deleteCustomer = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Customer, req.params.id);
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
  addCustomer,
  findAllCustomer,
  getCustomerCount,
  softDeleteManyCustomer,
  bulkInsertCustomer,
  bulkUpdateCustomer,
  deleteManyCustomer,
  softDeleteCustomer,
  partialUpdateCustomer,
  updateCustomer,
  getCustomer,
  deleteCustomer,
};
