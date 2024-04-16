import { useState } from "react";
import { Table } from "@/components/ui/table"
import Search from "../BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";

function Ratings() {
  //Ratingslist is an array of different ratings
  //Each rating is an array: [Rating Agency, Rating Type, Date,Outlook]
  //Rating Type can be: Provisional (0) or Final (1)
  //Outlook can be Positive (2), Stable (1), or Negative (0) 
  const [ratingsList, setRatingsList] = useState([
    ["ICRA", 1, "02/03/02", 2, "LINK1", "AA-(Stable)"],
    ["CRISIL", 0, "15/08/17", 1, "LINK2", "A1+"],
    ["ICRA", 0, "12/06/20", 0, "LINK3", "Gold Level"]
  ])
  const [searchString, setSearchString] = useState("");

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search" />
        </div>
      </div>

      <div className="m-5">
        <Table className="border">
          <HeaderRows headingRows={[["Rating Agency"],["Rating Type"], ["Date"],["Outlook"],["Link"],["Rating"]]} />

          <BodyRowsMapping list={ratingsList} dataType={["text", "ratingType", "text", "ratingOutlook", "text", "text"]}
            searchRows={[]} filterRows={[]} cellClassName={["","","","","text-blue-500",""]} 
          />
        </Table>
      </div>
    </div>
  )
};

export default Ratings;