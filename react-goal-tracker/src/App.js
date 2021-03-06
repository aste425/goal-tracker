import './App.css';
import React, { useEffect } from 'react';
import List from './List';
import Alert from './Alert';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { uuid } from 'uuidv4';

function App() {

  const loadData = () => {
    const data = localStorage.getItem('list');
    if(data){
      return JSON.parse(data);
    }
    return [];
  }

  const [buttonName, setButtonName] = React.useState('Submit');
  const [inputGoal, setInputGoal] = React.useState('Enter Goal Here...');
  const [goalList, setGoalList] = React.useState(loadData);
  const [editingElement, setEditingElement] = React.useState({})
  const [alert, setAlert] = React.useState({
    msg: '',
    state: '',
    show: false
  });

  const removeAlert = () => {
    setAlert({
      msg: '',
      state: '',
      show: false
    })
  }

  const goalChange = (e) => {
    setInputGoal(e.target.value);
  }

  const buttonOnClickHandler = (e) => {

    // check in which state the button was pressed
    if(!inputGoal){
      setAlert({
        msg: 'Please Enter A Goal',
        state: 'danger',
        show: true
      }); 
    }else if(buttonName === 'Edit'){
      // remove the element with the same id from the list
      const newGoalList = goalList.map((goal) => {
        if(goal.id === editingElement.id){
          return { ...goal, name: inputGoal};
        }
        return goal;
      });

      setGoalList(newGoalList);
      setInputGoal('');
      setButtonName('Submit');

      setAlert({
        msg: 'You Edited A Goal!',
        state: 'success',
        show: true
      }); 

    }else{
      // create a goal with a unique ID
      const newGoal = {
        name: inputGoal,
        id: uuid()
      }

      // add the new goal to the list of goals
      setGoalList([...goalList, newGoal]);
      setInputGoal('');

      setAlert({
        msg: 'You Made A New Goal!',
        state: 'success',
        show: true
      }); 
    }
  }

  const editGoal = (id) => {
    setButtonName('Edit');
    const goalElement = goalList.filter((goal) => {
      return goal.id === id;
    })
    setInputGoal(goalElement[0].name);
    setEditingElement(goalElement[0]);
  }

  const removeGoal = (id) => {
    const newList = goalList.filter((goal) => {
      return goal.id !== id;
    })
    setGoalList(newList);
    setAlert({
        msg: 'You Finished A Goal!',
        state: 'success',
        show: true
      }); 
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(goalList))
  }, [goalList])

  return (
    <div className="center-div">
      <h1 id="app-title">Goal Tracker</h1>
      <Alert alert={alert} removeAlert={removeAlert} goalList={goalList}/>
      <div className="form-div">
        <input id="input-box" type="text" value={inputGoal} onChange={goalChange}/>
        <button className="btn btn-primary" onClick={buttonOnClickHandler}>{buttonName}</button>
      </div>
      <List list={goalList} removeGoal={removeGoal} editGoal={editGoal}/>
      <div>
        <button id="clear-button" className="btn btn-primary" onClick={() => setGoalList([])}>Clear All</button>
      </div>
    </div>
  );
}

export default App;
