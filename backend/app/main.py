from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from . import models, schemas
from .database import engine, get_db, Base

# Create tables on startup (simple approach for a mini app; use Alembic for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Support Ticket Mini Application")

# Allow the React frontend (any origin during dev) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """Return a simple, readable error message instead of FastAPI's default verbose payload."""
    errors = [err.get("msg", "Data tidak valid") for err in exc.errors()]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )


@app.get("/")
def root():
    return {"message": "Support Ticket API is running"}


@app.get("/tickets", response_model=list[schemas.TicketOut])
def list_tickets(db: Session = Depends(get_db)):
    """Menampilkan seluruh tiket, diurutkan dari yang terbaru."""
    tickets = db.query(models.Ticket).order_by(models.Ticket.created_at.desc()).all()
    return tickets


@app.get("/tickets/{ticket_id}", response_model=schemas.TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Menampilkan detail satu tiket. 404 jika tidak ditemukan."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if ticket is None:
        raise HTTPException(status_code=404, detail=f"Ticket dengan id {ticket_id} tidak ditemukan")
    return ticket


@app.post("/tickets", response_model=schemas.TicketOut, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: schemas.TicketCreate, db: Session = Depends(get_db)):
    """Membuat tiket baru. Status otomatis 'open'."""
    ticket = models.Ticket(
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        status=models.StatusEnum.open,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@app.patch("/tickets/{ticket_id}", response_model=schemas.TicketOut)
def update_ticket(ticket_id: int, payload: schemas.TicketUpdate, db: Session = Depends(get_db)):
    """Memperbarui tiket (termasuk status). 404 jika tidak ditemukan."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if ticket is None:
        raise HTTPException(status_code=404, detail=f"Ticket dengan id {ticket_id} tidak ditemukan")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)

    db.commit()
    db.refresh(ticket)
    return ticket


# PUT alias, since the spec allows PATCH atau PUT for updates
@app.put("/tickets/{ticket_id}", response_model=schemas.TicketOut)
def replace_ticket(ticket_id: int, payload: schemas.TicketUpdate, db: Session = Depends(get_db)):
    return update_ticket(ticket_id, payload, db)


@app.delete("/tickets/{ticket_id}", status_code=status.HTTP_200_OK)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Menghapus tiket. 404 jika tidak ditemukan."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if ticket is None:
        raise HTTPException(status_code=404, detail=f"Ticket dengan id {ticket_id} tidak ditemukan")

    db.delete(ticket)
    db.commit()
    return {"message": f"Ticket dengan id {ticket_id} berhasil dihapus"}
