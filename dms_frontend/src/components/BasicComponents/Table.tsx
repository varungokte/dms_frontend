import { ReactElement } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { DocumentStatusList, PriorityList, TeamStatusList, UserStatusList } from "../../../Constants";
import { DocumentStatus, FieldValues, Priority, TableDataTypes, TeamStatus, UserStatus } from "DataTypes";

import {Paper, Table as MUITable,TableContainer} from '@mui/material';
import {TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import FloatNumberField from "../FormFieldComponents/FloatNumberField";

const PriorityStyling = ["-", "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100"];
const UserStatusStyling = ["-", "text-yellow-600 bg-yellow-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100"];
const TeamStatusStyling = ["-", "text-green-600 bg-green-100", "text-red-600 bg-red-100"];
const DocumentStatusStyling = ["-", "text-yellow-500", "text-blue-500", "text-green-600", "text-red-600"];
//const FileStatusStyling = ["-", "text-yellow-500", "text-green-600"];

type HeaderRowsProps = {headingRows:string[], headingClassNames?:string[]};
type BodyRowsMappingProps = {tableData:FieldValues[], columnIDs:string[], cellClassName?:string[], searchRows?:any, filterRows?:any, dataTypes:TableDataTypes[], action?:ReactElement[], setEntityStatus?:Function, setSelectedEntity?:Function, setValues?:Function, documentLinks?:string[]}

function DataTable(props:(HeaderRowsProps & BodyRowsMappingProps &{className?:string})){
  return(
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius:"13px"}} className=" rounded-xl">
      <MUITable className={`${props.className}`}>
        <HeaderRows headingRows={props.headingRows} headingClassNames={props.headingClassNames}/>
        <BodyRowsMapping {...props}  />
      </MUITable>
    </TableContainer>
  )
}

function HeaderRows(props:HeaderRowsProps){
  return(
    <TableHead>
      <TableRow>
      {props.headingRows.map((heading,index)=>{
        return <TableCell key={index}>
          <div className={(props.headingClassNames && props.headingClassNames[index])?props.headingClassNames[index]:""}>{heading}</div>
        </TableCell>
      })}
      </TableRow>
    </TableHead>
  )
}

function BodyRowsMapping(props:BodyRowsMappingProps){
  return(
    <TableBody>
      {props.tableData.map((singleRow,index)=>{
        let searchValid = true;
        if (props.searchRows && props.searchRows.length>0){
          searchValid = false;
          const regEx = new RegExp(props.searchRows[0], "i");
          for (let i=1; i<props.searchRows.length; i++)
            if ((singleRow[props.searchRows[i]]+"").search(regEx)!==-1)
            searchValid=true;
        }

        let filterValid = true;
        if (props.filterRows && props.filterRows.length>0){
          filterValid = false;
          const filter = props.filterRows[0];
          for (let i=1; i<props.filterRows.length; i++)
            if ((singleRow[props.filterRows[i]])==Number(filter))
              filterValid = true;
        }

        if (searchValid && filterValid)
          return <SingleRow key={index} rowIndex={index} singleRow={singleRow} cellClassName={props.cellClassName || []} dataTypes={props.dataTypes} action={props.action} columns={props.columnIDs} setEntityStatus={props.setEntityStatus} setSelectedEntity={props.setSelectedEntity} setValues={props.setValues} documentLinks={props.documentLinks}/>
        else
          return ""
      })}
    </TableBody>
  )
}

function SingleRow(props:{rowIndex:number, dataTypes:TableDataTypes[], columns:string[], cellClassName?:string[], singleRow:FieldValues, action?:ReactElement[], setEntityStatus?:Function,setSelectedEntity?:Function, setValues?:Function, documentLinks?:string[]}){ 
  return(
    <TableRow style={{backgroundColor:"rgba(251, 251, 255, 1)"}} key={props.rowIndex}>
      {props.dataTypes.map((dataType, index)=>{
        const uniqueIndex = props.rowIndex+"_"+index;
        const cellClassName=(props.cellClassName && props.cellClassName[index])?props.cellClassName[index]:"";
      
        if (dataType=="index")
          return handleIndex(props.rowIndex+1, cellClassName, uniqueIndex);
      
        else if (dataType=="action" && props.action)
          return handleAction(props.action[props.rowIndex], cellClassName, uniqueIndex)

        else if (dataType=="count-team")
          return handleCountTeam(props.singleRow, cellClassName, uniqueIndex);
    
        const item = props.singleRow[props.columns[props.dataTypes[0]=="index"?index-1:index]];
        const documentLink=(props.documentLinks && props.documentLinks[props.rowIndex])?props.documentLinks[props.rowIndex]:"";
        
        if (dataType=="date")
          return handleDate(item, cellClassName,uniqueIndex);
        else if (dataType=="priority")
          return handlePriority(item, cellClassName, uniqueIndex);
        else if (dataType=="doc-status")
          return handleDocStatus(item, cellClassName, uniqueIndex);
        else if (dataType=="user-status")
          return handleUserStatus(item, cellClassName, uniqueIndex, props.rowIndex, props.setSelectedEntity||(()=>{}), props.setEntityStatus||(()=>{}));
        else if (dataType=="team-status")
          return handleTeamStatus(item, cellClassName, uniqueIndex, props.rowIndex, props.setSelectedEntity||(()=>{}), props.setEntityStatus||(()=>{}));
        else if (dataType=="obj-name")
          return handleObjName(item, cellClassName, uniqueIndex);
        else if (dataType=="text-field")
          return handleTextField(item,cellClassName,uniqueIndex, props.rowIndex, props.columns[props.dataTypes[0]=="index"?index-1:index], props.setValues||(()=>{}));
        else if (dataType=="doc-link")
          return handleDocumentLink(item, cellClassName, uniqueIndex, documentLink);
        else
          return handleText(item, cellClassName, uniqueIndex);
      })}
    </TableRow>
  )
}

const handleIndex = (index:number, cellClassName:string, uniqueIndex:string) =>{
  return <TableCell key={uniqueIndex}><div className={cellClassName}>{index}</div></TableCell>
}

const handleText = (item:string, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{item}</TableCell>
}

const handleDate = (item:string, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{moment(item).format("DD-MM-yyyy")}</TableCell>
}

const handlePriority = (priority:Priority, cellClassName:string, uniqueIndex:string) => {
  return(
    <TableCell key={uniqueIndex}>
      <div className={`${PriorityStyling[PriorityList.indexOf(priority)]} text-center ${cellClassName}`} style={{borderRadius:"2.7px"}}>
        {priority}
      </div>
    </TableCell>
  )
}

const handleDocStatus = (status:DocumentStatus, cellClassName:string, uniqueIndex:string) => {
  return(
    <TableCell key={uniqueIndex}>
      <span className={`${DocumentStatusStyling[DocumentStatusList.indexOf(status)]} ${cellClassName}`}>{status}</span> 
    </TableCell>
  )
}

const handleUserStatus = (status:UserStatus, cellClassName:string, uniqueIndex:string, selectedUser:number, setSelectedUser:Function, setUserStatus:Function) => {
  return (
    <TableCell key={uniqueIndex} className={cellClassName}>
      <select className={`${UserStatusStyling[UserStatusList.indexOf(status)]} w-28 h-10 text-center rounded-xl `} 
        value={status} onChange={e=>{setSelectedUser(selectedUser); setUserStatus(e.target.value)}}>
        {UserStatusList.map((status,index)=>{
          if (status!="-")
            return <option key={index} className={`${UserStatusStyling[index]}`}>{status}</option>
        })}
      </select>
  </TableCell>
  )
}

const handleTeamStatus = (status:TeamStatus, cellClassName:string, uniqueIndex:string, selectedTeam:number, setSelectedTeam:Function, setTeamStatus:Function) => {
  return (
    <TableCell key={uniqueIndex} className={cellClassName}>
      <select className={`${TeamStatusStyling[TeamStatusList.indexOf(status)]} w-28 h-10 text-center rounded-xl `} 
        value={status} onChange={e=>{setSelectedTeam(selectedTeam); setTeamStatus(e.target.value)}}>
        {TeamStatusList.map((status,index)=>{
          if (status!="-")
            return <option key={index} className={`${TeamStatusStyling[index]}`}>{status}</option>
        })}
      </select>
  </TableCell>
  )
}

const handleAction = (action:any, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{action}</TableCell>
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

const handleTextField = (prefillValue:any, cellClassName:string, uniqueIndex:string, tableIndex:number, columnId:string, setPrefillValue:Function) => {
  return <TableCell key={uniqueIndex} className="p-2">
    <FloatNumberField key={uniqueIndex} index={tableIndex} id={columnId} name="" className={cellClassName}
      prefillValues={{[tableIndex]:{[columnId]:prefillValue}}} setPrefillValues={setPrefillValue} 
      repeatFields formIndex={tableIndex}
    />
  </TableCell>
}

const handleDocumentLink = (item:ReactElement, cellClassName:string, uniqueIndex:string, link:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>
    <Link to={link}>{item}</Link>
  </TableCell>
}

export { DataTable, HeaderRows, BodyRowsMapping };