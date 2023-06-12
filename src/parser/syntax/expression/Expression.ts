import { Position } from "../../../source/Position";
import { Visitable } from "../../../visitor/Visitable";

export interface Expression extends Visitable {
    position: Position;
}
