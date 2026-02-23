from fastapi import FastAPI

app = FastAPI(title="OMBPresent API")

@app.get("/")
def root():
    return {"message": "OMBPresent API is running"}