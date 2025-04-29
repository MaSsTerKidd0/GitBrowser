use std::error::Error;
use reqwest;

const GITLAB_URL: &str = "https://gitlab.com/";

#[tokio::main]
async fn main() {
    fetch_repo().await.expect("TODO: panic message");
}


async fn fetch_repo() -> Result<(), Box<dyn Error>> {
    let body = reqwest::get("https://gitlab.com/api/v4/users/MaSsTer_Kidd0/projects")
        .await?
        .text().await?;
    println!("body = {body:?}");
    Ok(())
}
