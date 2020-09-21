import React from "react";

export type SquareProps = { value: string | null, onClick(): void, winner: boolean, };

export function Square(props: SquareProps) {
    return (
        <button className="square"
                onClick={props.onClick}
                style={{ background: props.winner ? "lightgreen" : "transparent" }}
        >
            {props.value}
        </button>
    );
}
