use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RustData {
    pub array: Vec<i32>,
}

#[wasm_bindgen]
pub fn process_data(json_data: &str) -> Result<JsValue, JsValue> {
    log(&format!("Received: {}", json_data));

    let data: RustData = serde_json::from_str(json_data).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let processed_data = serde_json::to_string(&data).map_err(|e| JsValue::from_str(&e.to_string()))?;

    log(&format!("Processed: {}", processed_data));

    Ok(JsValue::from_str(&processed_data))
}
