import Dialog from '@mui/material/Dialog';

function DeleteConfirmation(props:{thing:string, currIndex:number, id?:string, deleteFunction:Function, open:boolean, setOpen:Function}){
  const closeDialog = () => {
    props.setOpen((curr:boolean[])=>{
      curr[props.currIndex] = false;
      return [...curr];
    })
  }

  return(
    <Dialog open={props.open} onClose={closeDialog} maxWidth="md" fullWidth >
      <br />
      <div>
        <p className="m-auto text-center text-xl font-bold">Delete {props.thing}</p>
        <p className="m-auto text-center">Are you sure you want to delete this {props.thing} permanently?</p>
      </div>
      <br />
      <div className="m-auto">
        <button className="border-2 py-1 px-5 rounded-lg font-normal hover:bg-slate-100 mx-3" onClick={closeDialog}>Cancel</button>
        <button className="text-white bg-red-600 py-2 px-5 rounded-lg hover:bg-red-700" onClick={()=>{props.deleteFunction(props.id|| props.currIndex); closeDialog()}}>Delete</button>
      </div>
      <br />
    </Dialog>
  );
}

export default DeleteConfirmation;