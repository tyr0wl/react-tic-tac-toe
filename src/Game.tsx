import { SquareValue } from "./SquareValue";
import React from "react";
import { Board } from "./Board";
import { calculateWinner } from "./calculateWinner";

export type GameState = { history: HistoryEntry[], move: number, xIsNext: boolean, sortAsc: boolean, winner: { player: SquareValue, squares: number[] } | null };
type HistoryEntry = { squares: SquareValue[], step: number, index: number | null };

export class Game extends React.Component<{}, GameState> {
    public constructor(props: GameState) {
        super(props);

        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    step: 0,
                    index: null,
                }
            ],
            move: 0,
            xIsNext: true,
            sortAsc: true,
            winner: null,
        }
    }

    private handleClick(index: number) {
        const nextMove = this.state.move + 1;
        const history = this.state.history.slice(0, nextMove);
        const historyEntry = history[history.length - 1];
        const squares = historyEntry.squares.slice();
        if (squares[index] || calculateWinner(squares)) {
            return;
        }

        squares[index] = this.state.xIsNext ? "X" : "O";
        const winner = calculateWinner(squares);

        this.setState({
            history: history.concat([{
                squares,
                step: nextMove,
                index,
            }]),
            move: nextMove,
            xIsNext: !this.state.xIsNext,
            winner,
        });
    }

    public render() {
        const history = this.state.history;
        const historyEntry = history[this.state.move];

        let status;
        if (this.state.winner) {
            status = `Winner: ${this.state.winner.player}`;
        } else if (history.length === 10) {
            status = `draw`;
        } else {
            const next = (this.state.xIsNext ? "X" : "O");
            status = `Next player: ${next}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={historyEntry.squares}
                        line={this.state.winner?.squares ?? []}
                        onClick={(index: number) => this.handleClick(index)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <span>{status}</span>
                        <button className="sortButton" onClick={() => this.toggleSort()}>sort</button>
                    </div>
                    <ol>{this.renderMoves(history)}</ol>
                </div>
            </div>
        );
    }

    private toggleSort() {
        this.setState({
            sortAsc: !this.state.sortAsc
        });
    }

    private renderMoves(history: HistoryEntry[]) {
        let moves = history.map((entry) => {
            let desc;

            if (entry.step) {
                if (entry.index != null) {
                    const row = Math.trunc(entry.index / 3) + 1;
                    const column = (entry.index % 3) + 1;
                    desc = `move ${column} - ${row}`;
                }
                else {
                    desc = `move #${entry.step}`;
                }
            }
            else {
                desc = "start";
            }

            const fontWeight = this.state.move === entry.step ? "bold" : "normal";
            return (
                <li key={"li" + entry.step}>
                    <button onClick={() => this.jumpTo(entry.step)} style={{ fontWeight }}>{desc}</button>
                </li>
            );
        });

        if (!this.state.sortAsc) {
            moves = moves.reverse();
        }
        return moves;
    }

    private jumpTo(move: number) {
        this.setState({
            move: move,
            xIsNext: (move % 2) === 0,
        });
    }
}
