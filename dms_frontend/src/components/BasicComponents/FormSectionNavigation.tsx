import { useNavigate } from "react-router-dom";
function FormSectionNavigation(props:any) {
	const navigate = useNavigate();

  const previousSection = () =>{
    props.setCurrentSection((curr:any)=>{
      if (curr===0) return 0 
      else return curr-1
    });
  };

  const nextSection = () => {
    props.setCurrentSection((curr:any)=>{
      if (curr===props.count) return props.count 
      else return curr+1
    });
    
  }
  
  return (
    <div className="flex flex-row">
    <div className="flex-auto">
      <button className="text-red-600 border border-red-600 rounded-xl h-12 w-36 mx-3" onClick={()=>navigate("/loan")}>Cancel</button>
    </div>

    <div>
      <button className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-3" onClick={previousSection}>Previous</button>
      <button className="text-white bg-custom-1 rounded-xl h-12 w-36" onClick={nextSection}>Next</button>
    </div>

  </div>
  )
}

export default FormSectionNavigation;