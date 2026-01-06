# Attendance Management Feature

This feature provides a complete attendance tracking system following the clean architecture pattern and replicating the structure of `personnel-management`.

## Architecture

The feature is organized into four main layers:

### 1. Domain Layer (`domain/`)
- **entities/Attendance.ts**: Core domain models
  - `Worker`: Worker information
  - `AttendanceRecord`: Individual attendance entry
  - `RegisterEntryData`: Input model for entry registration
  - `RegisterExitData`: Input model for exit registration
  - `AttendanceStats`: Worker statistics

- **repositories/IAttendanceRepository.ts**: Interface defining data access contracts
- **use-cases/AttendanceUseCases.ts**: Business logic orchestration

### 2. Infrastructure Layer (`infrastructure/`)
- **ApiAttendanceRepository.ts**: Implementation of IAttendanceRepository
  - Handles all API calls to `/api/attendance` endpoints
  - Transforms API responses to domain models

### 3. Application Layer (`application/`)
- **services/AttendanceService.ts**: Wraps use cases with error handling
  - Returns `SafeResult<T>` for consistent error handling
  - Bridges domain and presentation layers

- **hooks/useAttendanceManagement.ts**: React hook encapsulating state and operations
  - Manages workers list and attendance records state
  - Provides callbacks for all operations
  - Integrates with MessageProvider for notifications

### 4. Presentation Layer (`presentation/`)
- **components/AttendanceManagementView**: Main view component
  - Tabbed interface: Register | Records
  - Integration of all subcomponents

- **components/AttendanceRegistration**: Registration form
  - Worker selection dropdown
  - Entry/Exit time input with current time default
  - Notes field for exit observations
  - Real-time active entry detection

- **components/AttendanceTable**: Attendance records display
  - Sortable, searchable table
  - Status indicators (Complete/Incomplete)
  - Details dialog
  - Delete functionality with confirmation

- **pages/AttendancePage**: Router-friendly page component

## API Endpoints Used

All endpoints require authentication (JWT token via Auth0):

### Public Endpoints (no auth required)
- `GET /api/attendance/trabajadores-activos` - Get active workers
- `GET /api/attendance/workers` - Alternative worker list endpoint
- `GET /api/attendance/health` - Service health check

### Protected Endpoints
- `POST /api/attendance/entry` - Register entry
- `POST /api/attendance/:id/exit` - Register exit
- `GET /api/attendance/:id` - Get by ID
- `GET /api/attendance/worker/:workerId` - Get worker attendances
- `GET /api/attendance/worker/:workerId/active` - Get active entry
- `GET /api/attendance?page=1&limit=20` - Get paginated list
- `PUT /api/attendance/:id` - Update record
- `DELETE /api/attendance/:id` - Delete record
- `GET /api/attendance/worker/:workerId/statistics` - Get statistics

## Usage Example

```tsx
import AttendancePage from '@features/attendance/pages/AttendancePage';

// In your router configuration:
<Route path="/attendance" element={<AttendancePage />} />
```

## Features

1. **Register Entry**: 
   - Select worker from active list
   - Set entry time (defaults to current time)
   - Submit to mark as entered

2. **Register Exit**:
   - System detects if worker has active entry
   - Set exit time (defaults to current time)
   - Add notes for early exit reasons
   - Submit to calculate worked hours

3. **View Records**:
   - Paginated list of all attendance records
   - Search by worker name or document ID
   - Filter by status (Complete/Incomplete)
   - View detailed information
   - Delete records with confirmation

4. **Visual Feedback**:
   - Real-time status indicators
   - Success/Error toast notifications
   - Loading states during operations
   - Confirmation dialogs for destructive actions

## Styling

The component uses Material-UI with a dark theme matching the rest of the AgroMano system:
- Primary colors: Blues (#1976D2)
- Secondary colors: Oranges, Greens for status
- Dark background: #0a0e27, #1e1e2e
- Text colors: White for primary, Gray for secondary

## State Management

Uses React hooks with local component state:
- `useAttendanceManagement`: Central state hook
- Works with `MessageProvider` for notifications
- Automatic refresh after operations

## Error Handling

All API calls are wrapped with try-catch:
- Errors returned as `SafeResult.error`
- User notifications via toast messages
- Graceful fallbacks for missing data

## Dependencies

- React 18+
- Material-UI (@mui/material)
- Icons (@mui/icons-material)
- No external state management (React hooks only)
