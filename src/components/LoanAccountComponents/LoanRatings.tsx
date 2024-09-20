import { useContext, useEffect, useState } from "react";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { FieldAttributesList } from "@/types/FormAttributes";
import { LoanCommonProps } from "@/types/ComponentProps";
import { getModSecName } from "@/functions/sectionNameAttributes";
import { addRating, getRatingsList } from "@/apiFunctions/ratingAPIs";
import { MasterValuesContext, PermissionContext } from "@/Contexts";

import DataTable from "../BasicTables/Table";
import FormDialog from "../FormComponents/FormDialog";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import EmptyPageMessage from "../BasicMessages/EmptyPageMessage";
import LoadingMessage from "../BasicMessages/LoadingMessage";

import Toast from "../BasicComponents/Toast";
import { Pagination } from "../BasicComponents/Pagination";
import AddButton from "../BasicButtons/AddButton";
//import Search from "../BasicComponents/Search";

function LoanRatings(props:LoanCommonProps) {
  const masters = useContext(MasterValuesContext);

  if (!masters) return;

  const { RatingAgencyList, RatingOutlookList, RatingTypeList } = masters;

  const fieldList: FieldAttributesList = [
    { category: "grid", row:2, sectionName:"", fields: [
      { id: "A", type: "select", name: "Rating Agency", options: RatingAgencyList, required:true },
      { id: "T", type: "select", name: "Rating Type", options: RatingTypeList, required:true },
      { id: "DT", type: "date", name: "Date", required:true },
      { id: "O", type: "select", name: "Outlook", options: RatingOutlookList, required:true },
      { id: "V", type: "text", name: "Rating Value", required:true },
      { id: "L", type: "text", name: "Link", required:true },
    ]}
  ];
  
  const {userPermissions} = useContext(PermissionContext);

  const [addOpen, setAddOpen] = useState([false]);

  const [ratingsList, setRatingsList] = useState<FieldValues[]>();
  const [added, setAdded] = useState(true);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  // const [searchString, setSearchString] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    props.setUnsavedWarning(false);
  },[]);

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage]);

  useEffect(()=>{
    if (added){
      getRatingsList({loanId:props.loanId, currentPage:currentPage, rowsPerPage:rowsPerPage}).then((res)=>{
        console.log("ratings response",res.arr)
        if (res.status==200){
          setRatingsList(res.arr[0]["data"]);
          if (res.arr && res.arr[0] && res.arr[0]["metadata"] && res.arr[0]["metadata"][0])
            setTotalPages(Math.ceil(Number(res.arr[0]["metadata"][0]["total"])/Number(rowsPerPage)));
        }
        else
          setRatingsList([]);
      }).catch(err=>{
        console.log(err);
        setRatingsList([]);
      })
      setAdded(false);
    }
  },[added]);

  const createRating = async (userValues:any) =>{
    const data:FieldValues = {};

    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single")
        data[field.id] = userValues[field.id];
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = userValues[gridField.id]
        }
      }
    }

    data["AID"]= props.AID;
    data["_loanId"]= props.loanId;
    //console.log("SUBMITTED ratings NOW", data);

    const res  = await addRating(data);
    
    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Rating"});
    }
    else
      setToastOptions({open:true, type:"error", action:"add", section:"Rating"});
    return res;
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className='flex-auto'>
          {/* <Search setter={setSearchString} label="Search" /> */}
        </div>
        <div>
          {props.actionType=="VIEW" || !(userPermissions["loan"].includes("add") && userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("add"))
            ?<></>
            :<div>
              <AddButton sectionName="rating" onClick={()=>setAddOpen([true])} />
              {addOpen[0]
                ?<FormDialog index={0} type="rate"
                  formOpen={addOpen[0]} setFormOpen={setAddOpen} formSize="md"
                  formTitle="Add New Rating"  formSubmit={createRating} submitButton="Add Rating"
                  form={fieldList} currentFields={{}}
                />
                :<></>
              }
            </div>
          }
        </div>
      </div>

    
      <div className="m-5">
        {ratingsList
          ?ratingsList.length==0
            ?<EmptyPageMessage sectionName="ratings" />
            :<DataTable className="border"
              columnData={[
                {id:"A", heading:"Rating Agency", type:"text"},
                {id:"T", heading:"Rating Type", type:"text"},
                {id:"DT", heading:"Date", type:"date"},
                {id:"O", heading:"Outlook", type:"text"},
                {id:"V", heading:"Rating Value", type:"text"},
                {id:"L", heading:"Link", type:"text", cellClassName:"text-blue-500"}
              ]}
              //headingRows={["Rating Agency", "Rating Type", "Date", "Outlook", "Rating Value", "Link"]} 
              //columnIDs={["A","T","DT","O","V","L"]} dataTypes={["text", "text", "date", "text", "text", "text"]}
              //cellClassName={["","","","","",""]} 
              tableData={ratingsList} 
            />
          :<LoadingMessage sectionName="ratings" />
        }
      </div>
      {ratingsList && ratingsList.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
      <br />
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} />
    </div>
  )
};

export default LoanRatings;