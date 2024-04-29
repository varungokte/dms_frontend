import { useState } from "react";
import { Table } from "@/components/ui/table"
import Search from "../BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import { EnumIteratorValues, RatingAgencies, RatingOutlook, RatingTypes, RatingValues } from "../BasicComponents/Constants";
import FormDialog from "../BasicComponents/FormDialog";
import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";

function Ratings() {
  //Ratingslist is an array of different ratings
  //Each rating is an array: [Rating Agency, Rating Type, Date,Outlook]
  //Rating Type can be: Provisional (0) or Final (1)
  //Outlook can be Positive (2), Stable (1), or Negative (0)
  
  const [fieldValues, setFieldValues] = useState({
    "A":null, "T":null,
    "D":null, "O":null,
    "L":null, "R":null,
  });
  
  const [fieldList, setFieldList] = useState([
    { category: "grid", row:2, sectionName:"", fields: [
      { id: "A", type: "select", name: "Rating Agency", options: EnumIteratorValues(RatingAgencies) },
      { id: "T", type: "select", name: "Rating Type", options: EnumIteratorValues(RatingTypes) },
      { id: "D", type: "date", name: "Date" },
      { id: "O", type: "select", name: "Outlook", options: EnumIteratorValues(RatingOutlook) },
      { id: "L", type: "text", name: "Link" },
      { id: "R", type: "select", name: "Rating Type", options: EnumIteratorValues(RatingValues) },
    ]}
  ])

  const [ratingsList, setRatingsList] = useState([
    [1, 1, "02/03/02", 2, "LINK1", 3],
    [2, 2, "15/08/17", 1, "LINK2", 2],
    [1, 1, "12/06/20", 3, "LINK3", 1]
  ])
  const [searchString, setSearchString] = useState("");

  const createRating = (e:any) =>{
    e.preventDefault();
    
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className='flex-auto'>
          <Search setter={setSearchString} label="Search" />
        </div>
        <div>
          <FormDialog 
            triggerText="+ Add Rating" triggerClassName={PurpleButtonStyling} formSize="medium"
            formTitle="Add New Rating"  formSubmit={createRating} submitButton="Add Rating"
            form = {fieldList} setter={setFieldValues}
          />
        </div>
      </div>

      <div className="m-5">
        <Table className="border">
          <HeaderRows headingRows={[["Rating Agency"],["Rating Type"], ["Date"],["Outlook"],["Link"],["Rating"]]} />

          <BodyRowsMapping list={ratingsList} dataType={["ratingAgency", "ratingType", "text", "ratingOutlook", "text", "ratingValue"]}
            searchRows={[]} filterRows={[]} cellClassName={["","","","","text-blue-500",""]} 
          />
        </Table>
      </div>
    </div>
  )
};

export default Ratings;