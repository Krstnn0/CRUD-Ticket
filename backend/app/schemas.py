from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, ConfigDict
from .models import PriorityEnum, StatusEnum


class TicketBase(BaseModel):
    title: str
    description: str
    priority: PriorityEnum = PriorityEnum.medium

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("title tidak boleh kosong")
        return v.strip()

    @field_validator("description")
    @classmethod
    def description_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("description tidak boleh kosong")
        return v.strip()


class TicketCreate(TicketBase):
    """Payload for creating a new ticket. Status is always forced to 'open' server-side."""
    pass


class TicketUpdate(BaseModel):
    """Payload for updating a ticket. All fields optional (partial update)."""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("title tidak boleh kosong")
        return v.strip() if v is not None else v

    @field_validator("description")
    @classmethod
    def description_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("description tidak boleh kosong")
        return v.strip() if v is not None else v


class TicketOut(TicketBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: StatusEnum
    created_at: datetime
    updated_at: datetime
