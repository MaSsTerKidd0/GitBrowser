use reqwest;
use serde_json::Value;
use std::error::Error;

#[tokio::main]
async fn main() {
    fetch_repo_names()
        .await
        .expect("Failed to fetch GitLab repos");
}

async fn fetch_repo_names() -> Result<(), Box<dyn Error>> {
    let body = reqwest::get("https://gitlab.com/api/v4/users/MaSsTer_Kidd0/projects")
        .await?
        .text()
        .await?;

    // Parse the response body as JSON
    let v: Value = serde_json::from_str(&body)?;

    // Pretty print the JSON
    let pretty = serde_json::to_string_pretty(&v)?;
    let v: Value = serde_json::from_str(&*body)?;

    for i in v.as_array().unwrap() {
        println!("repo Name: {:?}", i["path"].as_str().unwrap());
    }

    Ok(())
}
