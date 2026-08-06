import enum
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, func
from .database import Base


class PriorityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class StatusEnum(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(Enum(PriorityEnum, name="priority_enum"), nullable=False, default=PriorityEnum.medium)
    status = Column(Enum(StatusEnum, name="status_enum"), nullable=False, default=StatusEnum.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
