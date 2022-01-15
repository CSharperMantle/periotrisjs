use crate::js_struct::*;
use rand::seq::SliceRandom;
use rand::thread_rng;

struct TetriminoPossibility {
    pub kind: i32,
    pub direction: i32,
}

fn create_possibilities() -> Vec<TetriminoPossibility> {
    let kinds = [0, 1, 2, 3, 4, 5, 6];
    let directions = [0, 1, 2, 3];
    let mut rng = thread_rng();
    let mut possibilities: Vec<TetriminoPossibility> = Vec::new();
    for kind in kinds {
        let mut dirs_per_kind: Vec<TetriminoPossibility> = directions
            .iter()
            .map(|direction| TetriminoPossibility {
                kind: kind,
                direction: *direction,
            })
            .collect();
        dirs_per_kind.shuffle(&mut rng);
        possibilities.append(&mut dirs_per_kind);
    }
    possibilities
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

pub fn tile(template: &[[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT]) -> Vec<JsTetrimino> {
    let mut blocks_availability_map: [[bool; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        Default::default();
    let mut blocks_atomic_number_map: [[i32; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        Default::default();

    let mut settled_tetriminos: Vec<JsTetrimino> = Vec::new();
    let mut pending_possibility_stacks: Vec<Vec<TetriminoPossibility>> = Vec::new();

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
        let mut current_possibilities: Vec<TetriminoPossibility>;
        if !rewinding_required {
            current_possibilities = create_possibilities();
        } else {
            if settled_tetriminos.len() == 0 {
                return settled_tetriminos;
            }
            current_possibilities = pending_possibility_stacks.pop().unwrap();
            let last_tetrimino = settled_tetriminos.pop().unwrap();
            for block in last_tetrimino.blocks.iter() {
                blocks_availability_map[block.position.y as usize][block.position.x as usize] =
                    true;
            }
        }

        let mut solution_found = false;
        while current_possibilities.len() > 0 {
            let current_possibility = current_possibilities.pop().unwrap();

            let mut tetrimino = JsTetrimino::new(
                current_possibility.kind,
                first_block_coord,
                current_possibility.direction,
            );

            let will_collide = tetrimino
                .blocks
                .iter()
                .any(|block| check_collision(&blocks_availability_map, block));

            if !will_collide {
                for block in tetrimino.blocks.iter_mut() {
                    block.atomic_number = blocks_atomic_number_map[block.position.y as usize]
                        [block.position.x as usize];
                    blocks_availability_map[block.position.y as usize][block.position.x as usize] =
                        false;
                }
                settled_tetriminos.push(tetrimino);
                pending_possibility_stacks.push(current_possibilities);
                solution_found = true;
                break;
            }
        }
        rewinding_required = !solution_found;
    }
}
