import { useEffect } from 'react';
import { TableRowsPerPage } from '@/functions/Constants';

import { Pagination as PaginationBar} from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function EntriesPerPage(props:{rowsPerPage:number, setRowsPerPage:Function}){
  return (
    <span className="">Rows per page:
      <select value={props.rowsPerPage} className="mx-1 bg-white" onChange={(e)=>props.setRowsPerPage(e.target.value)}>
        {TableRowsPerPage.map((row,index)=>{
          if (row!=-1)
            return <option key={index} value={row}>{row}</option>
        })}
      </select>
    </span>
  )
}

function Pagination(props:{totalPages:number, currentPage:number, setCurrentPage:Function, rowsPerPage?:number, setRowsPerPage?:Function, className?:string}){
  useEffect(()=>{
    /* 
    if (props.currentPage>props.totalPages) */
      props.setCurrentPage(1);
  },[props.totalPages])
  return (
    <div className={`flex flex-row ${props.className}`}>
      <div className="flex-auto my-1">{props.rowsPerPage&&props.setRowsPerPage?<EntriesPerPage rowsPerPage={props.rowsPerPage} setRowsPerPage={props.setRowsPerPage} />:<></>}</div>
      <div className="">
        <PaginationBar count={props.totalPages} page={props.currentPage} onChange={(_,page)=>props.setCurrentPage(page)} color="secondary"
          renderItem={item => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} sx={item.selected?{color:"rgba(80, 65, 188, 1)"}:{}}
              {...item}
            />
          )} 
        >

        </PaginationBar>
      </div>
    </div>
  )
}

export {Pagination, EntriesPerPage};
