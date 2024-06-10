import { TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { PriorityValues, PriorityStyling,DocumentStatusValues, DocumentStatusStyling, UserStatusValues, UserStatusStyling, UserRoles, RatingTypes, RatingOutlook, RatingAgencies, ZoneList, EnumIteratorValues, FrequencyType, TransactionDocumentTypes, FileTypes, TeamStatusStyling, TeamStatusValues } from "./Constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";

import chevron_down from "./../static/chevron-down.svg";
import moment from "moment";
import { ReactElement } from "react";
import { TableDataTypes } from "DataTypes";

function HeaderRows(props:{headingRows:string[], headingClassNames?:string[]}){
  return(
    <TableHeader>
      <TableRow>
      {props.headingRows.map((heading:any,index:number)=>{
        return <TableHead key={index} className={(props.headingClassNames && props.headingClassNames[index])?props.headingClassNames[index]:""}>{heading}</TableHead>
      })}
      </TableRow>
    </TableHeader>
  )
}

function BodyRowsMapping(props:{list:any, columns:string[], cellClassName?:string[], searchRows:any, filterRows:any, dataType:TableDataTypes, action?:(HTMLElement|ReactElement)[], setEntityStatus?:Function, setSelectedEntity?:Function}){
  return(
    <TableBody>
      {props.list.map((singleRow:any, index:number)=>{
        let searchValid = true;
        if (props.searchRows.length>0){
          searchValid = false;
          const regEx = new RegExp(props.searchRows[0], "i");
          for (let i=1; i<props.searchRows.length; i++)
            if ((singleRow[props.searchRows[i]]+"").search(regEx)!==-1)
            searchValid=true;
        }

        let filterValid = true;
        if (props.filterRows.length>0){
          filterValid = false;
          const filter = props.filterRows[0];
          for (let i=1; i<props.filterRows.length; i++){
            if ((singleRow[props.filterRows[i]])==Number(filter))
              filterValid = true;
          }
        }

        if (searchValid && filterValid)
          return <SingleRow key={index} rowIndex={index} singleRow={singleRow} cellClassName={props.cellClassName || []} dataType={props.dataType} action={props.action} columns={props.columns} setEntityStatus={props.setEntityStatus} setSelectedEntity={props.setSelectedEntity} />
        else
          return ""
      })}
    </TableBody>
  )
}

function SingleRow(props:{rowIndex:number, dataType:TableDataTypes, columns:string[], cellClassName?:string[], singleRow:any, action?:any, setEntityStatus?:Function,setSelectedEntity?:Function}){
  return(
    <TableRow style={{backgroundColor:"rgba(251, 251, 255, 1)"}} key={props.rowIndex}>
      {props.dataType.map((dataType:any, index:number)=>{
        let cellClassName="";
        const uniqueIndex = props.rowIndex+"_"+index;
        if (props.cellClassName && props.cellClassName[index])
          cellClassName = props.cellClassName[index];
      
        if (dataType=="index")
          return handleIndex(props.rowIndex+1, cellClassName, uniqueIndex);
      
        else if (dataType=="action")
          return handleAction(props.action[props.rowIndex], cellClassName, uniqueIndex)

        else if (dataType=="countTeam")
          return handleCountTeam(props.singleRow, cellClassName, uniqueIndex);
    
        const item = props.singleRow[props.columns[props.dataType[0]=="index"?index-1:index]];

        if (dataType=="text")
          return handleText(item, cellClassName, uniqueIndex);
        else if (dataType=="date")
          return handleDate(item, cellClassName,uniqueIndex);
        else if (dataType=="priority")
          return handlePriority(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="docStatus")
          return handleDocStatus(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="userStatus")
          return handleUserStatus(Number(item), cellClassName, uniqueIndex, props.rowIndex, props.setSelectedEntity||(()=>{}), props.setEntityStatus||(()=>{}));
        else if (dataType=="teamStatus")
            return handleTeamStatus(Number(item), cellClassName, uniqueIndex, props.rowIndex, props.setSelectedEntity||(()=>{}), props.setEntityStatus||(()=>{}));
        else if (dataType=="role")
          return handleRole(Number(item), cellClassName, uniqueIndex);
        else if(dataType=="zone")
          return handleZone(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="ratingAgency")
          return handleRatingAgency(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="ratingType")
          return handleRatingType(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="ratingOutlook")
          return handleRatingOutlook(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="frequency")
          return handleFrequency(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="transaction")
          return handleTransactionDocumentType(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="file")
          return handleFileType(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="objName")
          return handleObjName(item, cellClassName, uniqueIndex);
      })}
    </TableRow>
  )
}

const handleIndex = (index:number, cellClassName:string, uniqueIndex:string) =>{
  return <TableCell key={uniqueIndex}  className={cellClassName}>{index}</TableCell>
}
const handleText = (item:string, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{item}</TableCell>
}

const handleDate = (item:string, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{moment(item).format("DD-MM-yyyy")}</TableCell>
}

const handlePriority = (index:number, cellClassName:string, uniqueIndex:string) => {
  return(
    <TableCell key={uniqueIndex}>
      <div className={`${PriorityStyling[index]} text-center ${cellClassName}`} style={{borderRadius:"2.7px"}}>
        {PriorityValues[index]}
      </div>
    </TableCell>
  )
}

const handleDocStatus = (index:number, cellClassName:string, uniqueIndex:string) => {
  return(
    <TableCell key={uniqueIndex} className={`${DocumentStatusStyling[index]} ${cellClassName}`}>
      {DocumentStatusValues[index]}
    </TableCell>
  )
}

const handleUserStatus = (index:number, cellClassName:string, uniqueIndex:string, selectedUser:number, setSelectedUser:Function, setUserStatus:Function) => {
  return (
    <TableCell key={uniqueIndex} className={cellClassName}>
      <DropdownMenu>
      <DropdownMenuTrigger className={`${UserStatusStyling[index]} w-28 h-10 text-center rounded-xl `}>
        <div className="flex flex-row w-full" >
          <p className=" m-auto">{UserStatusValues[index]}</p>
          <img className="mr-2" src={chevron_down} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuItem onClick={()=>{setSelectedUser(selectedUser); setUserStatus(1)}} className={`${UserStatusStyling[1]} bg-white`}>{UserStatusValues[1]}</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>{setSelectedUser(selectedUser); setUserStatus(2)}} className={`${UserStatusStyling[2]} bg-white`}>{UserStatusValues[2]}</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>{setSelectedUser(selectedUser); setUserStatus(3)}} className={`${UserStatusStyling[3]} bg-white`}>{UserStatusValues[3]}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </TableCell>
  )
}

const handleTeamStatus = (index:number, cellClassName:string, uniqueIndex:string, selectedTeam:number, setSelectedTeam:Function, setTeamStatus:Function) => {
  return (
    <TableCell key={uniqueIndex} className={cellClassName}>
      <DropdownMenu>
      <DropdownMenuTrigger className={`${TeamStatusStyling[index]} w-28 h-10 text-center rounded-xl `}>
        <div className="flex flex-row w-full" >
          <p className=" m-auto">{TeamStatusValues[index]}</p>
          <img className="mr-2" src={chevron_down} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuItem onClick={()=>{setSelectedTeam(selectedTeam); setTeamStatus(1)}} className={`${TeamStatusStyling[1]} bg-white`}>{TeamStatusValues[1]}</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>{setSelectedTeam(selectedTeam); setTeamStatus(2)}} className={`${TeamStatusStyling[2]} bg-white`}>{TeamStatusValues[2]}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </TableCell>
  )
}

const handleRole = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{EnumIteratorValues(UserRoles)[index]}</TableCell>
}

const handleZone = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{EnumIteratorValues(ZoneList)[index]}</TableCell>
}

const handleAction = (action:any, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{action}</TableCell>
}

const handleRatingAgency = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{RatingAgencies[index]}</TableCell>
}

const handleRatingType = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{RatingTypes[index]}</TableCell>
}

const handleRatingOutlook = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{RatingOutlook[index]}</TableCell>
}

const handleFrequency = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{FrequencyType[index]}</TableCell>
}

const handleTransactionDocumentType = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{TransactionDocumentTypes[index]}</TableCell>
}

const handleFileType = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{FileTypes[index]}</TableCell>
}

const handleObjName = (item:any, cellClassName:string, uniqueIndex:string) =>{
  return <TableCell key={uniqueIndex} className={cellClassName}>{item.N}</TableCell>
}

const handleCountTeam = (obj:any, cellClassName:string, uniqueIndex:string) => {
  const sections = ["TD","CD","C","CP","CS"];
  let count = 1;
  sections.map(name=>{
    count+=obj[name]["M"].length+obj[name]["C"].length
  });
  return <TableCell key={uniqueIndex} className={cellClassName}>{count}</TableCell>
}

export { HeaderRows, BodyRowsMapping };