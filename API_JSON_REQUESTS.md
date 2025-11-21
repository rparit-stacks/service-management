# JSON Request Examples for Service Center API

## Base URL
```
http://localhost:8080/api
```

---

## 1. Customer Endpoints

### POST /api/customers - Create Customer
```json
{
  "fullName": "John Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com"
}
```

### PUT /api/customers/{id} - Update Customer
```json
{
  "fullName": "John Doe Updated",
  "phone": "9876543210",
  "email": "john.updated@example.com"
}
```

**Example:**
- Endpoint: `PUT /api/customers/1`
- Body: Same as POST above

---

## 2. Vehicle Endpoints

### POST /api/vehicles - Create Vehicle
```json
{
  "number": "ABC-1234",
  "company": "Toyota",
  "model": "Camry",
  "type": "Sedan",
  "customerId": 1
}
```

### PUT /api/vehicles/{id} - Update Vehicle
```json
{
  "number": "XYZ-5678",
  "company": "Honda",
  "model": "Accord",
  "type": "Sedan",
  "customerId": 1
}
```

**Example:**
- Endpoint: `PUT /api/vehicles/1`
- Body: Same as POST above

**Note:** `customerId` is required and must reference an existing customer.

---

## 3. User Endpoints

### POST /api/users - Create User (Employee/Technician)
```json
{
  "fullName": "Jane Smith",
  "phone": "5551234567",
  "email": "jane.smith@example.com"
}
```

### PUT /api/users/{id} - Update User
```json
{
  "fullName": "Jane Smith Updated",
  "phone": "5559876543",
  "email": "jane.updated@example.com"
}
```

**Example:**
- Endpoint: `PUT /api/users/1`
- Body: Same as POST above

---

## 4. Service Request Endpoints

### POST /api/service-requests - Create Service Request
```json
{
  "description": "Vehicle needs oil change and tire rotation",
  "status": "PENDING",
  "vehicleId": 1
}
```

### PUT /api/service-requests/{id} - Update Service Request
```json
{
  "description": "Vehicle needs oil change, tire rotation, and brake inspection",
  "status": "IN_PROGRESS",
  "vehicleId": 1
}
```

**Example:**
- Endpoint: `PUT /api/service-requests/1`
- Body: Same as POST above

**Status Values:** PENDING, IN_PROGRESS, COMPLETED, CANCELLED

**Note:** `vehicleId` is required and must reference an existing vehicle.

---

## 5. Service (Job) Endpoints

### POST /api/services - Create Service (Job)
```json
{
  "description": "Oil change service",
  "jobName": "Oil Change",
  "cost": 49.99,
  "serviceRequestId": 1,
  "userId": 1
}
```

### PUT /api/services/{id} - Update Service
```json
{
  "description": "Full oil change service with filter replacement",
  "jobName": "Oil Change & Filter",
  "cost": 59.99,
  "serviceRequestId": 1,
  "userId": 1
}
```

**Example:**
- Endpoint: `PUT /api/services/1`
- Body: Same as POST above

**Note:** 
- `serviceRequestId` is required and must reference an existing service request
- `userId` is required and must reference an existing user (technician)
- `cost` must be positive or zero

---

## Complete Workflow Example

### Step 1: Create a Customer
```bash
POST /api/customers
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com"
}
```
**Response:** Returns customer with `id: 1`

### Step 2: Create a Vehicle for the Customer
```bash
POST /api/vehicles
Content-Type: application/json

{
  "number": "ABC-1234",
  "company": "Toyota",
  "model": "Camry",
  "type": "Sedan",
  "customerId": 1
}
```
**Response:** Returns vehicle with `id: 1`

### Step 3: Create a User (Technician)
```bash
POST /api/users
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "phone": "5551234567",
  "email": "jane.smith@example.com"
}
```
**Response:** Returns user with `id: 1`

### Step 4: Create a Service Request
```bash
POST /api/service-requests
Content-Type: application/json

{
  "description": "Vehicle needs oil change and tire rotation",
  "status": "PENDING",
  "vehicleId": 1
}
```
**Response:** Returns service request with `id: 1`

### Step 5: Create a Service (Job) for the Service Request
```bash
POST /api/services
Content-Type: application/json

{
  "description": "Oil change service",
  "jobName": "Oil Change",
  "cost": 49.99,
  "serviceRequestId": 1,
  "userId": 1
}
```
**Response:** Returns service with `id: 1`

---

## cURL Examples

### Create Customer
```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com"
  }'
```

### Create Vehicle
```bash
curl -X POST http://localhost:8080/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "number": "ABC-1234",
    "company": "Toyota",
    "model": "Camry",
    "type": "Sedan",
    "customerId": 1
  }'
```

### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "phone": "5551234567",
    "email": "jane.smith@example.com"
  }'
```

### Create Service Request
```bash
curl -X POST http://localhost:8080/api/service-requests \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Vehicle needs oil change and tire rotation",
    "status": "PENDING",
    "vehicleId": 1
  }'
```

### Create Service
```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Oil change service",
    "jobName": "Oil Change",
    "cost": 49.99,
    "serviceRequestId": 1,
    "userId": 1
  }'
```

---

## GET Endpoints (No Request Body)

### Get All Customers
```bash
GET /api/customers
```

### Get Customer by ID
```bash
GET /api/customers/1
```

### Get All Vehicles
```bash
GET /api/vehicles
```

### Get Vehicle by ID
```bash
GET /api/vehicles/1
```

### Get All Users
```bash
GET /api/users
```

### Get User by ID
```bash
GET /api/users/1
```

### Get All Service Requests
```bash
GET /api/service-requests
```

### Get Service Request by ID
```bash
GET /api/service-requests/1
```

### Get All Services
```bash
GET /api/services
```

### Get Service by ID
```bash
GET /api/services/1
```

---

## DELETE Endpoints (No Request Body)

### Delete Customer
```bash
DELETE /api/customers/1
```

### Delete Vehicle
```bash
DELETE /api/vehicles/1
```

### Delete User
```bash
DELETE /api/users/1
```

### Delete Service Request
```bash
DELETE /api/service-requests/1
```

### Delete Service
```bash
DELETE /api/services/1
```

---

## Field Requirements Summary

### CustomerRequestDTO
- ✅ `fullName` (required, not blank)
- ✅ `phone` (required, not blank)
- ✅ `email` (required, valid email format)

### VehicleRequestDTO
- ✅ `number` (required, not blank)
- ⚪ `company` (optional)
- ⚪ `model` (optional)
- ⚪ `type` (optional)
- ✅ `customerId` (required, must exist)

### UserRequestDTO
- ✅ `fullName` (required, not blank)
- ✅ `phone` (required, not blank)
- ✅ `email` (required, valid email format)

### ServiceRequestDTO
- ⚪ `description` (optional)
- ✅ `status` (required, not blank)
- ✅ `vehicleId` (required, must exist)

### ServiceDTO
- ⚪ `description` (optional)
- ✅ `jobName` (required, not blank)
- ✅ `cost` (required, positive or zero)
- ✅ `serviceRequestId` (required, must exist)
- ✅ `userId` (required, must exist)

---

## Error Response Example

If validation fails or resource not found:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "path": "/api/customers",
  "validationErrors": {
    "email": "Email should be valid",
    "fullName": "Full name is required"
  }
}
```

