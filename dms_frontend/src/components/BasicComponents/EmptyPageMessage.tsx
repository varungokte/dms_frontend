function EmptyPageMessage(props:{sectionName:string, emotion?:boolean}){
  return <p className="text-center m-auto font-medium text-xl text-gray-500">No {props.sectionName} here{props.emotion?` :(`:"."}</p>
}

export default EmptyPageMessage;