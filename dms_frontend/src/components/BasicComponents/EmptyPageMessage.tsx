function EmptyPageMessage(props:{sectionName:string, emotion?:boolean}){
  return (
    <div className="text-center m-auto ">
      <br/>
      <p className="font-medium text-xl text-gray-500">No {props.sectionName} here{props.emotion?` :(`:"."}</p>
    </div>
    )
}

export default EmptyPageMessage;