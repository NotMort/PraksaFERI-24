import React, {useState,useLayoutEffect,useEffect,useRef,useReducer} from "react";

const ACTIONS = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement'
}

function reducer(state,action){
  console.log(action.payload)
  switch(action.type){
    case ACTIONS.INCREMENT:
      return{ count: state.count+1}
    case ACTIONS.DECREMENT:
      return{count:state.count-1}
    default:
      return state
  }
  
}
function App() {
  const [name,setName] =useState('')
  const [state,dispatch] = useReducer(reducer,{count : 0})
  //const [state,setState] = useState({count: 4, theme: 'blue'})
  //const renderCount = useRef(1)
  const inputRef = useRef()
  //const count = state.count
  //const theme = state.theme

  function decrementCount(){
   // setState(prevState=>{return{...prevState,count: prevState.count-1}})
   dispatch({type: ACTIONS.DECREMENT})
  }
  function incrementCount(){
    //setState(prevState=>{return{...prevState,count: prevState.count+1}})
   dispatch({type: ACTIONS.INCREMENT, payload:{test: "nekaj"}})

  }
  const prevName = useRef('')
  //asinc
  useEffect(()=>{
    //renderCount.current= renderCount.current+1
    prevName.current = name
  },[name])
  //sinc
  useLayoutEffect(()=>{

  })
  function focus(){
    inputRef.current.focus()
  }

  return (
   <>
    <button onClick={decrementCount}>-</button>
    <span>{state.count}</span>
   
    <button onClick={incrementCount}>+</button>
    <input ref={inputRef} value={name} onChange={e => setName(e.target.value)}></input>
    <div> My name is {name} and it used to be {prevName.current}</div>
    <button onClick={focus}>  focus</button>
   </>
  );
}

export default App;
