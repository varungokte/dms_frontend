//import { useState } from "react";

import AddButton from "./Buttons/AddButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function _TestComponent(){
  return (
    <div className="m-9">
      <div>Test Component</div>
      <br />
      <AddButton sectionName="loan account" onClick={()=>{}} />
      <Button variant="contained" color={"secondary"} size="large" sx={{borderRadius:"10px", height:"50px", width:"150px", marginX:"10px"}} onClick={()=>{}}>
        <Typography textTransform="capitalize">Cancel</Typography>
      </Button>
      <div>
      </div>
    </div>
  )

}

export default _TestComponent;