use crate::js_struct::*;
use crate::memoized_block::MemoizedBlock;
use crate::tetrimino_node::TetriminoNode;
use std::collections::HashMap;
use std::collections::HashSet;

fn get_block_owner(
  map: &[[Option<MemoizedBlock>; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
  row: usize,
  col: usize,
) -> Option<i32> {
  if row >= PLAY_AREA_HEIGHT || col >= PLAY_AREA_WIDTH {
    return None;
  }

  let cell = &map[row][col];
  if cell.is_none() {
    return None;
  }

  let cell_content = &cell.unwrap();
  if cell_content.underlying_block.filled_by == 7 || cell_content.underlying_block.filled_by == 8 {
    return None;
  }

  Some(cell_content.owner_id)
}

fn init_dependency_maps(
  depending_map: &mut HashMap<i32, HashSet<i32>>,
  depended_by_map: &mut HashMap<i32, HashSet<i32>>,
  len: usize,
) {
  for i in 0..len {
    depending_map.insert(i as i32, HashSet::new());
    depended_by_map.insert(i as i32, HashSet::new());
  }
}

fn insert_node_with_dependency(
  depending_map: &mut HashMap<i32, HashSet<i32>>,
  depended_by_map: &mut HashMap<i32, HashSet<i32>>,
  main_id: i32,
  depending_id: i32,
) {
  if !depending_map.contains_key(&main_id) {
    depending_map.insert(main_id, HashSet::new());
  }
  if !depended_by_map.contains_key(&depending_id) {
    depended_by_map.insert(depending_id, HashSet::new());
  }

  depending_map
    .get_mut(&main_id)
    .unwrap()
    .insert(depending_id);
  depended_by_map
    .get_mut(&depending_id)
    .unwrap()
    .insert(main_id);
}

pub fn graph_dependency(
  tetriminos: &Vec<JsTetrimino>,
) -> (
  HashMap<i32, HashSet<i32>>,
  HashMap<i32, HashSet<i32>>,
  Vec<TetriminoNode>,
) {
  let mut memoized_map: [[Option<MemoizedBlock>; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
    [[None; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT];
  let mut tetrimino_nodes: Vec<TetriminoNode> = Vec::with_capacity(tetriminos.len());

  // Fill in blocks
  let mut id: usize = 0;
  for tetrimino in tetriminos.iter() {
    let node = TetriminoNode::new(*tetrimino, id as i32);
    for memoized_block in node.memoized_blocks.iter() {
      memoized_map[memoized_block.underlying_block.position.y as usize]
        [memoized_block.underlying_block.position.x as usize] = Some(*memoized_block);
    }
    tetrimino_nodes.push(node);
    id += 1;
  }

  let mut depending_map: HashMap<i32, HashSet<i32>> = HashMap::with_capacity(id);
  let mut depended_by_map: HashMap<i32, HashSet<i32>> = HashMap::with_capacity(id);

  init_dependency_maps(&mut depending_map, &mut depended_by_map, id);

  for node in tetrimino_nodes.iter() {
    for block in node.memoized_blocks.iter() {
      let depended_block_row = (block.underlying_block.position.y as usize) + 1;
      let depended_block_col = block.underlying_block.position.x as usize;
      let res = get_block_owner(&memoized_map, depended_block_row, depended_block_col);
      if res.is_some() {
        let depended_id = res.unwrap();
        if depended_id != node.id {
          insert_node_with_dependency(
            &mut depending_map,
            &mut depended_by_map,
            node.id,
            depended_id,
          )
        }
      }
    }
  }

  (depending_map, depended_by_map, tetrimino_nodes)
}
