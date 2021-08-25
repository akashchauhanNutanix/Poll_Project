import React from 'react';
import { Component } from 'react';
import '../App.css'
 
export default class Categories extends Component {
    state = {
        polls: [],
        isLoaded: false,
        error: null,
    }

    componentDidMount() {
        fetch("http://localhost:4000/v1/polls/" + this.props.catId)
            .then((response) => {
                if (response.status !== "200") {
                    let err = Error;
                    err.message = ("Invalid response code: ", response.status);
                    this.setState({error: err});
                }
                return response.json();
            })
            .then((json) => {
                this.setState({
                    polls: json.polls,
                    isLoaded: true,
                },
                (error) => {
                    this.setState({
                        isLoaded : true,
                        error
                    });
                }
                );
            })
    }

    changeText = (id) => {
        this.setState(
            this.state.polls.map((item) => {
                if(item.id===id) item.voted = !item.voted
                return item
            })
        );
        
    }
    vote (i, index) {
        let newOptions = [...this.state.polls[index].options];
        newOptions[i].polloptions.count = newOptions[i].polloptions.count+1
        this.setState({options: newOptions});
        if(this.state.polls[index].options[i].polloptions.count %2 ==0){
            newOptions[i].polloptions.votes--;
        } else {
            newOptions[i].polloptions.votes++;
        }
		
		function swap(array, i, j) {
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
        this.setState({options: newOptions});
        console.log(this.state.polls[index].options[i].polloptions.count)
		
		
	}

    render(){
        let {polls, isLoaded, error} = this.state;

        if(!polls){
            polls = []
        }
        if (error){
            return <div>Error: {error.message}</div>
        }else if (!isLoaded){
            return <p>Loading...</p>
        }else{
            return (
                <div> 
                <div className="clearfix"></div>
                <nav className="navbar">
                <div className="navbar-header">
                <p className="navbar-brand">CATEGORY: {this.props.title}</p>
                </div>
                </nav>
                <ul>
                {polls.map((p,index) => {
                    return(
                        <div class="col-md-6 col-md-offset-3" key={index}>
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <span class="glyphicon glyphicon-circle-arrow-right"></span>{p.ques}</h3>
                            </div>
                            
                            <div className="panel-body two-col">
                            {p.options.map((optn,i) =>
                                <div class="row" key={i}>
                                    <div class="col-md-6">
                                        <div class="well well-sm">
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" value="" onClick={this.vote.bind(this,i,index)} />
                                                    {optn.polloptions.name}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="well well-sm">
                                            <div class="voteCount">
                                                Votes: {optn.polloptions.votes}
                                            </div>
                                        </div>
                                    </div>
                                </div>                           
                               
                            )}                              
                            </div>
                            
                            <div class="panel-footer">
                                <button type="button" className="btn btn-success btn-sm" onClick={() => this.changeText(p.id)}>
                                    
                                    <span class="glyphicon glyphicon-ok"></span>{p.voted ? "Voted" : "Vote"}
                                </button>
                                &nbsp;&nbsp;
                                <button type="button" class="btn btn-primary btn-sm" onClick={event => window.location.href=`/${p.id}`}>
                                    View Result
                                    </button>
                            </div>
                        </div>
                    </div>
                    )
                
                })}
                </ul>
                </div>
            
            )
        }
        
    }
    
}