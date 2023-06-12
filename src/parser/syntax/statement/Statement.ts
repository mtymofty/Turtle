import { Position } from "../../../source/Position";
import { Visitable } from "../../../visitor/Visitable";

export interface Statement extends Visitable {
    position: Position;
}
