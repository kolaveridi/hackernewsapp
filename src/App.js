import React, { Component } from 'react';
import './App.css';
const DEFAULT_QUERY = 'redux';
const PATH_BASE='https://hn.algolia.com/api/v1';
const PATH_SEARCH='/search';
const PARAM_SEARCH='query=';



/*function isSearched(searchTerm){
    return function(item){
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}*/
class Button extends Component{
    render(){
      const {onClick,className='',children}=this.props;
      return(
       <button
        type="button"
        onClick={onClick}
        className={className}
       >{children}</button>
      );
    }
  }
// functional stateless components
const Search =({value,onChange,children,onSubmit}) =>
      <form onSubmit={onSubmit}>{children}
       <input
       type="text"
       value={value}
       onChange={onChange}
       />
       <button type="submit" >
         {children}
         </button>
       </form>



class Table extends Component{
  render(){
     const {list,pattern,onDismiss}=this.props;
     return(
     <div className="table">
     {list.map( item =>
            <div key={item.objectID} className="table-row">
            <span>
             <a href={item.url}>{item.title}</a>
            </span>
             <span>{item.num_comments}</span><br></br>
             <span>{item.points}</span>
             <span><br></br>
            <Button
             onClick={() => onDismiss(item.objectID)}
             className="button-inline"
              > Dismiss
            </Button>
            </span>
           </div>
            )}
            </div>
          );
        }
      }



class App extends Component{
   constructor(props){
     super(props);
     this.state={
       result:null,
       searchTerm:DEFAULT_QUERY,
     };
     this.onDismiss=this.onDismiss.bind(this);
     this.onSearchChange=this.onSearchChange.bind(this);
     this.setSearchTopStories=this.setSearchTopStories.bind(this);
     this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
     this.onSearchSubmit=this.onSearchSubmit.bind(this);
   }
   onSearchSubmit(event){
     const{searchTerm}=this.state;
     this.fetchSearchTopStories(searchTerm);
     event.preventDefault();
   }
   onDismiss(id){
      const isNotId=(item)=>item.objectID!==id;
      const updatedHits=this.state.result.hits.filter(isNotId);
      this.setState({
        result: { ...this.state.result, hits: updatedHits }
      });
   }
   onSearchChange(event){
      this.setState(
        {searchTerm:event.target.value}
      )
   }
   setSearchTopStories(result){
     this.setState(
       {result}
     )
   }
   fetchSearchTopStories(searchTerm){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
       .then(response => response.json())
       .then(result => this.setSearchTopStories(result))
       .catch(e => e);
   }
   componentDidMount(){
     const{searchTerm}=this.state;
     this.fetchSearchTopStories(searchTerm);
   }

   render(){
     const {searchTerm,result}=this.state;//es6 Destructuring
     if(!result)
     {return null;}
     return(
       <div className="page">
        <div className="interactions">
        <Search  value={searchTerm}   onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}> Search </Search>
        </div>

       { result && <Table list={result.hits}  onDismiss={this.onDismiss}  /> }
       </div>
     );

   }

}

export default App;
