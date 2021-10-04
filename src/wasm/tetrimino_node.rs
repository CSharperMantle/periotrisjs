use crate::js_struct::*;
use crate::memoized_block::MemoizedBlock;

pub struct TetriminoNode {
  pub underlying_tetrimino: JsTetrimino,

  pub id: i32,
  pub memoized_blocks: Vec<MemoizedBlock>,
}

impl TetriminoNode {
  pub fn new(underlying_tetrimino: JsTetrimino, id: i32) -> TetriminoNode {
    let memoized_blocks = memoize_blocks(&underlying_tetrimino, id);

    TetriminoNode {
      underlying_tetrimino: underlying_tetrimino,
      id: id,
      memoized_blocks: memoized_blocks,
    }
  }
}

pub fn memoize_blocks(tetrimino: &JsTetrimino, owner_id: i32) -> Vec<MemoizedBlock> {
  let mut memoized_blocks = Vec::with_capacity(tetrimino.blocks.len());

  for block in tetrimino.blocks.iter() {
    memoized_blocks.push(MemoizedBlock::new(*block, owner_id));
  }

  memoized_blocks
}
