import { useState } from "react";

function RelationshipMapping(){
  const [role, setRole] = useState("");
  return (
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold mx-7 mb-5">Relationship Mapping</p>
      <hr/>
      <div className="flex flex-row">
        <div className='flex-auto'>
          <select className="border-2 bg-white mx-5 p-3 rounded-xl my-2 w-72" 
            onChange={(e)=>{
            const val = e.target.value+"";
            setRole(val.replace("\\", "/\\/"))
          }}>
            <option value={-1}>All Roles</option>
            <option value={0}>Maker</option>
            <option value={1}>Checker</option>
            <option value={2}>Admin</option>
          </select>
        </div>
        
        <div>
          <button>a</button>
        </div>
      </div>
    </div>
  )
}

export default RelationshipMapping;