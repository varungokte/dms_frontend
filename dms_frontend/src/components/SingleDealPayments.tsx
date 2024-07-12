import { useEffect, useState } from "react";
import useGlobalContext from "../../GlobalContext";
import { DocumentSectionDetails } from "DataTypes";
import { DocumentStatusList } from "../../Constants";

import { DataTable } from "./BasicComponents/Table";
import UploadFileButton from "./BasicComponents/UploadFileButton";
import ViewFileButton from "./BasicComponents/ViewFileButton";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";

function SingleDealPayments(props:{loanId:string, AID:string, sectionDetails:DocumentSectionDetails}){
  const [paymentData, setPaymentData] = useState<any>();
  const [added, setAdded] = useState(true);
  const [scheduleId, setScheduleId] = useState("");
  
  const {getPaymentSchedule} = useGlobalContext();

  useEffect(()=>{
    if (added)
      getPaymentSchedule(props.loanId).then((res)=>{
        console.log("payment schedule",res);
        if (res.status==200){
          if (res.obj["T"]=="Fixed")
            res.obj["GS"].map((inst:any)=>{inst["I"]=res.obj["I"];});
          setPaymentData(res.obj["GS"]);
          setAdded(false);
          setScheduleId(res.obj["_id"])
        }
        else
          setPaymentData([]);
      }).catch(()=>{
        setPaymentData([]);
      })
  },[added]);

  return (
    <div className="p-5 mx-3 my-2 ">
      <br />
      {paymentData
        ?paymentData.length==0
          ?<EmptyPageMessage sectionName="installments" />
          :<DataTable 
            headingRows={["Installment Number", "Installment Date", "Interest Rate(%)", "Action"]} headingClassNames={["w-[100px] text-center","",""," w-[200px]"]}
            tableData={paymentData} columnIDs={["D","I"]} dataTypes={["index","date","text","action"]}
            cellClassName={["w-[100px] text-center","text-center","text-center","text-center w-[200px]"]} 
            searchRows={[]} filterRows={[]}
            action={
              paymentData.map((inst:any,index:number)=>{
                if (!inst["S"] || inst["S"]==DocumentStatusList[1])
                  return <UploadFileButton key={props.AID+index} index={index}
                    AID={props.AID} sectionName={props.sectionDetails.sectionName} docId={index} _id={scheduleId}
                    setAdded={setAdded} isPayment
                  />
                else
                  return <ViewFileButton key={props.AID+index} type="pay"
                    AID={props.AID} _id={scheduleId} sectionName={props.sectionDetails.sectionName} index={index}
                    setAdded={setAdded} schedule={paymentData}
                    status={inst["S"]} rejectionReason={inst["R"]} 
                    actualName={(inst.FD && inst.FD[0] && inst.FD[0].originalname)?inst.FD[0].originalname:""} 
                    fileName={(inst.FD && inst.FD[0] && inst.FD[0].filename)?inst.FD[0].filename:""} 
                  />
              })
            }  
          />
        :<LoadingMessage sectionName="data" />
      }
    </div>
  )
}

export default SingleDealPayments;
