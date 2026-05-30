from enum import Enum


class DocumentType(str, Enum):
    IC             = "IC"
    PROPERTY_TITLE = "PROPERTY_TITLE"
    POLICY         = "POLICY"
    UTILITY_BILL   = "UTILITY_BILL"


class CountryCode(str, Enum):
    PH = "PH"
    ID = "ID"
    KH = "KH"
