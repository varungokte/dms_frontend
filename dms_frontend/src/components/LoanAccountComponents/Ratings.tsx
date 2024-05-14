import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table"
//import Search from "../BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import { EnumIteratorValues, RatingAgencies, RatingOutlook, RatingTypes } from "../BasicComponents/Constants";
import FormDialog from "../BasicComponents/FormDialog";
import useGlobalContext from "./../../../GlobalContext";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";

function Ratings(props:any) {
  //Ratingslist is an array of different ratings
  //Each rating is an array: [Rating Agency, Rating Type, Date,Outlook]
  //Rating Type can be: Provisional (0) or Final (1)
  //Outlook can be Positive (2), Stable (1), or Negative (0)
  
  const [fieldValues, setFieldValues] = useState({
    "A":1, "T":1,
    "DT":null, "O":1,
    "L":"", "R":"",
  });
  
  const [fieldList] = useState([
    { category: "grid", row:2, sectionName:"", fields: [
      { id: "A", type: "select", name: "Rating Agency", options: EnumIteratorValues(RatingAgencies) },
      { id: "T", type: "select", name: "Rating Type", options: EnumIteratorValues(RatingTypes) },
      { id: "DT", type: "date", name: "Date" },
      { id: "O", type: "select", name: "Outlook", options: EnumIteratorValues(RatingOutlook) },
      { id: "L", type: "text", name: "Link" },
      { id: "R", type: "text", name: "Rating" },
    ]}
  ]);

  const {addRating, getRatingsList} = useGlobalContext();

  const [ratingsList, setRatingsList] = useState([])
 // const [searchString, setSearchString] = useState("");

  useEffect(()=>{
    getRatingsList(props.loanId).then(res=>{
      console.log(res, res);
      const arr:any= [];
      res.map((rating:any)=>{
        console.log(rating)
        arr.push([rating.A, rating.T, rating.DT, rating.O, rating.L, rating.R]);
        console.log(arr)
      })
      setRatingsList(res);
    }).catch(err=>{
      console.log(err);
    })
  },[])

  const createRating = (e:any) =>{
    e.preventDefault();
    const data:any = {};

    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        //@ts-ignore
        data[field.id] = fieldValues[field.id];
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          //@ts-ignore
          data[gridField.id] = fieldValues[gridField.id]
        }
      }
    }

    if (Object.keys(data).length!=0){
      console.log("DATA", data)
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;

      addRating(data).then(res=>{
        console.log("RESPONSE",res);
      }).catch(err=>{
        console.log(err);
      })
    }
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        {/* <div className='flex-auto'>
          <Search setter={setSearchString} label="Search" />
        </div> */}
        <div>
          <FormDialog 
            triggerText="+ Add Rating" triggerClassName={CreateButtonStyling} formSize="medium"
            formTitle="Add New Rating"  formSubmit={createRating} submitButton="Add Rating"
            form = {fieldList} setter={setFieldValues}
          />
        </div>
      </div>

      <div className="m-5">
        <Table className="border">
          <HeaderRows headingRows={[["Rating Agency"],["Rating Type"], ["Date"],["Outlook"],["Link"],["Rating"]]} />

          <BodyRowsMapping list={ratingsList} columns={["A","T","DT","O","L","R",]} dataType={["ratingAgency", "ratingType", "text", "ratingOutlook", "text", "text"]}
            searchRows={[]} filterRows={[]} cellClassName={["","","","","text-blue-500",""]} 
          />
        </Table>
      </div>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
};

export default Ratings;