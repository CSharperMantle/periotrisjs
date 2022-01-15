use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

mod dep;
mod js_helper;
mod js_struct;
mod memoized_block;
mod tetrimino_node;
mod tile;
mod topo_sort;
use crate::js_struct::*;
use crate::tile::tile;
use crate::topo_sort::topo_sort;

use std::panic;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn extern_init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn extern_topo_sort(tetriminos: &JsValue) -> JsValue {
    let tetriminos_vec: Vec<JsTetrimino> = tetriminos.into_serde().unwrap();
    let result = topo_sort(&tetriminos_vec);

    JsValue::from_serde(&result).unwrap()
}

#[wasm_bindgen]
pub fn extern_tile(template: &JsValue) -> JsValue {
    let template_arr: [[JsBlock; PLAY_AREA_WIDTH]; PLAY_AREA_HEIGHT] =
        template.into_serde().unwrap();

    let result = tile(&template_arr);

    JsValue::from_serde(&result).unwrap()
}
