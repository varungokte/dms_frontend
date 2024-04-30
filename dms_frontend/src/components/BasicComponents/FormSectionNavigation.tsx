import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
function FormSectionNavigation(props:any) {
	const navigate = useNavigate();

  const previousSection = () =>{
    props.setCurrentSection((curr:any)=>{
      if (curr===1)  
        return 0;
      else return curr-1
    });
  };

  return (
    <div className="flex flex-row">
      <div className="flex-auto">
        <button className="text-red-600 border border-red-600 rounded-xl h-12 w-36 mx-3" onClick={()=>navigate("/loan")}>Cancel</button>
      </div>
      <div>
        {props.currentSection
          ?<></>
          :<button className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle	" onClick={previousSection}><div className="flex flex-row place-content-center"><ChevronLeft/><div>Previous</div></div></button>
        }
        
        {props.isForm
          ?<button className="text-white bg-custom-1 rounded-xl h-12 w-36 mb-9 my-1 p-3" type="submit"><div className="flex flex-row place-content-center"><div>Save & Next</div><ChevronRight/></div></button>
          :<button className="text-white bg-custom-1 rounded-xl h-12 w-36 mb-9 my-1" onClick={()=>props.goToNextSection(props.setCurrentSection,props.sectionCount)}><div className="flex flex-row place-content-center"><div>Save & Next</div><ChevronRight/></div></button>
        }
      </div>
  </div>
  )
}



export { FormSectionNavigation };