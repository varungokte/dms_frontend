type FieldType = "text" | "email" | "password" | "select" | "role" | "combobox" | "multitext"| "date" | "textarea" ;

type FormFieldsCommon = {
  id:string,
  name:string,
  type: FieldType
  required?: boolean,
  immutable?: boolean,
  options?:string[],
  multiple?:boolean,
}

type FormSingleFieldDetails = FormFieldsCommon & {category:"single"}

type FormGridFieldDetails = {
  category:"grid",
  row:number,
  sectionName?:string,
  sectionClassName?:string
  fields: FormFieldsCommon[]
}

type FormLabelFieldDetails = {
  category:"label", 
  name: string,
  sectionClassName:string,
}


type FormFieldDetails = (FormGridFieldDetails | FormSingleFieldDetails | FormLabelFieldDetails)[]

export {type FormFieldDetails}