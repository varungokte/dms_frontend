import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { TableRow, TableCell, Table, TableBody } from "../ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

function TableCollapsible(props:{topRow:Array<any>, bottomRow:Array<any>, content:any, searchString:string}){
  const [chevronToggle, setChevronToggle] = useState(false);
  
  return(
    <Collapsible>
      <div className="bg-zinc-100 m-3 rounded-2xl">
        {props.searchString=="" || props.topRow[0][0]==props.searchString
          ?<CollapsibleTrigger className="w-full" onClick={()=>setChevronToggle((curr:any)=>{return !curr})}>
          <Table>
            <TableBody>
              <TableRow className="border-none w-full">
                {props.topRow.map((column:any, index:number)=>{
                  return <TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>
                })}
                <TableCell className="w-[10%]" rowSpan={2}>{chevronToggle?<ChevronDown/>:<ChevronRight/>}</TableCell>
              </TableRow>

              <TableRow className="border-none">
                {props.bottomRow.map((column:any,index:number)=>{
                  return <TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>
                })}
              </TableRow>
            </TableBody>
          </Table>
        </CollapsibleTrigger>
          :<></>}
      </div>
      <CollapsibleContent>
        {props.content}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default TableCollapsible;