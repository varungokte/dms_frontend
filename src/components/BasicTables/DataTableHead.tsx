import {TableCell, TableHead, TableRow} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { TableSelectableType, TableShowIndexType } from '@/types/TableDataAttributes';

function DataTableHead(props:{headingRows:string[], headingClassNames?:string[], selectable?:TableSelectableType&{idList:string[]}, tableLength?:number, showIndex?:TableShowIndexType, action?:boolean}){
  const handleSelectAll = () => {
    if (!props.selectable)
      return;
    
    if (props.selectable.selectedRows.length!==0)
      props.selectable.setSelectedRows([]);
    else
      props.selectable.setSelectedRows([...props.selectable.idList]);
  }
  
  return(
    <TableHead>
      <TableRow>
        {props.selectable && props.selectable.type=="checkbox"
          ?<TableCell>
            <Checkbox 
              color="secondary" 
              checked={props.selectable.selectedRows.length!=0} 
              indeterminate={!(props.selectable.selectedRows.length==0 || props.selectable.selectedRows.length==props.selectable.idList.length)} 
              onChange={handleSelectAll}
            />
          </TableCell>
          :<></>
        }
        {props.selectable && props.selectable.type=="radio"?<TableCell></TableCell>:<></>}
        {props.showIndex
          ?<TableCell className={props.showIndex.headingClassName}>
            <div className={props.showIndex.headingClassName}>{props.showIndex.heading}</div>
          </TableCell>
          :<></>
        }
        {props.headingRows.map((heading,index)=>{
          return <TableCell key={index}>
            <div className={(props.headingClassNames && props.headingClassNames[index])?props.headingClassNames[index]:""}>{heading}</div>
          </TableCell>
        })}
        {props.action?<TableCell>Action</TableCell>:<></>}
      </TableRow>
    </TableHead>
  )
}

export default DataTableHead;