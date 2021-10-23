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
    let memoized_blocks = tetrimino
        .blocks
        .iter()
        .map(|&b| return MemoizedBlock::new(b, owner_id))
        .collect();

    memoized_blocks
}
