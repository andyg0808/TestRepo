React.initializeTouchEvents(true);
var converter = new Showdown.converter();
var QuestionViewer = React.createClass({
   loadCommentsFromServer: function() {
      $.ajax({
         url: "http://andyg0808.github.io/TestRepo/" + this.props.url,
         dataType: 'json',
         success: function(data) {
            this.setState({data: data});
         }.bind(this),
         error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
         }.bind(this)
      });
   },
   getInitialState: function() {
      return {data: [], searchText: ''};
   },
   componentDidMount: function() {
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.pollInterval);
   },
   updateFilter: function(text) {
      this.setState({searchText: text});
   },
   render: function() {
      return (
         <div className="commentBox">
            <h2>Questions</h2>
            <QuestionSearch search={this.state.searchText} onUpdate={this.updateFilter} />
            <QuestionList data={this.state.data} search={this.state.searchText} />
         </div>
      );
   }
});

var QuestionSearch = React.createClass({
   updateFilter: function() {
      this.props.onUpdate(
         this.refs.filterInput.getDOMNode().value
      );
   },
   render: function() {
      return (
         <form style={{"marginBottom": "10px"}}>
            <input type="text" ref="filterInput" placeholder="Filter..." value={this.props.search} onChange={this.updateFilter} />
         </form>
      );
   }
});

var QuestionList = React.createClass({
   render: function() {
      var search = new RegExp(this.props.search);
      var commentNodes = this.props.data.filter(function (comment) {
         //console.log(search.source);
         if (search.source) {
            return comment.Q.search(search) > -1;
         } else {
            return true;
         }
      }).map(function (comment) {
         return (
            <Question Q={comment.Q} A={comment.A}>
            </Question>
         );
      });
      return (
         <ul className="list-group">
            {commentNodes}
         </ul>
      );
   }
});

var Question = React.createClass({
   render: function() {
      return (
         <li className="list-group-item">
            <h3 className="commentAuthor">
               {this.props.Q}
            </h3>
            {this.props.A}
         </li>
      );
   }
});

$(function() {
   React.render(
      <QuestionViewer url="data.json" pollInterval={2000} />,
      document.getElementById('content')
   );
})
