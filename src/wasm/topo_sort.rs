use crate::dep::graph_dependency;
use crate::js_struct::*;
use rand::thread_rng;
use rand::Rng;

pub fn topo_sort(tetriminos: &Vec<JsTetrimino>) -> Vec<JsTetrimino> {
  let (mut depending_map, mut depended_by_map, nodes) = graph_dependency(tetriminos);

  let mut start_node_ids: Vec<i32> = Vec::new();
  for pair in depending_map.iter() {
    if pair.1.len() == 0 {
      start_node_ids.push(*pair.0);
    }
  }

  // Deal with ids
  let mut result_ids: Vec<i32> = Vec::with_capacity(nodes.len());
  let mut rng = thread_rng();
  while start_node_ids.len() != 0 {
    let n_id = start_node_ids.remove(rng.gen_range(0..start_node_ids.len()));
    result_ids.push(n_id);

    let depended_by = depended_by_map.get_mut(&n_id).unwrap();
    let depended_by_orig = depended_by.clone();

    for m_id in depended_by_orig.iter() {
      let depending = depending_map.get_mut(&m_id).unwrap();
      depended_by.remove(m_id);
      depending.remove(&n_id);
      if depending.len() == 0 {
        start_node_ids.push(*m_id);
      }
    }
  }

  // Remap JsTetriminos to ids
  let mut result_objects: Vec<JsTetrimino> = Vec::with_capacity(result_ids.len());
  for id in start_node_ids.iter() {
    for node in nodes.iter() {
      if node.id == *id {
        result_objects.push(node.underlying_tetrimino.clone());
      }
    }
  }

  result_objects
}
