import { MenuItem, OutlinedInput, Select } from "@mui/material";

function Filter(props:{value:string[]|string, setValue:Function, options:string[], placeholderValue?:string, multiple?:boolean}){
  return(
    <Select
      multiple={props.multiple}
      displayEmpty
      value={props.value}
      onChange={(e)=>props.setValue(e.target.value)}
      input={<OutlinedInput sx={{borderRadius:"10px", height:"50px"}}/>}
      renderValue={(selected) => {
        if (typeof selected==="string")
          return selected;
        if (props.placeholderValue && selected.length==0) 
          return <em>Select {props.placeholderValue}</em>;
        return selected.join(', ');
      }}
      inputProps={{ 'aria-label': 'Without label' }}
    >
      {props.options.map(option => {
        if (option!="-")
          return <MenuItem key={option} value={option}>{option}</MenuItem>
      })}
    </Select>
  )
}

export default Filter;