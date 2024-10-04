import { adminEnteredMasters } from '@/Constants';
import DataTableHead from './DataTableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function TableSelect(props:{tableHeading:string, tableValues:string[], selected:string, setSelected:Function, className:string,textSize:"large"|"medium"}){
  return (
    <div className={props.className}>
      <Table className="bg-white rounded-xl" >
        <DataTableHead headingRows={[props.tableHeading]} headingClassNames={[props.textSize=="large"?"text-2xl":"text-lg"]} />
        <TableBody className="border-none hover:cursor-pointer">
          {props.tableValues.map((category, index)=>{
            return (
              <TableRow key={index} className="border-none">
                <TableCell className={`${props.textSize=="large"?"text-xl":"text-md"} hover:text-blue-500 ${props.selected===category?"text-blue-600 bg-slate-200":""}`} onClick={()=>props.setSelected(category)}>
                  <p className="text-lg">{Object.keys(adminEnteredMasters)[Object.values(adminEnteredMasters).indexOf(category)]}</p>
                </TableCell>
              </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}

export default TableSelect;