import Piece from './piece';
import { isSameDiagonal, isSameRow } from '../helpers';

export default class King extends Piece {
    constructor(player) {
        super(player, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"));
        this.type='king';
    }

    isMovePossible(src, dest) {
        return (
            (src - 9 === dest && isSameDiagonal(src, dest)) ||
            (src - 8 === dest) ||
            (src - 7 === dest && isSameDiagonal(src, dest)) ||
            (src + 1 === dest && isSameRow(src, dest)) ||
            (src + 9 === dest && isSameDiagonal(src, dest)) ||
            (src + 8 === dest) ||
            (src + 7 === dest && isSameDiagonal(src, dest)) ||
            (src - 1 === dest && isSameRow(src, dest))
        )
    }

    // always returns empty because only one step movement is allowed hence no path
    getSrcToDestPath (src, dest) {
        return []
    }
}