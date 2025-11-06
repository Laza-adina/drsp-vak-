# app/schemas/district.py
from typing import Optional
from pydantic import BaseModel


class DistrictBase(BaseModel):
    nom: str
    code: Optional[str] = None
    population: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None


class DistrictCreate(DistrictBase):
    pass


class DistrictUpdate(BaseModel):
    nom: Optional[str] = None
    code: Optional[str] = None
    population: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None


class DistrictResponse(DistrictBase):
    id: int
    
    class Config:
        from_attributes = True