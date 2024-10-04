import { ReactElement } from "react";

type FieldDataTypes = 
  "text" | "email" | "password" | "textarea" | 
  "integer" | "float" | "number" |
  "date" | "select" | "radio" | "checkbox" | 
  "permissions" | "role" | 
  "combobox" | "multitext" | 
  "break";

//Form Fields
type FormFieldAttributes = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  disabled?:boolean,
  readonly?:boolean,
  immutable?: boolean,
  hideOnEdit?:boolean,
  suppressCommas?:boolean, //for integer
  options?:string[] | readonly string[], //for select
  multiple?:boolean, //for combobox 
  newRole?:boolean, //for permissions/role
  permissionId?:string, //for role
  placeholder?:string, //for combobox
};

type SingleFieldAttributes = {category:"single"} & FormFieldAttributes;

type GridFieldAttributes = {
  category:"grid",
  row:number,
  sectionName?:string,
  sectionClassName?:string,
  customWidth?:string,
  fields: FormFieldAttributes[]
};

type LabelFieldAttributes = {
  category:"label", 
  name: string|ReactElement,
  sectionClassName:string,
};

type FieldAttributesList = (SingleFieldAttributes | GridFieldAttributes | LabelFieldAttributes)[];

export {
  type FieldDataTypes,
  type FormFieldAttributes,
  type SingleFieldAttributes, type GridFieldAttributes, type LabelFieldAttributes,
  type FieldAttributesList
}