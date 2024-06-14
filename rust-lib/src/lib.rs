use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;
use serde_json::Value;
use js_sys::Promise;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub enum SortDirection {
    Ascending,
    Descending,
}

// Helper function to perform the async processing
async fn perform_processing(json_data: String, key: String, direction: SortDirection) -> Result<String, JsValue> {
    log(&format!("Received: {}", json_data));

    // Deserialize JSON data to a dynamic Value
    let mut data: Vec<Value> = serde_json::from_str(&json_data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    // Sort the data
    data.sort_by(|a, b| {
        let a_val = a.get(&key).and_then(Value::as_str).unwrap_or_default();
        let b_val = b.get(&key).and_then(Value::as_str).unwrap_or_default();
        match direction {
            SortDirection::Ascending => a_val.cmp(&b_val),
            SortDirection::Descending => b_val.cmp(&a_val),
        }
    });

    // Serialize the processed data back to JSON
    let processed_data = serde_json::to_string(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    log(&format!("Processed: {}", processed_data));
    
    Ok(processed_data)
}


// Entry function to be called from JavaScript, returning a Promise
#[wasm_bindgen]
pub fn process_data(json_data: &str, key: &str, direction: SortDirection) -> Promise {
    // Convert arguments to String to move ownership into the async context
    let json_data = json_data.to_string();
    let key = key.to_string();

    future_to_promise(async move {
        perform_processing(json_data, key, direction).await.map(|data| JsValue::from_str(&data))
    })
}
