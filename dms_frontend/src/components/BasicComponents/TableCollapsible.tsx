import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { TableRow, TableCell } from "../ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

function TableCollapsible(props:any){
  const [chevronToggle, setChevronToggle] = useState(false);
  return(
    <Collapsible>
      <div className="bg-zinc-100 m-3 rounded-2xl">
        <CollapsibleTrigger className="w-full" 
          onClick={()=>setChevronToggle((curr:any)=>{return !curr})}>
          <TableRow className="border-none">
            {props.topRow.map((column:any)=>{
              return <TableCell className={`w-${column[1]} ${column[2]}`}>{column[0]}</TableCell>
            })}
            <TableCell className="w-[10%]" rowSpan={2}>{chevronToggle?<ChevronDown/>:<ChevronRight/>}</TableCell>
          </TableRow>

          <TableRow className="border-none">
            {props.bottomRow.map((column:any)=>{
              return <TableCell className={column[1]}>{column[0]}</TableCell>
            })}
          </TableRow>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {props.content}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default TableCollapsible;

/* 
props:
  topRow=[["Heading Name", width, styling class names]]
  bottomRow
  content={<SingleRowDocument />}
*/
