import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Typography } from "@mui/material";
import CancelButton from '../Buttons/CancelButton';

function FormSectionNavigation(props: { currentSection:number, setCurrentSection:Function, sectionCount:number, goToNextSection:Function, isForm:boolean, enableLoadingSign?:boolean, actionType?:"CREATE"|"EDIT"|"VIEW"}) {
  const navigate = useNavigate();

  const [nextButtonValue, setNextButtonValue] = useState(<><Typography textTransform="capitalize">Next</Typography><ChevronRightIcon/></>);
  
  useEffect(()=>{
    if (props.enableLoadingSign)
      setNextButtonValue(<CircularProgress className="mt-1" sx={{color:"white"}} />);
  },[props.enableLoadingSign]);

  const previousSection = () =>{
    props.setCurrentSection((curr:any)=>{
      if (curr===1)  
        return 0;
      else 
        return curr-1;
    });
  };

  return (
    <div className="flex flex-row">
      <div className="flex-auto">
        <CancelButton onClick={()=>navigate("/loan")} />
      </div>

      <div>
        {props.currentSection==1
          ?<></>
          :<Button color="secondary" variant="outlined" size="large" sx={{borderRadius:"10px", height:"50px", width:"150px", marginX:"10px"}} onClick={previousSection}>
            <ChevronLeftIcon/>
            <Typography textTransform="capitalize">Previous</Typography>
          </Button>
        }
        {props.currentSection<props.sectionCount
        ?<Button color="secondary" variant="contained" size="large" sx={{borderRadius:"10px", height:"50px", width:"150px", marginX:"10px"}} type={props.isForm&&props.actionType!="VIEW"?"submit":"button"} onClick={()=>{props.isForm&&props.actionType!="VIEW"?{}:props.goToNextSection()}}>
        <div className="flex flex-row place-content-center">
          {nextButtonValue}
        </div>
      </Button>
        :<></>
        }
      </div>
  </div>
  )
}

export { FormSectionNavigation };