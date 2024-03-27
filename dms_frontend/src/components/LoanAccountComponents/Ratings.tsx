import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"


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
  
  enum RatingTypes {
    "Provisional",
    "Final"
  };

  enum RatingOutlook {
    "Negative",
    "Stable",
    "Positive"
  };

  

  return(
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold mx-7 mb-5">Contact Details</p>

      <div className="flex flex-row">
        <div className=''>
          <input type="text" className="border-2 mx-10 p-3 rounded-xl my-2 w-72" 
          onChange={(e)=>{
            const val = e.target.value+"";
            setSearchString(val.replace("\\", "/\\/"))
          }} 
          placeholder="Search"/>
        </div>
      </div>

      <div className="m-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rating Agency</TableHead>
            <TableHead>Rating Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Outlook</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratingsList.map(rating =>{
            return(
              <TableRow>
                <TableCell>{rating[0]}</TableCell>
                <TableCell>{RatingTypes[Number(rating[1])]}</TableCell>
                <TableCell>{rating[2]}</TableCell>
                <TableCell>{RatingOutlook[Number(rating[3])]}</TableCell>
                <TableCell className="text-blue-500">{rating[4]}</TableCell>
                <TableCell>{rating[5]}</TableCell>
              </TableRow>
            )
          })}
          
        </TableBody>
      </Table>

      </div>
    </div>
  )
};

export default Ratings;