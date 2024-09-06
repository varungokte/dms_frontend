import { TableRow, TableCell, Table, TableBody } from "../ui/table";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactElement } from "react";

function TableCollapsible(props:{index:number, id:string, topRow:[string,string][], bottomRow:[string|ReactElement,string][], content:ReactElement, selectedTab:number, setSelectedTab:React.Dispatch<React.SetStateAction<number>>}){
  return(
    <div>
      <div className="bg-zinc-100 m-3 rounded-2xl">
        <button className="w-full" 
          onClick={()=>{
            if (props.index==props.selectedTab) 
              props.setSelectedTab(-1);
            else
              props.setSelectedTab(props.index);
          }}
        >
          <Table>
            <TableBody>
              <TableRow className="border-none w-full">
                {props.topRow.map((column, index)=> <TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>)}
                <TableCell className="w-[10%]" rowSpan={2}>{props.selectedTab==props.index?<ExpandMoreIcon/>:<ChevronRightIcon/>}</TableCell>
              </TableRow>

              <TableRow className="border-none">
                {props.bottomRow.map((column,index)=><TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>)}
              </TableRow>
            </TableBody>
          </Table>
        </button>
      </div>
      {props.selectedTab==props.index?<div>{props.content}</div>:<></>}
    </div>
  )
}

export default TableCollapsible;