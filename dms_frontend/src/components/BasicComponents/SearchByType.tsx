import { Button, FormGroup, MenuItem, OutlinedInput, Select } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";

function SearchByType(props:{searchType:string, setSearchType:Function, searchString:string, setSearchString:Function, typeOptions:{label:string,value:string}[], className?:string }){
  const [searchString, setSearchString] = useState(props.searchString);
  const [errorMessage, setErrorMessage] = useState(<></>);

  const search = () => {
    if (props.searchType=="" && searchString!="")
      setErrorMessage(<small className="text-red-600">Please select type of search parameter</small>)
    else
      props.setSearchString(searchString);
  }

  useEffect(()=>setSearchString(curr=>curr+""),[props.searchType])

  useEffect(()=>setErrorMessage(<></>),[props.searchType,searchString])

  return (
    <div className={props.className}>
      <FormGroup row>
        <OutlinedInput 
          size="small" 
          color="secondary"
          sx={{padding:"0px 0px 0px 0px", height:"47px", backgroundColor:"white"}}
          value={searchString||""}
          onChange={(e)=>setSearchString(e.target.value)}
          placeholder="Search"
          startAdornment={
            <Select
              color="secondary"
              value={props.searchType}
              onChange={(e)=>props.setSearchType(e.target.value)} size="small"
              displayEmpty
              className="mr-2 bg-slate-200"
              sx={{borderRadius:"5px", height:"47px"}}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value=""><em>Select Type</em></MenuItem>
              {props.typeOptions.map((option,index)=><MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
            </Select>
          }
          endAdornment={
            <Button className="h-[95%]" variant="contained" color="secondary" onClick={search}>
              <SearchIcon/>
            </Button>
          }
        />
      </FormGroup>
      {errorMessage}
    </div>
  )
}


export default SearchByType;