use actix_web::{get, web, App, HttpServer, Responder};

#[get("/api/health")]
async fn health_check() -> impl Responder {
    "{\"status\": \"UP\"}"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Server starting on http://127.0.0.1:8080");

    HttpServer::new(|| {
        App::new().service(health_check)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
