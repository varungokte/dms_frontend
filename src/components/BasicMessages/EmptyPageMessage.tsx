function EmptyPageMessage(props:{sectionName:string, emotion?:boolean, override?:boolean}){
  return (
    <div className="text-center m-auto">
      <br/>
      <p className="font-medium text-xl text-gray-500">
        {props.override
          ?props.sectionName
          :`No ${props.sectionName.toLowerCase()} here${props.emotion?` :(`:"."}`
        }
      </p>
    </div>
    )
}

export default EmptyPageMessage;