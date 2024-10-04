import { MenuItem, OutlinedInput, Select } from "@mui/material";

function Filter(props:{value:string[]|string, setValue:Function, options:string[], placeholderValue?:string, multiple?:boolean}){
  if (!props.options)
    return <></>;
  else
    return(
      <Select
        multiple={props.multiple}
        size="small" color="secondary"
        id="filter"
        
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}

        value={props.value}
        onChange={(e)=>props.setValue(e.target.value)}
        
        input={<OutlinedInput sx={{backgroundColor:"white", borderRadius:"10px", height:"50px"}}/>}
        renderValue={(selected) => {
          if (props.multiple && typeof selected!="string")
            return props.placeholderValue && selected.length==0?<em>Select {props.placeholderValue}</em>:selected.join(', ');
          else{
            if (selected==""){
              if (props.placeholderValue)
                return <em>Select {props.placeholderValue}</em>
              else
                return props.options[0];
            }
            else
              return selected;
          }
        }}
      >
        {props.options.map(option => {
          if (option!="-")
            return <MenuItem key={option} value={option}>{option}</MenuItem>
        })}
      </Select>
    )
}

export default Filter;