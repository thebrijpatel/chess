export default class Piece {
    constructor(player, iconUrl, type) {
        this.player = player;
        this.style = {
            backgroundImage: "url('" + iconUrl + "')"
        };
        this.type = type;
    }

    getPlayer() {
        return this.player
    }
}