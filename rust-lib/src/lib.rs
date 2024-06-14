use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;
use serde::{Serialize, Deserialize};
use js_sys::Promise;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RustData {
    pub array: Vec<i32>,
}

// Helper function to perform the async processing
async fn perform_processing(json_data: String) -> Result<String, JsValue> {
    log(&format!("Received: {}", json_data));

    // Deserialize JSON data to RustData
    let data: RustData = serde_json::from_str(&json_data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    // Simulate some async processing work
    // Replace this with actual async processing logic if needed
    wasm_bindgen_futures::JsFuture::from(js_sys::Promise::resolve(&JsValue::from_str("processing")))
        .await
        .map_err(|e| JsValue::from_str(&e.as_string().unwrap_or_default()))?;

    // Serialize the processed data back to JSON
    let processed_data = serde_json::to_string(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    log(&format!("Processed: {}", processed_data));
    
    Ok(processed_data)
}

// Entry function to be called from JavaScript, returning a Promise
#[wasm_bindgen]
pub fn process_data(json_data: &str) -> Promise {
    // Convert `json_data` to `String` to move ownership into the async context
    let json_data = json_data.to_string();

    future_to_promise(async move {
        perform_processing(json_data.clone()).await.map(|data| JsValue::from_str(&data))
    })
}
