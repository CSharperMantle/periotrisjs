use crate::js_helper::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(rename = "Position", rename_all = "camelCase")]
pub struct JsPosition {
    pub x: i32,
    pub y: i32,
}

impl JsPosition {
    pub fn new(x: i32, y: i32) -> JsPosition {
        JsPosition { x: x, y: y }
    }
}

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(rename = "Block", rename_all = "camelCase")]
pub struct JsBlock {
    pub filled_by: i32,
    pub position: JsPosition,
    pub atomic_number: i32,
    pub id: i32,
}

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(rename = "Tetrimino", rename_all = "camelCase")]
pub struct JsTetrimino {
    pub facing_direction: i32,
    pub first_block_position: JsPosition,
    pub position: JsPosition,
    pub kind: i32,
    pub blocks: [JsBlock; 4],
}

impl JsTetrimino {
    pub fn new(kind: i32, first_block_position: JsPosition, facing_direction: i32) -> JsTetrimino {
        let mask = create_blocks_mask(kind, facing_direction);
        let position = get_position_by_first_block_position(&first_block_position, &mask);

        JsTetrimino {
            position: position,
            kind: kind,
            first_block_position: first_block_position,
            facing_direction: facing_direction,
            blocks: create_offseted_blocks(kind, &position, &mask),
        }
    }
}

pub const PLAY_AREA_HEIGHT: usize = 11;
pub const PLAY_AREA_WIDTH: usize = 18;
