import { ReactElement, SetStateAction } from "react";
import { FieldValues } from "@/types/DataTypes";

type TableDataTypes = "text" | "date" | 
  "priority" | "doc-status" | "user-status" | "team-status" | "loan-status" | 
  "obj-name" | "action" | "text-field" | "doc-link";

type TableColumnData = {
  id:string, 
  heading:string,
  type:TableDataTypes, 
  headingClassName?:string
  cellClassName?:string, 
}[];

type TableSelectableType = {
  type:"row"|"checkbox"|"radio"
  selectMultiple?:boolean,
  selectedRows:string[], 
  setSelectedRows:React.Dispatch<SetStateAction<string[]>>,
  iconOverride?:ReactElement
};

type TableShowIndexType = { 
  startsAt:number, 
  heading:string, 
  headingClassName?:string, 
  cellClassName?:string 
};

type TableDocumentLinksType = {
  section:string,
  index:string|number
}[]

type CommonTableProps = {
  columnData:TableColumnData, //replacing columnIDs, dataTypes, headingClassName 
  showIndex?:TableShowIndexType,
  selectable?:TableSelectableType|undefined,
  action?:ReactElement[],  
  
  setEntityStatus?:Function, setSelectedEntity?:Function, //datatype=="team-status" and "user-status"
  setValues?:Function, //datatype=="text-field"
  documentLinks?:TableDocumentLinksType, //when linking to another page
  defaultBadges?:boolean,
}
type DataTableProps = CommonTableProps & { tableData:FieldValues[]};
type SingleRowProps = CommonTableProps & { rowIndex:number, singleRow:FieldValues};

type SingleCellProps = {
  index:number, rowIndex:number, 
  item:any, 
  columnID:string, 
  columnType:TableDataTypes, 
  cellClassName?:string, 
  defaultBadges?:boolean, isDefault?:boolean,
  documentLinks?:TableDocumentLinksType,
  setSelectedEntity?:Function, setEntityStatus?:Function, 
  setValues?:Function};

export {
  type TableDataTypes, type TableColumnData,
  type TableSelectableType, type TableShowIndexType, type TableDocumentLinksType,
  type CommonTableProps, type DataTableProps, type SingleRowProps, type SingleCellProps
}