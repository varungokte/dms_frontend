type FormFieldsCommon = {
  id:string,
  name:string,
  type: "text" | "email" | "password" | "number" | "date" | "select" | "role" | "combobox" | "multitext"| "textarea"
  required?: boolean,
  immutable?: boolean,
  options?:string[],
  multiple?:boolean,
}

type FormSingleFieldDetails = {category:"single"} & FormFieldsCommon

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

type FieldValues = {
  [key:string]: string | number | Date | null
}

type TableDataTypes = (
  "index" | "text" | "date" | 
  "priority" | "frequency" |
  "docStatus" | "userStatus" | "teamStatus" | 
  "role" | "zone" | 
  "ratingAgency" | "ratingType" | "ratingOutlook"| 
  "transaction" | "file" | 
  "objName" | "action" | "countTeam"
)[]

type FormFieldDetails = (FormSingleFieldDetails | FormGridFieldDetails | FormLabelFieldDetails)[]

export {
  type FormFieldDetails,
  type TableDataTypes,
  type FieldValues
}