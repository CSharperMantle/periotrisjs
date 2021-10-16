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
    workspace: &[[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
) -> JsPosition {
    for n_row in (0..PLAY_AREA_HEIGHT).rev() {
        for n_col in (0..PLAY_AREA_WIDTH).rev() {
            if workspace[n_row][n_col].filled_by == 7 {
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

fn collision_checker(
    workspace: &[[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT],
    block: &JsBlock,
) -> bool {
    let n_row = block.position.y as usize;
    let n_col = block.position.x as usize;
    if n_col >= PLAY_AREA_WIDTH || n_row >= PLAY_AREA_HEIGHT {
        return true;
    }
    workspace[n_row][n_col].filled_by != 7
}

pub fn tile(template: &[[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT]) -> Vec<JsTetrimino> {
    let mut workspace = *template;
    let mut settled_tetriminos: Vec<JsTetrimino> = Vec::new();
    let mut pending_kind_pairs: Vec<Vec<KindDirectionsPair>> = Vec::new();

    let mut rewinding_required = false;
    loop {
        let first_block_coord = get_first_available_coord(&workspace);
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
                workspace[block.position.y as usize][block.position.x as usize].filled_by = 7;
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
                    .any(|block| collision_checker(&workspace, block));

                if !will_collide {
                    for block in tetrimino.blocks.iter_mut() {
                        let workspace_cell =
                            &mut workspace[block.position.y as usize][block.position.x as usize];
                        block.atomic_number = workspace_cell.atomic_number;
                        workspace_cell.filled_by = block.filled_by;
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
