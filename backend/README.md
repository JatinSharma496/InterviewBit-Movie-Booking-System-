# Cinema Booking System - Backend

A comprehensive Spring Boot backend for a cinema booking system with real-time seat management, booking functionality, and admin features.

## Tech Stack

- **Backend Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA with Hibernate
- **Real-time Communication**: WebSocket with STOMP
- **Build Tool**: Maven

- **Java Version**: 17
- **Validation**: Jakarta Validation
- **Documentation**: Lombok

## Features

### Core Functionality
- ✅ User Management (CRUD operations)
- ✅ Cinema Management with multiple screens
- ✅ Movie Management with showtimes
- ✅ Seat Management with real-time blocking
- ✅ Booking System with confirmation
- ✅ Booking History and Cancellation
- ✅ Admin Panel functionality

### Advanced Features
- ✅ Real-time seat blocking (5-minute timeout)
- ✅ WebSocket integration for live updates
- ✅ Automatic cleanup of expired seat blocks
- ✅ Comprehensive API with proper error handling
- ✅ CORS configuration for frontend integration
- ✅ Data initialization with sample data

## Database Schema

### Entities
- **User**: User information and admin status
- **Cinema**: Cinema locations and details
- **Screen**: Individual screens within cinemas
- **Movie**: Movie information and metadata
- **Show**: Specific showtimes for movies
- **Seat**: Individual seats with status tracking
- **Booking**: User bookings with seat assignments

### Key Relationships
- Cinema → Screens (One-to-Many)
- Cinema → Movies (One-to-Many)
- Screen → Seats (One-to-Many)
- Movie → Shows (One-to-Many)
- Show → Bookings (One-to-Many)
- User → Bookings (One-to-Many)
- Booking → Seats (One-to-Many)

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Java 17 or higher**
   ```bash
   java -version
   ```

2. **Maven 3.6 or higher**
   ```bash
   mvn -version
   ```

3. **MySQL 8.0 or higher**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use Docker: `docker run --name mysql-cinema -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0`

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cinema-booking-system/backend
```

### 2. Database Setup
1. Install MySQL and start the service
2. Create a database named `cinema_booking`:
   ```sql
   CREATE DATABASE cinema_booking;
   ```
3. Update database credentials in `src/main/resources/application.yml` if needed:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/cinema_booking?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
       username: root
       password: password
   ```

### 3. Build and Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Verify Installation
- Check application logs for successful startup
- Visit `http://localhost:8080/api/cinemas` to see sample data
- Database tables will be created automatically

## API Endpoints

### User Management
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `GET /api/users` - Get all users
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Cinema Management
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/{id}` - Get cinema by ID
- `GET /api/cinemas/{id}/movies` - Get movies by cinema

### Booking Management
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/user/{userId}` - Get user bookings
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (admin)

### Seat Management
- `GET /api/seats/screen/{screenId}` - Get seats by screen
- `POST /api/seats/block` - Block seats temporarily
- `POST /api/seats/unblock` - Unblock seats

### WebSocket Endpoints
- `/ws` - WebSocket connection endpoint
- `/app/seats/block` - Block seats via WebSocket
- `/app/seats/unblock` - Unblock seats via WebSocket
- `/topic/seats` - Subscribe to seat updates

## Sample Data

The application automatically creates sample data on first startup:

### Users
- Admin: `admin@cinema.com` (Admin privileges)
- User: `john@example.com` (Regular user)

### Cinemas
- CineMax Downtown (2 screens, 2 movies)
- MegaPlex Mall (2 screens, 1 movie)

### Movies
- The Dark Knight (Action, Crime, Drama)
- Inception (Action, Sci-Fi, Thriller)
- Avatar (Action, Adventure, Fantasy)

### Shows
- Multiple showtimes for each movie across different screens
- All shows scheduled for tomorrow

## Configuration

### Application Properties
Key configuration options in `application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cinema_booking
    username: root
    password: password
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
```

### Seat Blocking Configuration
- Seat blocks expire after 5 minutes
- Automatic cleanup runs every minute
- Maximum 6 seats per booking

## Development

### Project Structure
```
src/main/java/com/cinema/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── repository/     # Data repositories
├── service/        # Business logic
└── CinemaBookingSystemApplication.java
```

### Adding New Features
1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create service in `service/` package
4. Create DTOs in `dto/` package
5. Create controller in `controller/` package
6. Add WebSocket support if needed

### Database Migrations
The application uses Hibernate's `ddl-auto: update` for automatic schema management. For production, consider using Flyway or Liquibase for proper migration management.

## Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Manual Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Get all cinemas
curl http://localhost:8080/api/cinemas

# Create a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phoneNumber":"1234567890"}'
```

## Deployment

### Production Configuration
1. Update `application.yml` with production database credentials
2. Set `spring.jpa.hibernate.ddl-auto` to `validate` or `none`
3. Configure proper logging levels
4. Set up monitoring and health checks

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/cinema-booking-system-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials
   - Ensure database exists

2. **Port Already in Use**
   - Change port in `application.yml`
   - Kill process using port 8080

3. **CORS Issues**
   - Update allowed origins in `CorsConfig.java`
   - Check frontend URL matches configuration

4. **WebSocket Connection Failed**
   - Verify WebSocket endpoint URL
   - Check CORS configuration
   - Ensure STOMP client is properly configured

### Logs
Application logs are available in console output. Enable debug logging by setting:
```yaml
logging:
  level:
    com.cinema: DEBUG
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is a development/demo application. For production use, consider implementing proper security, authentication, payment integration, and additional validation.
