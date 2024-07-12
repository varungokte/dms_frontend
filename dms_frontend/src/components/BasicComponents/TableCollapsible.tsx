import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { TableRow, TableCell, Table, TableBody } from "../ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactElement, useState } from "react";

function TableCollapsible(props:{index:number,topRow:[string,string][], bottomRow:[string|ReactElement,string][], content:ReactElement, searchString:string, showDeals:boolean[], setShowDeals:Function}){
  //console.log("table collapse",props.index, props.showDeals)
  const [chevronToggle, setChevronToggle] = useState(false);
  return(
    <Collapsible>
      <div className="bg-zinc-100 m-3 rounded-2xl">
        {props.searchString=="" || props.topRow[0][0]==props.searchString
          ?<CollapsibleTrigger className="w-full" onClick={()=>setChevronToggle(curr=>!curr)} /* onClick={()=>props.setShowDeals((curr:boolean[])=>{
            const val = !curr[props.index];
            curr.fill(false); 
            curr[props.index]=val;
            return [...curr];
          })} */>
            <Table>
              <TableBody>
                <TableRow className="border-none w-full">
                  {props.topRow.map((column, index)=>{
                    return <TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>
                  })}
                  <TableCell className="w-[10%]" rowSpan={2}>{/* props.showDeals[props.index] */chevronToggle?<ChevronDown/>:<ChevronRight/>}</TableCell>
                </TableRow>

                <TableRow className="border-none">
                  {props.bottomRow.map((column,index)=><TableCell key={index} className={`${column[1]}`}>{column[0]}</TableCell>)}
                </TableRow>
              </TableBody>
            </Table>
          </CollapsibleTrigger>
          :<></>
        }
      </div>
      {/* {props.showDeals[props.index]
        ? */}<CollapsibleContent>{props.content}</CollapsibleContent>
        {/* :<></>
      } */}
    </Collapsible>
  )
}

export default TableCollapsible;