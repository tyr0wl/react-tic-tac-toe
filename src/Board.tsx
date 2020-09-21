import React from "react";
import { Square } from "./Square";
import { SquareValue } from "./SquareValue";

export type BoardProps = { squares: SquareValue[], onClick(index: number): void, line: number[] };

export class Board extends React.Component<BoardProps> {

    constructor(props: BoardProps) {
        super(props);
        this.renderSquare = this.renderSquare.bind(this);
    }

    renderSquare(index: number) {
        return <Square
            key={"square" + index}
            value={this.props.squares[index]}
            winner={this.props.line.indexOf(index) !== -1}
            onClick={() => this.props.onClick(index)}
        />;
    }

    render() {
        let cellNumber = 0;
        const rows = [];
        for (let index = 0; index < 3; index++) {
            const cells = [];
            for (let indexJ = 0; indexJ < 3; indexJ++) {
                cells.push(this.renderSquare(cellNumber));
                cellNumber++;
            }

            const row = <div key={"board-row" + index} className="board-row">{cells}</div>;
            rows.push(row);
        }

        return (
            <div>{rows}</div>
        );
    }
}
