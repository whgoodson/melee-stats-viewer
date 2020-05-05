/*
    Created by Warren Goodson
*/
import React from 'react';

import styles from './ComboTracker.module.css';
import ComboTrackerPath from "../ComboTrackerPath/ComboTrackerPath";
import * as d3 from "d3";

import attackTable from '../../../DataHandling/AttackTable';


const comboTracker = (props) => {
    const minComboLength = 3;
    const currentCombo = 4;

    const stageDimensions = {
        0: {
            xMin: -175.7,
            xMax: 173.6,
            yMin: -91,
            yMax: 168
        },
        1: {
            xMin: -198.75,
            xMax: 198.75,
            yMin: -146.25,
            yMax: 202.5
        },
        2: {
            xMin: -230,
            xMax: 230,
            yMin: -111,
            yMax: 180
        },
        3: {
            xMin: -224,
            xMax: 224,
            yMin: -108.8,
            yMax: 200
        },
        4: {
            xMin: -246,
            xMax: 246,
            yMin: -140,
            yMax: 188
        },
        5: {
            xMin: -255,
            xMax: 255,
            yMin: -123,
            yMax: 250
        }
    }

    const svgDimensions = {
        0: {
            xDim: 857.04,
            yDim: 636
        },
        1: {
            xDim: 731.35,
            yDim: 642
        },
        2: {
            xDim: 1013.67,
            yDim: 642
        },
        3: {
            xDim: 930.48,
            yDim: 642
        },
        4: {
            xDim: 966.94,
            yDim: 642
        },
        5: {
            xDim: 877.06,
            yDim: 642
        }
    }

    const xScale = d3.scaleLinear()
        .domain([[stageDimensions[props.stageId].xMin], [stageDimensions[props.stageId].xMax]])
        .range([0, svgDimensions[props.stageId].xDim]) // instead of props.width, use width of background image
    const yScale = d3.scaleLinear()
        .domain([[stageDimensions[props.stageId].yMin], [stageDimensions[props.stageId].yMax]])
        .range([[svgDimensions[props.stageId].yDim], 0]); // height is the same, based on styling

    const p1Line = d3.line()
        .x(d => xScale(d.player1X))
        .y(d => yScale(d.player1Y));

    const p2Line = d3.line()
        .x(d => xScale(d.player2X))
        .y(d => yScale(d.player2Y));

    const p1ComboColorScale = d3.scaleLinear()
        .domain([0, 10])
        .range(["purple", "steelblue"])

    const p2ComboColorScale = d3.scaleLinear()
        .domain([0, 10])
        .range(["green", "red"])

    const makeComboPaths = () => {
        const p1Index = props.combos[0].playerIndex;

        let p1ComboPathsOffense = [];
        let p2ComboPathsOffense = [];

        let p1ComboPathsDefense = [];
        let p2ComboPathsDefense = [];

        let comboPathsOffense = [];
        let comboPathsDefense = [];



        const positionData = props.frameData.map(frame => {
            return {
                "player1X": frame.player1.PreX,
                "player1Y": frame.player1.PreY,
                "player2X": frame.player2.PreX,
                "player2Y": frame.player2.PreY,
            }
        })

        props.combos.forEach( (combo, idx) => {
            const comboSlice = positionData.slice(combo.startFrame, combo.endFrame);

            let comboSliceOffense = [];


            // Need:
            // x and y positions of hits (based on frame) - use xScale and yScale
            // moveId, translated to string
            // playerID
            // everything else can stay in moves array

            if(combo.moves.length >= minComboLength) {
                const comboHits = combo.moves.map((move) => {
                    // const character = props.frames.
                    return {
                        "frame": move.frame,
                        "move": attackTable[move.moveId],
                        "x": xScale(positionData[move.frame].player1X),
                        "y": yScale(positionData[move.frame].player1Y),
                        "hitCount": move.hitCount,
                        "damage": move.damage.toPrecision(2),
                        "character": props.frameData[0]["player1"].Character
                    };
                });

                const hitsTaken = combo.moves.map( (move) => {
                    return {
                        "frame": move.frame,
                        "move": attackTable[move.moveId],
                        "x": xScale(positionData[move.frame].player2X),
                        "y": yScale(positionData[move.frame].player2Y),
                        "hitCount": move.hitCount,
                        "damage": move.damage.toPrecision(2),
                        "character": props.frameData[0]["player2"].Character
                    };
                });

                comboPathsOffense.push(<ComboTrackerPath key={idx}
                                                         d={p1Line(comboSlice)}
                                                         color={p1ComboColorScale(idx)}
                                                         comboLength={combo.moves.length}
                                                         playerIdx={combo.playerIndex}
                                                         comboHits={comboHits}
                                                         didKill={combo.didKill}
                />);

                comboPathsDefense.push(<ComboTrackerPath key={idx + 1000}
                                                         d={p2Line(comboSlice)}
                                                         color={p2ComboColorScale(idx)}
                                                         comboLength={combo.moves.length}
                                                         playerIdx={combo.playerIndex}
                                                         hitsTaken={hitsTaken}
                                                         didKill={combo.didKill}


                />);

            }

        });

        // return {p1ComboPathsOffense, p2ComboPathsDefense, p2ComboPathsOffense, p1ComboPathsDefense};
        return {comboPathsOffense, comboPathsDefense};
    }


    // const {p1ComboPathsOffense, p2ComboPathsDefense, p2ComboPathsOffense, p1ComboPathsDefense} = makeComboPaths();
    //
    // console.log(p1ComboPathsOffense.length, p2ComboPathsDefense.length);


    const {comboPathsOffense, comboPathsDefense} = makeComboPaths();

    // TODO: Conditionally return content based on props (button controls)

    let toDisplay = [];
    if(props.currentCombo < 0){
        // Means we want to show all combos
        toDisplay = [comboPathsOffense, comboPathsDefense];
    } else {
        toDisplay = [comboPathsOffense[props.currentCombo], comboPathsDefense[props.currentCombo]];
    }

    return (
        <g>
            {toDisplay}

        </g>
    );
}

export default comboTracker;