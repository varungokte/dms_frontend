import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function AddButton(props:{sectionName:string, onClick:Function }){
  return (
    <Button color="secondary" variant="contained" size="large" 
      sx={{paddingX:"10px", paddingY:"9px", margin:3, borderRadius:"10px"}}
      onClick={()=>props.onClick()}
    >
      <AddIcon className="" />
      <Typography fontSize={"19px"} textTransform="capitalize">Add {props.sectionName}</Typography>
    </Button>
  )
}

export default AddButton;