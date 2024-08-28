type FieldDataTypes = "text" | "email" | "password" | "integer" | "float" | "date" | "select" | "role" | "combobox" | "multitext" | "textarea" | "permissions" | "checkbox" | "radio" | "break" | "number";

//Form Fields
type FormFieldAttributes = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  disabled?:boolean,
  immutable?: boolean,
  hideOnEdit?:boolean,
  suppressCommas?:boolean, //for integer
  options?:string[] | readonly string[], //for select
  multiple?:boolean, //for combobox 
  newRole?:boolean //for permissions/role
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
  name: string,
  sectionClassName:string,
};

type FieldAttributesList = (SingleFieldAttributes | GridFieldAttributes | LabelFieldAttributes)[];

export {
  type FieldDataTypes,
  type FormFieldAttributes,
  type SingleFieldAttributes, type GridFieldAttributes, type LabelFieldAttributes,
  type FieldAttributesList
}