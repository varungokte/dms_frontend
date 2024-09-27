import { ReactElement } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { statusValues, statusStyling } from "@/Constants";
import { DocumentStatus, LoanStatus, Priority, TeamStatus, UserStatus, FieldValues } from "@/types/DataTypes";

import FloatNumberField from "../FormFieldComponents/FloatNumberField";
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';

function IndexCell (props:{index:number, cellClassName?:string}){
  return <div className={props.cellClassName}>
    {props.index}
  </div>
}

function TextCell (props:{item:string, cellClassName?:string, setBadge?:boolean}){
  return <div className={props.cellClassName}>
    {props.setBadge
      ?<Badge
        badgeContent="Default"
        color="error"
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }} 
        sx={{ marginLeft:"10px", marginBottom:"15px", zIndex:39 }}
      />
      :<></>
    }
    <div>{props.item}</div>
  </div>
}

function DateCell (props:{item:string, cellClassName?:string}){
  return <div className={props.cellClassName}>
    {moment(props.item).format("DD-MM-yyyy")}
  </div>
}

function PriorityCell (props:{priority:Priority, cellClassName?:string}) {
  const {PriorityList} = statusValues;
  const {PriorityStyling} = statusStyling;
  return <div className={`${PriorityStyling[PriorityList.indexOf(props.priority)]} text-center ${props.cellClassName} p-1.5`} style={{borderRadius:"7px"}}>
    {props.priority}
  </div>
}

function DocStatusCell (props:{status:DocumentStatus, cellClassName?:string}) {
  const {DocumentStatusList} = statusValues;
  const {DocumentStatusStyling} = statusStyling;

  return <div className={`${DocumentStatusStyling[DocumentStatusList.indexOf(props.status||"Pending")]} ${props.cellClassName}`}>
    {props.status||"Pending"}
  </div>
}


function LoanStatusCell (props:{status:LoanStatus, cellClassName?:string}) {
  const {LoanStatusList} = statusValues;
  const {LoanStatusStyling} = statusStyling;

  return <div className={`${LoanStatusStyling[LoanStatusList.indexOf(props.status)]} ${props.cellClassName}`}>
    {props.status}
  </div>
}

function UserStatusCell (props:{index:string, status:UserStatus, cellClassName?:string, selectedUser:number, setSelectedUser:Function, setUserStatus:Function}) {
  const {UserStatusList} = statusValues;
  const {UserStatusStyling}= statusStyling;

  const editable = props.cellClassName && props.cellClassName.search("editable")!=-1;
  const className =`${UserStatusStyling[UserStatusList.indexOf(props.status)]} w-28 text-center rounded-xl ${props.cellClassName}`
  if (editable)
    return <select id={props.index} className={`${className} h-10`} value={props.status} onChange={e=>{props.setSelectedUser(props.selectedUser); props.setUserStatus(e.target.value)}}>
      {UserStatusList.map((status,index)=>{
        if (status!="-")
          return <option key={index} className={`${UserStatusStyling[index]}`}>{status}</option>
      })}
    </select>;
  else
    return <p className={`${className} p-2`}>{props.status}</p>;  
}

function TeamStatusCell (props:{index:string, status:TeamStatus, cellClassName?:string, selectedTeam:number, setSelectedTeam:Function, setTeamStatus:Function, disabled?:boolean}) {
  const {TeamStatusList} = statusValues;
  const {TeamStatusStyling, TeamStatusDisabledStyling} = statusStyling;
  
  const editable =props.cellClassName && props.cellClassName.search("editable")!=-1;
  const className = `${props.disabled?TeamStatusDisabledStyling[TeamStatusList.indexOf(props.status)]:TeamStatusStyling[TeamStatusList.indexOf(props.status)]} disabled w-28 text-center rounded-xl ${props.cellClassName}`
  
  if (editable)
    return <select id={props.index} className={`${className} h-10`}
      value={props.status} onChange={e=>{props.setSelectedTeam(props.selectedTeam); props.setTeamStatus(e.target.value)}}>
      {TeamStatusList.map((status,index)=>{
        if (status!="-")
          return <option key={index} className={`${TeamStatusStyling[index]} p-2`}>{status}</option>
      })}
    </select>
  else
    return <div className={`${className} p-2`}><p>{props.status}</p></div>
}

function ActionCell (props:{action:ReactElement, cellClassName?:string}) {
  return props.action;
}

function ObjNameCell (props:{item:FieldValues, cellClassName?:string}){
  return <div className={props.cellClassName}>
    {props.item["N"]}
  </div>
}

function FloatFieldCell (props:{prefillValue:FieldValues[], cellClassName?:string, tableIndex:number, columnId:string, setPrefillValue:Function}) {
  return <div className={props.cellClassName}>
    <FloatNumberField index={props.tableIndex} fieldData={{id:props.columnId, name:"", type:"float"}} disabled={false} className={"border-2 rounded-if h-7 mt-5 p-1"}
      fieldValue={props.prefillValue} setFieldValues={props.setPrefillValue} 
      repeatFields formIndex={props.tableIndex}
    /> 
  </div>
}

function DocumentLinkCell (props:{item:ReactElement, cellClassName?:string, link:{section:string,index:string|number}|undefined}) {
  if (props.link) 
    return <Link to={props.link.section} className={props.cellClassName} state={props.link.index}>
      {props.item}
    </Link>
}

function CheckboxCell (props:{id:string, selectedRow:string[], disabled?:boolean, className?:string}) {
  return <Checkbox color="secondary" checked={props.selectedRow.includes(props.id)} disabled={props.disabled} className={props.className} />
}

function RadioCell (props:{id:string, selectedRow:string[], iconOverride?:ReactElement}){
  return <Radio icon={props.iconOverride} color="secondary" checked={props.selectedRow.includes(props.id)} />
}

function ButtonCell (props:{id:string, icon:ReactElement}){
  return <IconButton>{props.icon}</IconButton>
}

export {
  IndexCell, TextCell, DateCell, 
  PriorityCell, UserStatusCell, TeamStatusCell, DocStatusCell, LoanStatusCell,
  ActionCell, ObjNameCell, FloatFieldCell, DocumentLinkCell, 
  CheckboxCell, RadioCell, ButtonCell
}