use crate::js_struct::*;

#[derive(Copy, Clone)]
pub struct MemoizedBlock {
    pub underlying_block: JsBlock,

    pub owner_id: i32,
}

impl MemoizedBlock {
    pub fn new(underlying_block: JsBlock, owner_id: i32) -> MemoizedBlock {
        MemoizedBlock {
            underlying_block: underlying_block,
            owner_id: owner_id,
        }
    }
}
