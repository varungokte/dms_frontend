import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function FormSectionNavigation(props: { currentSection:number, setCurrentSection:Function, sectionCount:number, goToNextSection:Function, isForm:boolean, enableLoadingSign?:boolean, actionType?:"CREATE"|"EDIT"|"VIEW"}) {
  const navigate = useNavigate();

  const [nextButtonValue, setNextButtonValue] = useState(<div className="flex flex-row place-content-center"><div>Next</div><ChevronRight/></div>);
  
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
        <button className="text-red-600 border border-red-600 rounded-xl h-12 w-36 mx-3" onClick={()=>navigate("/loan")}>Cancel</button>
      </div>

      <div>
        {props.currentSection==1
          ?<></>
          :<button className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle	" onClick={previousSection}>
            <div className="flex flex-row place-content-center">
              <ChevronLeft/>
              <div>Previous</div>
            </div>
          </button>
        }
        {props.currentSection<props.sectionCount
        ?<button className="text-white bg-custom-1 rounded-xl h-12 w-36" type={props.isForm&&props.actionType!="VIEW"?"submit":"button"} onClick={()=>{props.isForm&&props.actionType!="VIEW"?{}:props.goToNextSection()}}>
          {nextButtonValue}
        </button>
        :<></>
        }
      </div>
  </div>
  )
}

export { FormSectionNavigation };