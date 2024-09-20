import { DataTableProps, SingleCellProps, SingleRowProps } from "@/types/TableDataAttributes";
import {TableBody, TableCell, TableRow} from '@mui/material';

import { ActionCell, CheckboxCell, DateCell, DocStatusCell, DocumentLinkCell, FloatFieldCell, IndexCell, LoanStatusCell, ObjNameCell, PriorityCell, RadioCell, TeamStatusCell, TextCell, UserStatusCell } from "./TableCellComponents";

function DataTableBody(props:DataTableProps){
  const {tableData, ...newProps} = {...props};
  return(
    <TableBody>
      {props.tableData.map((singleRow,index)=>{
        return <SingleRow key={index} 
          rowIndex={index} 
          singleRow={singleRow}
          {...newProps}
        />
      })}
    </TableBody>
  )
}

function SingleRow (props:SingleRowProps){
  const handleRowClick = ()=>{
    if (!props.selectable)
      return;

    if (props.selectable.selectedRows.includes(props.singleRow["_id"])){
      if (props.selectable.selectMultiple){
        const index = props.selectable.selectedRows.indexOf(props.singleRow["_id"]);
        props.selectable.setSelectedRows(curr=>{
          const arr = [];
          for (let i=0; i<curr.length; i++)
            if (i!=index)
              arr.push(curr[i]);
          return arr;
        });
      }
      else
        props.selectable.setSelectedRows([""]);
    }
    else{
      if (props.selectable.selectMultiple)
        props.selectable.setSelectedRows(curr=>[...curr, props.singleRow["_id"]]);
      else
        props.selectable.setSelectedRows([props.singleRow["_id"]]);
    }
  }
  
  return (
    <TableRow key={props.rowIndex} hover 
      selected={props.selectable&&props.selectable.selectedRows.includes(props.singleRow["_id"])}
      onClick={handleRowClick} 
      sx={{
        backgroundColor:"rgba(251, 251, 255, 1)", 
        cursor:props.selectable?"pointer":"default", 
        border:props.selectable&&props.selectable.type=="row"&&props.selectable.selectedRows.includes(props.singleRow["_id"])?"solid rgba(80, 65, 188, 1)":""}} 
    >
      {props.selectable && props.selectable.type=="checkbox" && <TableCell>
        <CheckboxCell id={props.singleRow["_id"]} selectedRow={props.selectable.selectedRows} />
      </TableCell>}

      {props.selectable && props.selectable.type=="radio" && <TableCell>
        <RadioCell id={props.singleRow["_id"]} selectedRow={props.selectable.selectedRows} iconOverride={props.selectable.iconOverride} />
      </TableCell>}
      
      {props.showIndex && <TableCell>
        <IndexCell index={(props.showIndex.startsAt||0)+props.rowIndex+1} cellClassName={props.showIndex.cellClassName} />
      </TableCell>}

      {props.columnData.map(({id,type,cellClassName},index)=>{
        return <SingleCell key={props.rowIndex+"_"+index} index={index} rowIndex={props.rowIndex} 
          item={props.singleRow[id]} 
          columnID={id} columnType={type} cellClassName={cellClassName} 
          defaultBadges={props.defaultBadges} isDefault={props.singleRow["DEF"]==1} 
          documentLinks={props.documentLinks} 
          setSelectedEntity={props.setSelectedEntity} setEntityStatus={props.setEntityStatus}
          setValues={props.setValues}
        />
      })}

      {props.action && <TableCell><ActionCell action={props.action[props.rowIndex]} /></TableCell>}
    </TableRow>
  )
}

function SingleCell (props:SingleCellProps){
  const setBadge=props.defaultBadges && props.isDefault && props.index==0;
  const textOverflow = props.columnType=="text"?" break-words	max-w-[200px]":"";
  return (
    <TableCell key={props.rowIndex+"_"+props.index} className={`${props.cellClassName} ${textOverflow}`}>
      {(()=>{
        //const item = props.singleRow[props.columnID];
        const documentLink=(props.documentLinks && props.documentLinks[props.rowIndex])?props.documentLinks[props.rowIndex]:undefined;
        if (props.columnType=="date")
          return <DateCell item={props.item} cellClassName={props.cellClassName} />;
        else if (props.columnType=="priority")
          return <PriorityCell priority={props.item} cellClassName={props.cellClassName} />;
        else if (props.columnType=="doc-status")
          return <DocStatusCell status={props.item} cellClassName={props.cellClassName} />;
        else if (props.columnType=="user-status")
          return <UserStatusCell index={props.rowIndex+"_"+props.index} status={props.item} cellClassName={props.cellClassName} selectedUser={props.rowIndex} setSelectedUser={props.setSelectedEntity||(()=>{})} setUserStatus={props.setEntityStatus||(()=>{})} />;
        else if (props.columnType=="team-status")
          return <TeamStatusCell index={props.rowIndex+"_"+props.index} status={props.item} cellClassName={props.cellClassName} selectedTeam={props.rowIndex} setSelectedTeam={props.setSelectedEntity||(()=>{})} setTeamStatus={props.setEntityStatus||(()=>{})} />;
        else if (props.columnType=="loan-status")
          return <LoanStatusCell status={props.item} cellClassName={props.cellClassName} />;
        else if (props.columnType=="obj-name")
          return <ObjNameCell item={props.item} cellClassName={props.cellClassName} />;
        else if (props.columnType=="text-field")
          return <FloatFieldCell prefillValue={props.item} cellClassName={props.cellClassName} tableIndex={props.rowIndex} columnId={props.columnID} setPrefillValue={props.setValues||(()=>{})} />;
        else if (props.columnType=="doc-link")
          return <DocumentLinkCell item={props.item} cellClassName={props.cellClassName} link={documentLink} />;
        else
          return <TextCell item={props.item} cellClassName={props.cellClassName} setBadge={setBadge} />;
      })()}
    </TableCell>
  )
}

export default DataTableBody;


/* return (
          <TableCell key={props.rowIndex+"_"+index} className={`${cellClassName} ${textOverflow}`}>
            {(()=>{
              const item = props.singleRow[id];
              const documentLink=(props.documentLinks && props.documentLinks[props.rowIndex])?props.documentLinks[props.rowIndex]:undefined;
              if (type=="date")
                return <DateCell item={item} cellClassName={cellClassName} />;
              else if (type=="priority")
                return <PriorityCell priority={item} cellClassName={cellClassName} />;
              else if (type=="doc-status")
                return <DocStatusCell status={item} cellClassName={cellClassName} />;
              else if (type=="user-status")
                return <UserStatusCell index={props.rowIndex+"_"+index} status={item} cellClassName={cellClassName} selectedUser={props.rowIndex} setSelectedUser={props.setSelectedEntity||(()=>{})} setUserStatus={props.setEntityStatus||(()=>{})} />;
              else if (type=="team-status")
                return <TeamStatusCell index={props.rowIndex+"_"+index} status={item} cellClassName={cellClassName} selectedTeam={props.rowIndex} setSelectedTeam={props.setSelectedEntity||(()=>{})} setTeamStatus={props.setEntityStatus||(()=>{})} />;
              else if (type=="loan-status")
                return <LoanStatusCell status={item} cellClassName={cellClassName} />;
              else if (type=="obj-name")
                return <ObjNameCell item={item} cellClassName={cellClassName} />;
              else if (type=="text-field")
                return <FloatFieldCell prefillValue={item} cellClassName={cellClassName} tableIndex={props.rowIndex} columnId={id} setPrefillValue={props.setValues||(()=>{})} />;
              else if (type=="doc-link")
                return <DocumentLinkCell item={item} cellClassName={cellClassName} link={documentLink} />;
              else
                return <TextCell item={item} cellClassName={cellClassName} setBadge={setBadge} />;
            })()}
          </TableCell>
        ) */