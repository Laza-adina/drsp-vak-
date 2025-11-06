# app/crud/district.py
from app.crud.base import CRUDBase
from app.models.district import District
from app.schemas.district import DistrictCreate, DistrictUpdate

class CRUDDistrict(CRUDBase[District, DistrictCreate, DistrictUpdate]):
    pass

district = CRUDDistrict(District)