import Piece from './piece';
import { isSameRow } from '../helpers';

export default class Knight extends Piece {
    constructor(player) {
        super(player, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"));
        this.type='knight';
    }

    isMovePossible(src, dest) {
        return (
            (src - 17 === dest && !isSameRow(src, dest)) ||
            (src - 10 === dest && !isSameRow(src, dest)) ||
            (src + 6 === dest && !isSameRow(src, dest)) ||
            (src + 15 === dest && !isSameRow(src, dest)) ||
            (src - 15 === dest && !isSameRow(src, dest)) ||
            (src - 6 === dest && !isSameRow(src, dest)) ||
            (src + 10 === dest && !isSameRow(src, dest)) ||
            (src + 17 === dest && !isSameRow(src, dest))
        );
    }

    // always returns empty because only jump movement is allowed hence no straight path
    getSrcToDestPath (src, dest) {
        return []
    }
}