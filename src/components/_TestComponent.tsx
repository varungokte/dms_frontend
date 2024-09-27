import { useEffect, useState, useReducer } from "react";
import { FieldValues } from "@/types/DataTypes";
import TableKeyValues from "./BasicTables/TableKeyValues";

function _TestComponent(){
  const reducer = (state:number, action:"inc"|"dec") => {
    if (action=="inc")
      return state+1;
    else
      return state-1;
  };

  useEffect(()=>{
    //const keyDownEvent = (e:KeyboardEvent)=>console.log("key pressed on page",e.code);
    //document.addEventListener("keydown", keyDownEvent);
    /* return (()=>{
      document.removeEventListener("keydown", keyDownEvent);
    }) */
  },[]);

  const [prefillValues, setPrefillValues] = useState<FieldValues>();
  
  useEffect(()=>{
    setPrefillValues({
      Planets: ["Vulcan","Mandalore","Krypton","Raxacoricofallapatorius","Skaro","Mondas","Kwenn", "Cardassia", "Tatooine","Bajor","Trill","Kashyyyk"],
      Species: ["Time Lords","Klingons","Trandoshans","Wookies","Cardassians"],
      Vehicles: ["USS Enterprise","Millenium Falcon","TARDIS","Batmobile"],
    })
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
      <div> 
        <TableKeyValues prefillValues={prefillValues||{}} setPrefillValues={setPrefillValues} />
      </div> 
      <br />
    </div>
  );

}

export default _TestComponent;