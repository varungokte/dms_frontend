import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../../GlobalContext";
import { LoanCommonProps } from "DataTypes";
import Button from '@mui/material/Button';
import CancelButton from "../Buttons/CancelButton";
import SubmitButton from "../Buttons/SubmitButton";

function LoanIDAssignment(props:LoanCommonProps){
  const navigate = useNavigate();
  const {createAID} = useGlobalContext();

  const [agreementId, setAgreementId] = useState("");
  const [errorMessage, setErrorMessage] = useState(<></>)
  
  const userSubmittedId = async() => {
    //console.log("USER GENERATED ID", agreementId);
    const res = await createAID({"AID":agreementId})
    if (res.status==422)
      setErrorMessage(<p className="text-red-600">This Agreement ID has been taken. Please enter another one.</p>)
    else if (res.status!==200)
      setErrorMessage(<p className="text-yellow-600">Something went wrong. Please try again later.</p>)
    else{
      props.setAID(res.obj.AID);
      props.setLoanId(res.obj._loanId)
      props.setOkToFrolic(true);
      props.setCurrentSection(1);
    }
    return res.status;
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
        <form>
          <div className="my-5">
            <p className="mx-5 my-2">Agreement ID</p>
            <input required className="mx-6 p-3 border h-12 w-11/12" style={{borderRadius:"5px"}} placeholder="Enter Your Agreement ID" onChange={(e)=>setAgreementId(e.target.value)} />
          </div>
            <div className="text-center">
              <CancelButton onClick={()=>navigate("/loan")} />
              <SubmitButton submitButtonText="Submit" submitFunction={userSubmittedId} />
            </div>
          </form>
        
        <p className="text-center">OR</p>
        <hr className="w-7/12 m-auto" />
        <br/>
        <div className="text-center">
          <Button color="success" variant="contained" sx={{height:"50px", borderRadius:"10px"}} className=" h-12 p-2 my-1" onClick={systemGeneratedId}>Generate Random ID</Button>
        </div>
        {errorMessage}
      </div>
      <br/>
    </div>
  )
}

export default LoanIDAssignment;