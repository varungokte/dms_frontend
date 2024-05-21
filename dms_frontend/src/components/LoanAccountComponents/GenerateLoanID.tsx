import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "./../../../GlobalContext";

function GenerateLoanID(props:any){
  const navigate = useNavigate();
  const {createAID} = useGlobalContext();

  const [agreementId, setAgreementId] = useState("");
  const [errorMessage, setErrorMessage] = useState(<></>)
  
  const userSubmittedId = (e:any) => {
    e.preventDefault();
    console.log("USER GENERATED ID", agreementId);
    createAID({"AID":agreementId}).then(res=>{
      console.log("REPOSNE", res);
      if (res.status==422)
        setErrorMessage(<p className="text-red-600">This Agreement ID has been taken. Please enter another one.</p>)
      else if (res.status!==200)
        setErrorMessage(<p className="text-yellow-600">Please try again later.</p>)
      else{
        props.setAID(res.obj.AID);
        props.setLoanId(res.obj._loanId)
        props.setOkToFrolic(true);
        props.setCurrentSection(1);
      }
    }).catch(err=>{
      console.log(err)
    });
  };

  const systemGeneratedId = () => {
    createAID({}).then(res=>{
      if (res.status!==200)
        setErrorMessage(<p className="text-yellow-600">Please try again later.</p>)
      else {
        props.setAID(res.obj.AID);
        props.setLoanId(res.obj._loanId)
        props.setOkToFrolic(true);
        props.goToNextSection();
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  return (
    <div >
      <br/>
      <div className="w-1/2 m-auto border-2 rounded-xl p-5">
        <form onSubmit={userSubmittedId}>
          <div className="my-5">
            <p className="mx-5 my-2">Agreement ID</p>
            <input required className="mx-6 p-3 border h-12 w-11/12" style={{borderRadius: "5px"}} placeholder="Enter Your Agreement ID" onChange={(e)=>setAgreementId(e.target.value)} />
          </div>
          
          <div className="w-1/2 m-auto flex flex-row">
            <div className="">
              <button className="text-red-600 border border-red-600 rounded-xl h-12 w-36 my-1 mx-3" onClick={()=>navigate("/loan")}>Cancel</button>
            </div>
            <div>
              <button className="text-white bg-custom-1 rounded-xl h-12 w-36 my-1" type="submit">Submit</button>
            </div>
          </div>
          </form>
        
        <p className="text-center">OR</p>
        <hr className="w-7/12 m-auto" />
        <br/>
        <div className="text-center">
          <button className="text-white bg-green-600 rounded-xl h-12 w-36 my-1" onClick={systemGeneratedId}>Generate ID</button>
        </div>
        {errorMessage}
      </div>
      <br/>
      <button onClick={()=>{props.setOkToFrolic(true);
        props.setCurrentSection(1);}}>Skip</button>
    </div>
  )
}

export default GenerateLoanID;