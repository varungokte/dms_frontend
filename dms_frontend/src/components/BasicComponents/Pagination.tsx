import { TableRowsPerPage } from './../../../Constants';
import { Pagination as PaginationBar} from '@mui/material';

function EntriesPerPage(props:{rowsPerPage:number, setRowsPerPage:Function}){
  return (
      <span className="mx-2">Rows per page:
        <select value={props.rowsPerPage} className="mx-2 bg-white" onChange={(e)=>props.setRowsPerPage(e.target.value)}>
          {TableRowsPerPage.map(row=>{
            if (row!=-1)
              return <option value={row}>{row}</option>
          })}
        </select>
      </span>
  )
}

function Pagination(props:{totalPages:number, currentPage:number, setCurrentPage:Function, rowsPerPage:number, setRowsPerPage:Function}){
  return (
    <div className="flex flex-row">
      <div className="flex-auto my-1"><EntriesPerPage rowsPerPage={props.rowsPerPage} setRowsPerPage={props.setRowsPerPage} /></div>
      <div className="mx-28"><PaginationBar count={props.totalPages} page={props.currentPage} onChange={(_,page)=>props.setCurrentPage(page)} ></PaginationBar></div>
    </div>
  )
}

export {Pagination, EntriesPerPage};
