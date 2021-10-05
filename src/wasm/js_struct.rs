use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(rename = "Position", rename_all = "camelCase")]
pub struct JsPosition {
  pub x: i32,
  pub y: i32,
}

impl JsPosition {
  pub fn equals(&self, another: &JsPosition) -> bool {
    self.x == another.x && self.y == another.y
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

pub const PLAY_AREA_HEIGHT: usize = 11;
pub const PLAY_AREA_WIDTH: usize = 18;
