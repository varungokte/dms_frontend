import { useEffect, useReducer } from "react";
//import { useEffect, useState } from "react";

function _TestComponent(){
  const reducer = (state:number, action:"inc"|"dec") => {
    if (action=="inc")
      return state+1;
    else
      return state-1;
  };

  useEffect(()=>{
    const keyDownEvent = (e:KeyboardEvent)=>console.log("key pressed on page",e.code);
    document.addEventListener("keydown", keyDownEvent);
    /* return (()=>{
      document.removeEventListener("keydown", keyDownEvent);
    }) */
  },[]);
 
  const [state, dispatch] = useReducer(reducer,0);
  
  return (
    <div className="m-9">
      <div>
        <button onClick={()=>dispatch("dec")}>-</button>
        {state}
        <button onClick={()=>dispatch("inc")}>+</button>
      </div>
      <br />
      <br />
    </div>
  );

}

export default _TestComponent;