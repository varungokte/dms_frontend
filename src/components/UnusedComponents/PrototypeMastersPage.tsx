/* import { FieldValues } from "DataTypes";
import { useEffect, useState } from "react";
import TableKeyValues from "./BasicTables/TableKeyValues";

function _TestComponent(){
  const [prefillValues, setPrefillValues] = useState<FieldValues>();
  
  useEffect(()=>{
    setPrefillValues({
      Planets: ["Vulcan","Mandalore","Krypton","Raxacoricofallapatorius","Skaro","Mondas","Kwenn"],
      Species: ["Time Lords","Klingons","Trandoshans","Wookies","Cardassians"],
      Vehicles: ["USS Enterprise","Millenium Falcon","TARDIS","Batmobile"],
    })
  },[]);

  return (
    <div className="m-9">
      <div>Test Component</div>
      <br /> 
      <div> 
        <TableKeyValues prefillValues={prefillValues||{}} setPrefillValues={setPrefillValues} />
      </div> 
      <br />
     
    </div>
  );

}

export default _TestComponent; */