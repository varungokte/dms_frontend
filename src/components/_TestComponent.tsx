import { Skeleton } from "@mui/material";
import { useReducer } from "react";
//import { useEffect, useState } from "react";

function _TestComponent(){
  const reducer = (state:number, action:"inc"|"dec") => {
    if (action=="inc")
      return state+1;
    else
      return state-1;
  };

  const [state, dispatch] = useReducer(reducer,0);
  
  return (
    <div className="m-9">
      <div>
        <button onClick={()=>dispatch("dec")}>-</button>
        {state}
        <button onClick={()=>dispatch("inc")}>+</button>
      </div>
      <br /> 
      <div>
        <div className="flex flex-row">
          <div className="mx-3">
            <Skeleton variant="rectangular" width={150} height={200} />
          </div>
          <div className="mx-3">
            <Skeleton variant="rectangular" width={300} height={200} />
          </div>
        </div>
      </div>
      <br />
    </div>
  );

}

export default _TestComponent;