import { TableRow, TableCell, Table, TableBody } from "../ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactElement } from "react";

function TableCollapsible(props:{index:number,topRow:[string,string][], bottomRow:[string|ReactElement,string][], content:ReactElement, showTabs:boolean[], setShowTabs:Function}){
  return(
    <div>
      <div className="bg-zinc-100 m-3 rounded-2xl">
        <button className="w-full" onClick={()=>props.setShowTabs((curr:boolean[])=>{
          const val = !curr[props.index];
          curr.fill(false); 
          curr[props.index]=val;
          return [...curr];
        })}>
          <Table>
            <TableBody>
              <TableRow className="border-none w-full">
                {props.topRow.map((column, index)=> <TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>)}
                <TableCell className="w-[10%]" rowSpan={2}>{props.showTabs[props.index]?<ChevronDown/>:<ChevronRight/>}</TableCell>
              </TableRow>

              <TableRow className="border-none">
                {props.bottomRow.map((column,index)=><TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>)}
              </TableRow>
            </TableBody>
          </Table>
        </button>
      </div>
      {props.showTabs[props.index]?<div>{props.content}</div>:<></>}
    </div>
  )
}

export default TableCollapsible;