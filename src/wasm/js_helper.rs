use crate::js_struct::*;

pub const CUBIC_DOWN_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 0, 0, 0], [3, 4, 0, 0], [2, 1, 0, 0]];

pub const CUBIC_LEFT_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 0], [1, 4, 0, 0]];

pub const CUBIC_RIGHT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 0, 0, 0], [4, 1, 0, 0], [3, 2, 0, 0]];

pub const CUBIC_UP_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 0, 0], [4, 3, 0, 0]];

pub const L_CIS_DOWN_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [4, 3, 0, 0], [0, 2, 0, 0], [0, 1, 0, 0]];

pub const L_CIS_LEFT_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 0, 4, 0], [1, 2, 3, 0], [0, 0, 0, 0]];

pub const L_CIS_RIGHT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 0, 0, 0], [3, 2, 1, 0], [4, 0, 0, 0]];

pub const L_CIS_UP_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 1, 0, 0], [0, 2, 0, 0], [0, 3, 4, 0]];

pub const LINEAR_DOWN_MASK: [[i32; 4]; 4] =
  [[0, 0, 4, 0], [0, 0, 3, 0], [0, 0, 2, 0], [0, 0, 1, 0]];

pub const LINEAR_LEFT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 4], [0, 0, 0, 0]];

pub const LINEAR_RIGHT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [4, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0]];

pub const LINEAR_UP_MASK: [[i32; 4]; 4] = [[0, 1, 0, 0], [0, 2, 0, 0], [0, 3, 0, 0], [0, 4, 0, 0]];

pub const L_TRANS_DOWN_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 3, 4, 0], [0, 2, 0, 0], [0, 1, 0, 0]];

pub const L_TRANS_LEFT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0], [0, 0, 4, 0]];

pub const L_TRANS_RIGHT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [4, 0, 0, 0], [3, 2, 1, 0], [0, 0, 0, 0]];

pub const L_TRANS_UP_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 1, 0, 0], [0, 2, 0, 0], [4, 3, 0, 0]];

pub const TEE_DOWN_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 0, 0, 0], [4, 3, 2, 0], [0, 1, 0, 0]];

pub const TEE_LEFT_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 4, 0, 0], [1, 3, 0, 0], [0, 2, 0, 0]];

pub const TEE_RIGHT_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 2, 0, 0], [0, 3, 1, 0], [0, 4, 0, 0]];

pub const TEE_UP_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 1, 0, 0], [2, 3, 4, 0], [0, 0, 0, 0]];

pub const Z_CIS_DOWN_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 0, 0, 0], [4, 3, 0, 0], [0, 2, 1, 0]];

pub const Z_CIS_LEFT_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 4, 0, 0], [2, 3, 0, 0], [1, 0, 0, 0]];

pub const Z_CIS_RIGHT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 0, 1, 0], [0, 3, 2, 0], [0, 4, 0, 0]];

pub const Z_CIS_UP_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [1, 2, 0, 0], [0, 3, 4, 0], [0, 0, 0, 0]];

pub const Z_TRANS_DOWN_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 1, 0], [4, 3, 0, 0]];

pub const Z_TRANS_LEFT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [4, 0, 0, 0], [3, 2, 0, 0], [0, 1, 0, 0]];

pub const Z_TRANS_RIGHT_MASK: [[i32; 4]; 4] =
  [[0, 0, 0, 0], [0, 1, 0, 0], [0, 2, 3, 0], [0, 0, 4, 0]];

pub const Z_TRANS_UP_MASK: [[i32; 4]; 4] = [[0, 0, 0, 0], [0, 3, 4, 0], [1, 2, 0, 0], [0, 0, 0, 0]];

fn create_blocks_mask(kind: i32, direction: i32) -> [[i32; 4]; 4] {
  match kind {
    0 => match direction {
      0 => LINEAR_LEFT_MASK,
      1 => LINEAR_UP_MASK,
      2 => LINEAR_RIGHT_MASK,
      3 => LINEAR_DOWN_MASK,
      _ => panic!("direction"),
    },
    1 => match direction {
      1 => CUBIC_UP_MASK,
      2 => CUBIC_RIGHT_MASK,
      3 => CUBIC_DOWN_MASK,
      0 => CUBIC_LEFT_MASK,
      _ => panic!("direction"),
    },
    2 => match direction {
      1 => L_CIS_UP_MASK,
      2 => L_CIS_RIGHT_MASK,
      3 => L_CIS_DOWN_MASK,
      0 => L_CIS_LEFT_MASK,
      _ => panic!("direction"),
    },
    3 => match direction {
      1 => L_TRANS_UP_MASK,
      2 => L_TRANS_RIGHT_MASK,
      3 => L_TRANS_DOWN_MASK,
      0 => L_TRANS_LEFT_MASK,
      _ => panic!("direction"),
    },
    4 => match direction {
      1 => Z_CIS_UP_MASK,
      2 => Z_CIS_RIGHT_MASK,
      3 => Z_CIS_DOWN_MASK,
      0 => Z_CIS_LEFT_MASK,
      _ => panic!("direction"),
    },
    5 => match direction {
      1 => Z_TRANS_UP_MASK,
      2 => Z_TRANS_RIGHT_MASK,
      3 => Z_TRANS_DOWN_MASK,
      0 => Z_TRANS_LEFT_MASK,
      _ => panic!("direction"),
    },
    6 => match direction {
      1 => TEE_UP_MASK,
      2 => TEE_RIGHT_MASK,
      3 => TEE_DOWN_MASK,
      0 => TEE_LEFT_MASK,
      _ => panic!("direction"),
    },
    _ => panic!("kind"),
  }
}

/**
 * Tuple 0: row
 * Tuple 1: col
 */
fn get_first_block_coord_by_type(kind: i32, facing_direction: i32) -> (i32, i32) {
  let mask = create_blocks_mask(kind, facing_direction);
  for i in (0..4).rev() {
    for j in (0..4).rev() {
      if mask[i][j] != 0 {
        return (i as i32, j as i32);
      }
    }
  }
  panic!();
}

pub fn get_position_by_first_block_position(
  first_block_position: &JsPosition,
  kind: i32,
  facing_direction: i32,
) -> JsPosition {
  let first_block_coord = get_first_block_coord_by_type(kind, facing_direction);
  return JsPosition::new(
    first_block_position.x - first_block_coord.1,
    first_block_position.y - first_block_coord.0,
  );
}

pub fn create_offseted_blocks(kind: i32, offset: &JsPosition, direction: i32) -> [JsBlock; 4] {
  let mask = create_blocks_mask(kind, direction);
  let mut offset_blocks: [Option<JsBlock>; 4] = Default::default();
  let mut index = 0;
  for n_row in 0..mask.len() {
    let row = mask.get(n_row).unwrap();
    for n_col in 0..row.len() {
      let identifier = row[n_col];
      if identifier != 0 && index <= 3 {
        offset_blocks[index] = Some(JsBlock {
          filled_by: kind,
          position: JsPosition::new(n_col as i32 + offset.x, n_row as i32 + offset.y),
          atomic_number: 0,
          id: identifier,
        });
        index += 1;
      }
    }
  }

  [
    offset_blocks[0].unwrap(),
    offset_blocks[1].unwrap(),
    offset_blocks[2].unwrap(),
    offset_blocks[3].unwrap(),
  ]
}
