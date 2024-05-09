import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";

/* 
props:
  optionsList= [
    { values: ["Person Name","email@email"], label: "Person Name<email@email>" },
    { values: ["",""], label: "" },
  ]
  label=""
  value=""
  setValue()
  type: "single" || "double"
*/

function Combobox(props:any){
  const [options] = useState(props.optionsList);

  const [open, setOpen] = useState(false);

	useEffect(()=>{
		console.log("THIS IS VALUE ",props);
	},[]);

  console.log("SET NEW ")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className=" border rounded-if w-full h-10/12 p-4 justify-between"
        >
          {props.type=="single"
            ?(props.value
              ? options.find((option:any) => option.value === props.value)?.label
              : `Select ${props.label}`)
            :(props.searchFields.map((field:any)=>{
              (props.value
                ? options.find((option:any) => option.values[field] === props.value)?.label
                : `Select ${props.label}`)
            }))
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Select ${props.label}`} />
					<CommandList>
						<CommandEmpty>No options found.</CommandEmpty>
						<CommandGroup>
              {props.type=="single"
                ?options.map((option:any) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      props.setValue(currentValue === props.value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        props.value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                )):options.map((option:any) => (
                  <CommandItem
                    key={option.values.N}
                    value={option.values}
                    onSelect={(currentValues) => {
                      props.setValue(currentValues.includes(props.value) ? "" : currentValues)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        options.values.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))
              }
							{}
						</CommandGroup>
					</CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox;