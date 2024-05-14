import { useState } from "react";
import {CreateButtonStyling} from "./BasicComponents/PurpleButtonStyling";

function Reports() {
  const [loanType, setLoanType] = useState("");
  const [zonalHead, setZonalHead] = useState("");
  const [date, setDate] = useState("");
  console.log(loanType+zonalHead, date)
  return(
    <div>
      <p className="text-3xl font-bold m-7">Reports</p>
      <div className="bg-white rounded-xl m-7 p-5">
        <form>
          <div className="grid grid-rows-3 grid-flow-col">
            <div>
              <label htmlFor="type" className="text-lg">Loan Type</label>
              <br/>
              <input type="text" id="type" onChange={e=>setLoanType(e.target.value)} className="border-2 rounded-xl w-3/5 p-3 mt-3"/>
            </div>

            <div>
              <label htmlFor="type" className="text-lg">Loan Type</label>
              <br/>
              <input type="text" id="type" onChange={e=>setLoanType(e.target.value)} className="border-2 rounded-xl w-3/5 p-3 mt-3"/>
            </div>

            <div>
            </div>

            <div className="">
              <label htmlFor="head" className="text-lg">Zonal Head</label>
              <br/>
              <input type="text" id="head" onChange={e=>setZonalHead(e.target.value)} className="border-2 rounded-xl w-3/5 p-3 mt-3"/>
            </div>                      

            <div className="">
              <label htmlFor="date" className="text-lg">Date</label>
              <br/>
              <input type="date" id="date" onChange={e=>setDate(e.target.value)} className="border-2 rounded-xl w-3/5 p-3 mt-3"/>
            </div>
            
            <div className="mt-8 flex flex-row">
              <div className="w-5/12"></div>
              <div>
                <button className={CreateButtonStyling}>Create Report</button>
              </div>
            </div>
          </div>
      </form>
      </div>
    </div>
  )
}

export default Reports;