const FRAC_UNIT = 64;

const blockedBy = (sourceId, things, { x, y }, checkBlockFlag = false) => {
    return !!things.find(thing => {
        if (!checkBlockFlag || (checkBlockFlag && thing.block)) {
            if (thing.id !== sourceId) {
                const { x: thingX, y: thingY, radius = FRAC_UNIT / 2 } = thing;
                const convertedRadius = (radius * 2) / FRAC_UNIT;
                if (thingX >= x - convertedRadius && thingX <= x + convertedRadius) {
                    if (thingY >= y - convertedRadius && thingY <= y + convertedRadius) {
                        return true;
                    }
                }
            }    
        }

        return false; 
    });
};

export default (state, id, x, y) => {
    const {
        map: {
            mapHeight,
            mapWidth,
        },
        wallMap,
        decorations,
        enemies,
        player,
    } = state;


    // first make sure that we cannot move outside the boundaries of the level
	if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) {
        return true;
    }

	const ix = x;
    const iy = y;
    
    const targetCoordinates = { x: ix, y: iy };

    // return true if the map block is not 0, ie. if there is a blocking wall.
	if (wallMap[Math.floor(iy)][Math.floor(ix)] !== 0) {
        return true;
    }

    if (!blockedBy(id, decorations, targetCoordinates, true)) {
        if (!blockedBy(id, enemies, targetCoordinates)) {
            if (!blockedBy(id, [player], targetCoordinates)) {
                return false; 
            }
        }
    }

    return true;
};
