var ROW_MAX = 30;
var COL_MAX = 30;

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var cellClass = "cell-" + this.props.status;
    return /*#__PURE__*/(
      React.createElement("td", {
        id: this.props.id,
        className: cellClass,
        onClick: () => this.props.handleCellClick(this.props.id) }));


  }}


function BoardRow(props) {
  var rindex = props.rindex;
  var cols = [];
  for (var j = 0; j < COL_MAX; j++) {
    var cellId = rindex * COL_MAX + j;
    var status = props.board[cellId] ? "active" : "inactive";
    cols.push( /*#__PURE__*/
    React.createElement(Cell, {
      id: cellId,
      key: cellId,
      status: status,
      handleCellClick: props.handleCellClick }));


  }
  return /*#__PURE__*/(
    React.createElement("tr", null,
    cols));


}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var rows = [];
    for (var i = 0; i < ROW_MAX; i++) {
      rows.push( /*#__PURE__*/
      React.createElement(BoardRow, {
        rindex: i,
        key: i,
        board: this.props.board,
        handleCellClick: this.props.handleCellClick }));


    }

    return /*#__PURE__*/(
      React.createElement("table", null, /*#__PURE__*/
      React.createElement("caption", null, " ", "GENERATION : " + this.props.generation,
      " "), /*#__PURE__*/
      React.createElement("tbody", null,
      rows)));



  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generation: 0,
      gameOn: false,
      board: new Array(ROW_MAX * COL_MAX).fill(0) };

    this.timerId = "";
    this.tick = this.tick.bind(this);
    this.generateNextBoardState = this.generateNextBoardState.bind(this);
    this.isCellActive = this.isCellActive.bind(this);
    this.getActiveNeighboursCount = this.getActiveNeighboursCount.bind(this);
    this.getRandomBoard = this.getRandomBoard.bind(this);

    this.handleStartStopClick = this.handleStartStopClick.bind(this);
    this.handleRandomizeClick = this.handleRandomizeClick.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
  }

  componentWillMount() {
    // doesnt causes re-rendering
    var newBoard = this.getRandomBoard();
    this.setState({
      board: newBoard });

  }

  getActiveNeighboursCount(r, c) {
    var neighbourCells = [
    [r - 1, c - 1],
    [r - 1, c],
    [r - 1, c + 1],
    [r, c - 1],
    [r, c + 1],
    [r + 1, c - 1],
    [r + 1, c],
    [r + 1, c + 1]];

    var liveNeighbours = 0;
    neighbourCells.forEach(arr => {
      var row = (arr[0] + ROW_MAX) % ROW_MAX;
      var col = (arr[1] + COL_MAX) % COL_MAX;
      /*	
      if (row >= 0 && row < ROW_MAX && (col >= 0 && col < COL_MAX)) {
      	var cellId = row * COL_MAX + col;
      	liveNeighbours += this.state.board[cellId];
      }
      */
      // wrap around board - feature
      var cellId = row * COL_MAX + col;
      liveNeighbours += this.state.board[cellId];
    });
    return liveNeighbours;
  }

  isCellActive(cellAlive, cellId) {
    var cellStatus = 0;
    var rowId = Math.floor(cellId / COL_MAX);
    var colId = cellId % COL_MAX;

    var activeNeighbours = this.getActiveNeighboursCount(rowId, colId);

    if (activeNeighbours <= 1) cellStatus = 0;else
    if (activeNeighbours === 2 || activeNeighbours === 3) {
      if (cellAlive) cellStatus = 1;
    } else if (activeNeighbours > 3) cellStatus = 0;

    if (activeNeighbours === 3 && !cellAlive) cellStatus = 1;

    return cellStatus;
  }

  tick() {
    this.timerId = setInterval(this.generateNextBoardState, 1000);
  }

  generateNextBoardState() {
    var newBoard = [];
    this.state.board.forEach((currentStatus, index) => {
      newBoard[index] = this.isCellActive(currentStatus, index);
    });

    this.setState({
      generation: this.state.generation + 1,
      board: newBoard });

  }

  getRandomBoard() {
    var initialBoard = new Array(ROW_MAX * COL_MAX).fill(0);
    initialBoard.forEach((boardValue, boardIndex) => {
      initialBoard[boardIndex] = Math.floor(Math.random() * 2);
    });
    return initialBoard;
  }

  handleStartStopClick() {
    var gameOn = !this.state.gameOn;
    this.setState({ gameOn: !this.state.gameOn });
  }

  handleRandomizeClick() {
    var newBoard = this.getRandomBoard();
    this.setState({
      generation: 0,
      gameOn: false,
      board: newBoard });

  }

  handleClearClick() {
    var newBoard = this.state.board;
    newBoard.fill(0);
    this.setState({
      generation: 0,
      gameOn: false,
      board: newBoard });

  }

  handleCellClick(cellId) {
    var newBoard = this.state.board;
    newBoard[cellId] = !this.state.board[cellId];
    this.setState({
      board: newBoard });

  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.gameOn !== nextState.gameOn) {
      if (nextState.gameOn) {
        this.tick();
      } else {
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = "";
        }
      }
    }
  }

  render() {
    var btnText = this.state.gameOn ? "STOP" : "START";
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("h3", { className: "title" }, "Conway's Game of Life"), /*#__PURE__*/
      React.createElement(Board, {
        board: this.state.board,
        generation: this.state.generation,
        handleCellClick: cellId => this.handleCellClick(cellId) }), /*#__PURE__*/

      React.createElement("div", { className: "controls" }, /*#__PURE__*/
      React.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-primary",
        onClick: this.handleStartStopClick },

      btnText), /*#__PURE__*/

      React.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-primary",
        onClick: this.handleRandomizeClick }, "Randomize"), /*#__PURE__*/



      React.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-primary",
        onClick: this.handleClearClick }, "Clear All"))));






  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("main"));