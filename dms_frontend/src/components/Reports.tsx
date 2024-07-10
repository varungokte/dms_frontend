import { useEffect, useRef, useState } from "react";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { CSVLink } from "react-csv";
import { FieldValues, GridFieldAttributes } from "DataTypes";
import TextField from "./FormFieldComponents/TextField";
import DateField from "./FormFieldComponents/DateField";
import SelectField from "./FormFieldComponents/SelectField";

function Reports(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [data,setData] = useState<FieldValues[]>();
  const [headers,setHeaders] = useState<{label:string, key:string}[]>();
  const [filename] = useState("clone-wars-v4.csv");

  const [fieldList] = useState<GridFieldAttributes>({
    category:"grid", row:2, fields:[
      {id:"T", name:"Loan Type", type:"text"},
      {id:"Z", name:"Zonal Head", type:"text"},
      {id:"D", name:"Date", type:"date"},
    ]
  });

  const downloadRef = useRef<CSVLink & HTMLAnchorElement & {link: HTMLAnchorElement}>(null);

  const submitForm = (e:any) => {
    e.preventDefault();

    setData([
      { ln:"Skywalker", fn:"Anakin", r:"Jedi Knight", f:"Galactic Republic", h:"Tatooine"},
      { ln:"Kenobi", fn:"Obi-Wan", r:"Jedi Master", f:"Galactic Republic", h:"Coruscant"},
      { ln:"Gunray", fn:"Nute", r:"Viceroy", f:"Trade Federation", h:"Cato Nemoidia"},
    ])

    setHeaders([
      {label:"Last Name" , key: "ln"},
      {label:"First Name" , key: "fn"},
      {label:"Rank", key:"r"},
      {label:"Faction", key:"f"},
      {label:"Homeworld", key:"h"},
    ]);

    if (downloadRef && downloadRef.current)
      downloadRef.current.link.click();
  }

  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  
  return(
    <div>
      <p className="text-3xl font-bold m-7">{props.label}</p>
      <div className="bg-white rounded-xl m-7 p-5">
        <form onSubmit={submitForm}>
          <div className="grid grid-cols-2">
            {fieldList["fields"].map((field)=>{
              if (field.type=="select")
                return <SelectField key={field.id} index={field.id} id={field.id} name={field.name} setPrefillValues={setFieldValues} prefillValues={fieldValues} options={field.options||[]} required={field.required||false} disabled={field.disabled} />
              else if (field.type=="date")
                return <DateField key={field.id} index={field.id} id={field.id} name={field.name||""} setPrefillValues={setFieldValues} prefillValues={fieldValues} required={field.required||false} disabled={field.disabled} />
              else
                return <TextField key={field.id} index={field.id} id={field.id} name={field.name||""} setPrefillValues={setFieldValues} prefillValues={fieldValues} type={field.type||""} required={field.required||false} disabled={field.disabled} />
            })}
          </div>
          <br/>
          <button className={CreateButtonStyling} type="submit">Download Report</button>
        </form>
        <CSVLink ref={downloadRef} headers={headers} data={data||[{}]} filename={filename}></CSVLink>
      </div>
    </div>
  )
}

export default Reports;