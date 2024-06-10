import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table"
//import Search from "../BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import { EnumIteratorValues, RatingAgencies, RatingOutlook, RatingTypes } from "../../../Constants";
import FormDialog from "../FormComponents/FormDialog";
import useGlobalContext from "./../../../GlobalContext";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";

function Ratings(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}) {
  const [fieldValues, setFieldValues] = useState<any>({
    "A":-1, "T":-1,
    "DT":null, "O":-1,
    "L":"", "R":"",
  });
  
  const [fieldList] = useState<any>([
    { category: "grid", row:2, sectionName:"", fields: [
      { id: "A", type: "select", name: "Rating Agency", options: EnumIteratorValues(RatingAgencies), required:true },
      { id: "T", type: "select", name: "Rating Type", options: EnumIteratorValues(RatingTypes), required:true },
      { id: "DT", type: "date", name: "Date", required:true },
      { id: "O", type: "select", name: "Outlook", options: EnumIteratorValues(RatingOutlook), required:true },
      { id: "L", type: "text", name: "Link", required:true },
      { id: "R", type: "text", name: "Rating", required:true },
    ]}
  ]);

  const {addRating, getRatingsList} = useGlobalContext();

  const [ratingsList, setRatingsList] = useState<any>();
  const [added, setAdded] = useState(true);
 // const [searchString, setSearchString] = useState("");

  useEffect(()=>{
    if (added){
      getRatingsList(props.loanId).then((res)=>{
        if (res.status==200)
          setRatingsList(res.arr);
        else
          setRatingsList([]);
      }).catch(err=>{
        console.log(err);
        setRatingsList([]);
      })
      setAdded(false);
    }
  },[added])

  const createRating = (userValues:any) =>{
    const data:any = {};

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

    if (Object.keys(data).length!=0){
      console.log("DATA", data)
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;

      addRating(data).then(res=>{
        console.log("RESPONSE",res);
        setFieldValues({});
        setAdded(true);
      }).catch(err=>{
        console.log(err);
      })
    }
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className='flex-auto'>
          {/* <Search setter={setSearchString} label="Search" /> */}
        </div>
        <div>
          <FormDialog index={-1} type="rate"
            triggerText="+ Add Rating" triggerClassName={CreateButtonStyling} formSize="medium"
            formTitle="Add New Rating"  formSubmit={createRating} submitButton="Add Rating"
            form={fieldList} fieldValues={fieldValues} setter={setFieldValues} currentFields={{}}
          />
        </div>
      </div>

      <div className="m-5">
        {ratingsList
          ?ratingsList.length==0
            ?<EmptyPageMessage sectionName="ratings" />
            :<Table className="border">
              <HeaderRows headingRows={["Rating Agency", "Rating Type", "Date", "Outlook", "Link", "Rating"]} />

              <BodyRowsMapping list={ratingsList} columns={["A","T","DT","O","L","R",]} dataType={["ratingAgency", "ratingType", "date", "ratingOutlook", "text", "text"]}
                searchRows={[]} filterRows={[]} cellClassName={["","","","","text-blue-500",""]} 
              />
          </Table>
          :<LoadingMessage sectionName="ratings" />
        }
      </div>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
};

export default Ratings;