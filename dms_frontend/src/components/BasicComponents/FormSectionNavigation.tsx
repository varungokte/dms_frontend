import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
function FormSectionNavigation(props:any) {
	const navigate = useNavigate();
  
  const previousSection = () =>{
    props.setCurrentSection((curr:any)=>{
      console.log(curr)
      if (curr===0) return 0 
      else return curr-1
    });
  };

  return (
    <div className="flex flex-row">
      <div className="flex-auto">
        <button className="text-red-600 border border-red-600 rounded-xl h-12 w-36 mx-3" onClick={()=>navigate("/loan")}>Cancel</button>
      </div>
      <div>
        <button className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mt-5 m-3" onClick={previousSection}><div className="flex flex-row place-content-center"><ChevronLeft/><div>Previous</div></div></button>
        <button className="text-white bg-custom-1 rounded-xl h-12 w-36 my-1" type="submit"><div className="flex flex-row place-content-center"><ChevronRight/><div>Next</div></div></button>
      </div>
  </div>
  )
}

const goToNextSection = (setCurrentSection:Function, sectionCount: number) => {
  setCurrentSection((curr:any)=>{
    if (curr===sectionCount) return sectionCount 
    else return curr+1
  });
};

export { FormSectionNavigation, goToNextSection };