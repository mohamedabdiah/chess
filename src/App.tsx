import './ChessBoard.css'
import { useState } from 'react'

function App() {
  // Initialize board state
  const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [playerTurn, setPlayerTurn] = useState<'white' | 'black'>('white');
  
  // Check if a piece belongs to current player
  const isPieceFromCurrentPlayer = (piece: string) => {
    if (!piece) return false;
    
    const isWhitePiece = '♔♕♖♗♘♙'.includes(piece);
    return (playerTurn === 'white' && isWhitePiece) || 
           (playerTurn === 'black' && !isWhitePiece && piece !== '');
  };

  // Handle click on a square
  const handleSquareClick = (row: number, col: number) => {
    // If no piece is selected yet
    if (!selectedPiece) {
      // If the clicked square has a piece from current player
      if (isPieceFromCurrentPlayer(board[row][col])) {
        setSelectedPiece({ row, col });
      }
    } 
    // If a piece is already selected
    else {
      // Check if clicking on the same piece (deselect)
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        return;
      }
      
      // Check if clicking on another piece from the same player (select that piece instead)
      if (isPieceFromCurrentPlayer(board[row][col])) {
        setSelectedPiece({ row, col });
        return;
      }
      
      // Otherwise, attempt to move the piece
      const newBoard = [...board.map(row => [...row])]; // Deep copy
      newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
      newBoard[selectedPiece.row][selectedPiece.col] = '';
      
      setBoard(newBoard);
      setSelectedPiece(null);
      // Switch turns
      setPlayerTurn(playerTurn === 'white' ? 'black' : 'white');
    }
  };

  // Check if a square is selected
  const isSquareSelected = (row: number, col: number) => {
    return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
  };
  
  // Generate the 8x8 chess board
  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      const squares = [];
      for (let j = 0; j < 8; j++) {
        const isWhite = (i + j) % 2 === 0;
        const piece = board[i][j];
        const isSelected = isSquareSelected(i, j);
        
        squares.push(
          <div 
            key={`${i}-${j}`} 
            className={`square ${isWhite ? 'white' : 'black'} ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSquareClick(i, j)}
          >
            <span className="piece">{piece}</span>
          </div>
        );
      }
      rows.push(<div key={i} className="row">{squares}</div>);
    }
    return rows;
  };

  return (
    <div className="chess-container">
      <div className="turn-indicator">
        Current turn: {playerTurn === 'white' ? 'White' : 'Black'}
      </div>
      <div className="chess-board">
        {renderBoard()}
      </div>
    </div>
  )
}

export default App
