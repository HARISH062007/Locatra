from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from backend.app.core.config import settings
import logging

logger = logging.getLogger("locatra-security")
security_scheme = HTTPBearer()

class CurrentUser:
    def __init__(self, user_id: str, email: str, role: str):
        self.id = user_id
        self.email = email
        self.role = role

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> CurrentUser:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        # Auth.js JWT structure: sub (userId), email, role
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role", "HOMEOWNER")
        
        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials (missing subject or email)",
            )
        return CurrentUser(user_id=user_id, email=email, role=role)
    except JWTError as e:
        logger.error(f"JWT Decoding failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
