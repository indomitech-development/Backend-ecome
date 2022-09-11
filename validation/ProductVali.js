const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegister(data) {
    let errors = {};




    // data.product_code = !isEmpty(data.product_code) ? data.product_code : '';
    data.product_name = !isEmpty(data.product_name) ? data.product_name : '';
    data.product_categorie = !isEmpty(data.product_categorie) ? data.product_categorie : '';
    data.product_price = !isEmpty(data.product_price) ? data.product_price : '';
    data.product_description = !isEmpty(data.product_description) ? data.product_description : "";
    data.product_size =!isEmpty(data.product_size) ? data.product_size: "";
    // data.picture = isEmpty( data.picture ) ? data.picture :"";
    // data.specil =!isEmpty(data.specil) ? data.specil: "";
    // data.joinAs =!isEmpty(data.joinAs) ? data.joinAs: "";
    data.available_quantity =!isEmpty(data.available_quantity) ? data.available_quantity: "";


    // if(Validator.isEmpty(data.product_code)) {
    //     errors.product_code = 'Name field is required';
    // }
    

    if(!Validator.isLength(data.product_name, { min: 2, max: 30 })) {
        errors.product_name = 'Name must be between 2 to 30 chars';
    }
    
    if(Validator.isEmpty(data.product_name)) {
        errors.product_name = 'Name field is required';
    }
   
    
    if(Validator.isEmpty(data.product_categorie)) {
        errors.product_categorie = 'Catagory field is required';
    }

    if(Validator.isEmpty(data.product_price)) {
        errors.product_price = 'Price field is required';
    }
    
  
    
    if(Validator.isEmpty(data.product_description)) {
        errors.product_description = 'Description  field is required';
    }

    
    
    if(Validator.isEmpty(data.product_size)) {
        errors.product_size = 'Size field is required';
    }

     
    if(Validator.isEmpty(data.available_quantity)) {
        errors.available_quantity = 'Quanity field is required';
    }
    
    // if(Validator.isEmpty(data.picture)) {
    //     errors.picture = 'Picture field is required';
    // }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}