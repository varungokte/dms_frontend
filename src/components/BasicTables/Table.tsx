import {Table as MUITable} from '@mui/material';
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";

import { FieldValues } from "@/types/DataTypes";
import { DataTableProps } from "@/types/TableDataAttributes";

function DataTable(props:(DataTableProps & {className?:string, style?:FieldValues})){
  //console.log("data table props",props);
  const selectableIdList = props.tableData.map((entry,index)=>{
    if (!props.disabledRows || (props.disabledRows && !props.disabledRows[index]))
      return entry["_id"];
  });
  
  return(
    <MUITable className={`${props.className} rounded-xl border`} sx={{minWidth:700,borderRadius:"13px", ...props.style }} >
      <DataTableHead 
        headingRows={props.columnData.map(col=>col.heading)} 
        headingClassNames={props.columnData.map(col=>(col.headingClassName||""))}
        selectable={props.selectable?{...props.selectable, idList:selectableIdList}:undefined}
        tableLength={props.tableData.length}
        showIndex={props.showIndex}
        action={props.action?true:false}
        actionAtStart={props.actionAtStart}
        actionHeading={props.actionHeading}
      />
      
      <DataTableBody {...props} />
    </MUITable>
  )
}

export default DataTable;