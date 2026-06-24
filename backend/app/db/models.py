from sqlalchemy import (
    Column, String, Integer, ForeignKey, DateTime, Numeric, JSON, Boolean, Table, Enum
)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import enum

Base = declarative_base()

# Role Enum
class Role(str, enum.Enum):
    HOMEOWNER = "HOMEOWNER"
    DESIGNER = "DESIGNER"
    ADMIN = "ADMIN"

# UnitPreference Enum
class UnitPreference(str, enum.Enum):
    METRIC = "METRIC"
    IMPERIAL = "IMPERIAL"

# TargetType Enum
class TargetType(str, enum.Enum):
    ROOM = "ROOM"
    OBJECT = "OBJECT"

# ScanStatus Enum
class ScanStatus(str, enum.Enum):
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

# JobType Enum
class JobType(str, enum.Enum):
    OBJECT_RECONSTRUCTION = "OBJECT_RECONSTRUCTION"
    ROOM_MAPPING = "ROOM_MAPPING"
    RECOMMENDATION = "RECOMMENDATION"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    emailVerified = Column(DateTime(timezone=True), nullable=True)
    image = Column(String, nullable=True)
    passwordHash = Column(String, nullable=True)
    role = Column(Enum(Role, name="Role", native_enum=True, create_type=False), default=Role.HOMEOWNER, nullable=False)
    unitPreference = Column(Enum(UnitPreference, name="UnitPreference", native_enum=True, create_type=False), default=UnitPreference.METRIC, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    authenticators = relationship("Authenticator", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    objects = relationship("Object", back_populates="user", cascade="all, delete-orphan")
    scans = relationship("Scan", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("Preference", back_populates="user", cascade="all, delete-orphan")


class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    providerAccountId = Column(String, nullable=False)
    refresh_token = Column(String, nullable=True)
    access_token = Column(String, nullable=True)
    expires_at = Column(Integer, nullable=True)
    token_type = Column(String, nullable=True)
    scope = Column(String, nullable=True)
    id_token = Column(String, nullable=True)
    session_state = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="accounts")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True)
    sessionToken = Column(String, unique=True, nullable=False)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires = Column(DateTime(timezone=True), nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="sessions")


class VerificationToken(Base):
    __tablename__ = "verification_tokens"

    identifier = Column(String, primary_key=True)
    token = Column(String, unique=True, primary_key=True)
    expires = Column(DateTime(timezone=True), nullable=False)


class Authenticator(Base):
    __tablename__ = "authenticators"

    credentialID = Column(String, primary_key=True, unique=True)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    providerAccountId = Column(String, nullable=False)
    credentialPublicKey = Column(String, nullable=False)
    counter = Column(Integer, nullable=False)
    credentialDeviceType = Column(String, nullable=False)
    credentialBackedUp = Column(Boolean, nullable=False)
    transports = Column(String, nullable=True)

    user = relationship("User", back_populates="authenticators")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="projects")
    rooms = relationship("Room", back_populates="project", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True)
    projectId = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    lengthCm = Column(Numeric(10, 2), nullable=False)
    widthCm = Column(Numeric(10, 2), nullable=False)
    heightCm = Column(Numeric(10, 2), nullable=False)
    meshUrl = Column(String, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    project = relationship("Project", back_populates="rooms")
    spaces = relationship("RoomSpace", back_populates="room", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="room", cascade="all, delete-orphan")
    placements = relationship("Placement", back_populates="room", cascade="all, delete-orphan")


class RoomSpace(Base):
    __tablename__ = "room_spaces"

    id = Column(String, primary_key=True)
    roomId = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    label = Column(String, nullable=False)
    widthCm = Column(Numeric(10, 2), nullable=False)
    depthCm = Column(Numeric(10, 2), nullable=False)
    positionJson = Column(JSON, nullable=False)

    room = relationship("Room", back_populates="spaces")
    recommendations = relationship("Recommendation", back_populates="recommendedSpace", cascade="all, delete-orphan")


class Object(Base):
    __tablename__ = "objects"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    heightCm = Column(Numeric(10, 2), nullable=False)
    widthCm = Column(Numeric(10, 2), nullable=False)
    depthCm = Column(Numeric(10, 2), nullable=False)
    weightKg = Column(Numeric(6, 2), nullable=True)
    material = Column(String, nullable=True)
    modelUrl = Column(String, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="objects")
    recommendations = relationship("Recommendation", back_populates="object", cascade="all, delete-orphan")
    placements = relationship("Placement", back_populates="object", cascade="all, delete-orphan")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    targetType = Column(Enum(TargetType, name="TargetType", native_enum=True, create_type=False), nullable=False)
    targetId = Column(String, nullable=True)
    rawMediaUrl = Column(String, nullable=False)
    status = Column(Enum(ScanStatus, name="ScanStatus", native_enum=True, create_type=False), default=ScanStatus.QUEUED, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="scans")
    jobs = relationship("AIJob", back_populates="scan", cascade="all, delete-orphan")


class AIJob(Base):
    __tablename__ = "ai_jobs"

    id = Column(String, primary_key=True)
    scanId = Column(String, ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    jobType = Column(Enum(JobType, name="JobType", native_enum=True, create_type=False), nullable=False)
    status = Column(Enum(ScanStatus, name="ScanStatus", native_enum=True, create_type=False), default=ScanStatus.QUEUED, nullable=False)
    progressPct = Column(Integer, default=0, nullable=False)
    errorMessage = Column(String, nullable=True)
    startedAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completedAt = Column(DateTime(timezone=True), nullable=True)

    scan = relationship("Scan", back_populates="jobs")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True)
    objectId = Column(String, ForeignKey("objects.id", ondelete="CASCADE"), nullable=False)
    roomId = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    recommendedSpaceId = Column(String, ForeignKey("room_spaces.id", ondelete="CASCADE"), nullable=False)
    confidenceScore = Column(Numeric(3, 2), nullable=False)
    reasonsJson = Column(JSON, nullable=False)
    alternativesJson = Column(JSON, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    object = relationship("Object", back_populates="recommendations")
    room = relationship("Room", back_populates="recommendations")
    recommendedSpace = relationship("RoomSpace", back_populates="recommendations")
    placements = relationship("Placement", back_populates="recommendation", cascade="all, delete-orphan")


class Placement(Base):
    __tablename__ = "placements"

    id = Column(String, primary_key=True)
    recommendationId = Column(String, ForeignKey("recommendations.id", ondelete="SET NULL"), nullable=True)
    objectId = Column(String, ForeignKey("objects.id", ondelete="CASCADE"), nullable=False)
    roomId = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    positionJson = Column(JSON, nullable=False)
    confirmedAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    recommendation = relationship("Recommendation", back_populates="placements")
    object = relationship("Object", back_populates="placements")
    room = relationship("Room", back_populates="placements")


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    key = Column(String, nullable=False)
    valueJson = Column(JSON, nullable=False)
    learnedFrom = Column(String, nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="preferences")
