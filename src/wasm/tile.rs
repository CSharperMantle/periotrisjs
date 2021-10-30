use crate::js_struct::*;
use rand::seq::SliceRandom;
use rand::thread_rng;

#[derive(Clone)]
struct KindDirectionsPair {
    pub kind: i32,
    pub directions: Vec<i32>,
}

impl KindDirectionsPair {
    pub fn new(kind: i32) -> KindDirectionsPair {
        let mut rng = thread_rng();
        let mut obj = KindDirectionsPair {
            kind: kind,
            directions: vec![0, 1, 2, 3],
        };
        obj.directions.shuffle(&mut rng);
        obj
    }

    pub fn pop_rand_direction(&mut self) -> i32 {
        self.directions.pop().unwrap()
    }
}

fn get_first_available_coord(
    availability_map: &[[bool; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
) -> JsPosition {
    for n_row in (0..PLAY_AREA_HEIGHT).rev() {
        for n_col in (0..PLAY_AREA_WIDTH).rev() {
            if availability_map[n_row][n_col] {
                return JsPosition::new(n_col as i32, n_row as i32);
            }
        }
    }
    JsPosition::new(-1, -1)
}

fn create_pairs() -> Vec<KindDirectionsPair> {
    let mut rng = thread_rng();
    let mut pairs = vec![
        KindDirectionsPair::new(0),
        KindDirectionsPair::new(1),
        KindDirectionsPair::new(2),
        KindDirectionsPair::new(3),
        KindDirectionsPair::new(4),
        KindDirectionsPair::new(5),
        KindDirectionsPair::new(6),
    ];
    pairs.shuffle(&mut rng);
    pairs
}

fn check_collision(
    availability_map: &[[bool; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
    block: &JsBlock,
) -> bool {
    let n_row = block.position.y as usize;
    let n_col = block.position.x as usize;
    if n_col >= PLAY_AREA_WIDTH || n_row >= PLAY_AREA_HEIGHT {
        return true;
    }
    availability_map[n_row][n_col] == false
}

#[cfg(use_recursive_tile)]
pub fn recursive_tile(
    template: &[[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
) -> Vec<JsTetrimino> {
    let mut blocks_availability_map: [[bool; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        Default::default();
    let mut blocks_atomic_number_map: [[i32; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        Default::default();
    let mut settled_tetriminos: Vec<JsTetrimino> = Vec::new();

    // Create mappings
    for n_row in 0..PLAY_AREA_HEIGHT {
        for n_col in 0..PLAY_AREA_WIDTH {
            let elem = &template[n_row][n_col];
            if elem.filled_by == 7 {
                blocks_availability_map[n_row][n_col] = true;
            }
            blocks_atomic_number_map[n_row][n_col] = elem.atomic_number;
        }
    }

    fn do_recursive_tile(
        availability_map: &mut [[bool; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
        atomic_number_map: &[[i32; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
        settled_tetriminos: &mut Vec<JsTetrimino>,
    ) -> bool {
        let first_block_coord = get_first_available_coord(&availability_map);
        if first_block_coord.x < 0 || first_block_coord.y < 0 {
            return true;
        }

        let mut current_pairs = create_pairs();

        for pair in current_pairs.iter_mut() {
            // For each pair of direction...
            while pair.directions.len() > 0 {
                // Try if it is possible
                let direction = pair.pop_rand_direction();
                let mut tetrimino = JsTetrimino::new(pair.kind, first_block_coord, direction);
                let will_collide = tetrimino
                    .blocks
                    .iter()
                    .any(|block| check_collision(&availability_map, block));

                if !will_collide {
                    // Possible
                    for block in tetrimino.blocks.iter_mut() {
                        // Mark block as occupied
                        block.atomic_number =
                            atomic_number_map[block.position.y as usize][block.position.x as usize];
                        availability_map[block.position.y as usize][block.position.x as usize] =
                            false;
                    }
                    // Check subtree to see possibility
                    if do_recursive_tile(availability_map, atomic_number_map, settled_tetriminos) {
                        // Subtree possible, pushing and returning sign of success
                        settled_tetriminos.push(tetrimino);
                        return true;
                    } else {
                        // Subtree not possible. Reverting changes and proceed.
                        for block in tetrimino.blocks.iter_mut() {
                            // Mark block as unoccupied
                            availability_map[block.position.y as usize]
                                [block.position.x as usize] = true;
                        }
                    }
                }
                // Will collide or subtree not possible.
                // Do nothing and continue to next pair.
            }
        }

        // Pairs exhausted. No solution found. Returning.
        false
    }

    do_recursive_tile(
        &mut blocks_availability_map,
        &blocks_atomic_number_map,
        &mut settled_tetriminos,
    );
    return settled_tetriminos;
}

pub fn tile(template: &[[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT]) -> Vec<JsTetrimino> {
    let mut blocks_availability_map: [[bool; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        Default::default();
    let mut blocks_atomic_number_map: [[i32; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        Default::default();

    let mut settled_tetriminos: Vec<JsTetrimino> = Vec::new();
    let mut pending_kind_pairs: Vec<Vec<KindDirectionsPair>> = Vec::new();

    // Create mappings
    for n_row in 0..PLAY_AREA_HEIGHT {
        for n_col in 0..PLAY_AREA_WIDTH {
            let elem = &template[n_row][n_col];
            if elem.filled_by == 7 {
                blocks_availability_map[n_row][n_col] = true;
            }
            blocks_atomic_number_map[n_row][n_col] = elem.atomic_number;
        }
    }

    let mut rewinding_required = false;
    loop {
        let first_block_coord = get_first_available_coord(&blocks_availability_map);
        if first_block_coord.x < 0 || first_block_coord.y < 0 {
            return settled_tetriminos;
        }

        let mut current_pairs: Vec<KindDirectionsPair>;
        if !rewinding_required {
            current_pairs = create_pairs();
        } else {
            if settled_tetriminos.len() == 0 {
                return settled_tetriminos;
            }

            current_pairs = pending_kind_pairs.pop().unwrap();
            let last_tetrimino = settled_tetriminos.pop().unwrap();
            for block in last_tetrimino.blocks.iter() {
                blocks_availability_map[block.position.y as usize][block.position.x as usize] =
                    true;
            }
        }

        let mut solution_found = false;
        while !solution_found && current_pairs.len() > 0 {
            let mut current_pair = current_pairs.pop().unwrap();

            while !solution_found && current_pair.directions.len() > 0 {
                let direction = current_pair.pop_rand_direction();

                let mut tetrimino =
                    JsTetrimino::new(current_pair.kind, first_block_coord, direction);

                let will_collide = tetrimino
                    .blocks
                    .iter()
                    .any(|block| check_collision(&blocks_availability_map, block));

                if !will_collide {
                    for block in tetrimino.blocks.iter_mut() {
                        block.atomic_number = blocks_atomic_number_map[block.position.y as usize]
                            [block.position.x as usize];
                        blocks_availability_map[block.position.y as usize]
                            [block.position.x as usize] = false;
                    }
                    settled_tetriminos.push(tetrimino);
                    pending_kind_pairs.push(current_pairs.clone());
                    solution_found = true;
                    rewinding_required = false;
                }
            }
        }

        if !solution_found {
            rewinding_required = true;
        }
    }
}
