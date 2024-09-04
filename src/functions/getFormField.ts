import { FieldAttributesList, FieldDataTypes } from "@/types/FormAttributes";

//will return the the field object of the first field of a given type in a given form or false

const getFormFieldByType = (form:FieldAttributesList, fieldType:FieldDataTypes) => {
  for (let i=0; i<form.length; i++){
    const field = form[i];
    if (field.category=="single" && field.type==fieldType)
      return field;
    else if (field.category=="grid"){
      for (let j=0; j<field.fields.length; j++){
        const gridField = field.fields[j];
        if (gridField.type==fieldType)
          return gridField;
      }
    }
  }

  return false;
}

const getFormFieldById = (form:FieldAttributesList, fieldId:string) => {
  for (let i=0; i<form.length;i++){
    const field = form[i];
    if (field.category=="single" && field.id==fieldId)
      return field;
    else if (field.category=="grid"){
      for (let j=0; j<field.fields.length; j++){
        const gridField = field.fields[j];
        if (gridField.type==fieldId)
          return gridField;
      }
    }
  }
}

export {getFormFieldByType, getFormFieldById};