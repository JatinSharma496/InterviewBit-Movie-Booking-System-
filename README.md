# Cinema Booking System

A full-stack web application similar to BookMyShow, built with React (Vite) frontend and Spring Boot backend. This project demonstrates modern web development practices with real-time features, comprehensive booking management, and admin functionality.

> **Note**: This is an interview bit assignment project showcasing full-stack development skills with React and Spring Boot.

## 🎬 Features

### Core Functionality
- ✅ **Cinema Listing**: Browse available cinemas with location details
- ✅ **Movie & Showtimes**: View movies and their showtimes for each cinema
- ✅ **Seat Selection**: Interactive seat map with real-time availability
- ✅ **Booking System**: Complete booking flow with confirmation
- ✅ **Booking History**: View and manage past bookings
- ✅ **Booking Cancellation**: Cancel confirmed bookings

### Advanced Features
- ✅ **Real-time Concurrency**: Live seat blocking to prevent double bookings
- ⚠️ **Admin Panel**: Basic admin interface (has known bugs - see Issues section)
- ✅ **Responsive Design**: Modern UI with Tailwind CSS
- ✅ **WebSocket Integration**: Real-time updates for seat availability
- ✅ **Data Persistence**: MySQL database with proper relationships

## ⚠️ Known Issues & Limitations

### Admin Area Bugs
The admin panel has several known issues that could not be resolved within the time constraints:

1. **Real-Time Concurrency Issues**:
   - When a user selects a seat, it should be temporarily blocked and appear as "blocked" in real-time for other users
   - Currently, seat blocking may not work consistently across multiple users

2. **Admin Panel Functionality**:
   - Admin interface for adding/editing/deleting Cinemas, Screens, and Movies has bugs
   - Hover feature to view which user booked a specific seat is not working properly
   - Admin panel UI may not display correctly in some scenarios

3. **Authentication & Security**:
   - Login authentication system is incomplete
   - Admin access control needs proper implementation
   - User session management requires additional work

4. **Booking Cancellation**:
   - End-user cancellation from transaction history has limited functionality
   - Admin panel booking management needs refinement

### Workarounds
- Use the backend API directly for admin operations if needed
- For testing, use the provided sample data
- Most core booking functionality works as expected for regular users

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Icons** for UI icons
- **Date-fns** for date manipulation
- **Context API** for state management

### Backend
- **Spring Boot 3.2.0**
- **Spring Data JPA** with Hibernate
- **MySQL 8.0** database
- **WebSocket** with STOMP for real-time features
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

## 📁 Project Structure

```
cinema-booking-system/
├── frontendd/                 # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # State management
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend/                   # Spring Boot Backend
│   ├── src/main/java/com/cinema/
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data repositories
│   │   ├── dto/              # Data Transfer Objects
│   │   └── config/           # Configuration
│   ├── pom.xml
│   └── README.md
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Java 17+**
- **Maven 3.6+**
- **MySQL 8.0+**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cinema-booking-system
```

### 2. Backend Setup
```bash
cd backend

# Create MySQL database
mysql -u root -p
CREATE DATABASE cinema_booking;

# Update database credentials in src/main/resources/application.yml if needed

# Run the backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontendd

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will start on `http://localhost:5173`

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **WebSocket**: ws://localhost:8080/ws

## 📊 Database Schema

### Key Entities
- **Users**: User accounts with admin privileges
- **Cinemas**: Movie theater locations
- **Screens**: Individual theaters within cinemas
- **Movies**: Film information and metadata
- **Shows**: Specific showtimes for movies
- **Seats**: Individual seats with status tracking
- **Bookings**: User reservations with seat assignments

### Sample Data
The application automatically creates sample data:
- 2 cinemas with multiple screens
- 3 popular movies with various showtimes
- 2 users (admin and regular user)
- Complete seat layouts for all screens

## 🎯 User Flows

### Customer Journey
1. **Browse Cinemas** → Select a cinema location
2. **Choose Movie** → View available movies and showtimes
3. **Select Seats** → Interactive seat map with real-time availability
4. **Confirm Booking** → Complete payment and receive confirmation
5. **Manage Bookings** → View history and cancel if needed

### Admin Features
1. **Manage Cinemas** → Add/edit cinema locations
2. **Manage Movies** → Add/edit movies and showtimes
3. **View Analytics** → Booking statistics and revenue
4. **Seat Management** → Monitor seat availability and bookings

## 🔧 API Documentation

### Core Endpoints
- `GET /api/cinemas` - List all cinemas
- `GET /api/cinemas/{id}/movies` - Get movies by cinema
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/{userId}` - Get user bookings
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### Real-time Features
- WebSocket endpoint: `/ws`
- Seat updates: `/topic/seats`
- Block seats: `/app/seats/block`

## 🎨 UI/UX Features

### Modern Design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Components**: Smooth animations and transitions
- **Intuitive Navigation**: Clear user flow and breadcrumbs
- **Visual Feedback**: Loading states and success messages

### Seat Selection
- **Visual Seat Map**: Grid layout showing seat availability
- **Real-time Updates**: Live seat blocking and availability
- **Color Coding**: Available (gray), Selected (green), Blocked (yellow), Booked (red)
- **Maximum Selection**: Limit of 6 seats per booking

## 🔒 Security & Validation

### Backend Security
- Input validation with Jakarta Validation
- CORS configuration for frontend integration
- Proper error handling and status codes
- SQL injection prevention with JPA

### Data Integrity
- Foreign key constraints
- Transaction management
- Seat concurrency control
- Automatic cleanup of expired blocks

## 🧪 Testing

### Frontend Testing
```bash
cd frontendd
npm test
```

### Backend Testing
```bash
cd backend
mvn test
```

### Manual Testing
- Use the provided sample data for testing
- Test all user flows from cinema selection to booking confirmation
- Verify real-time seat blocking functionality
- Test admin panel features

## 📈 Performance Features

### Real-time Updates
- WebSocket integration for live seat updates
- Automatic cleanup of expired seat blocks
- Efficient database queries with proper indexing

### Frontend Optimization
- Component-based architecture
- Context API for efficient state management
- Lazy loading and code splitting
- Responsive images and assets

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontendd
npm run build
# Deploy dist/ folder to Vercel
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
mvn clean package
# Deploy target/cinema-booking-system-0.0.1-SNAPSHOT.jar
```

### Environment Variables
- Database connection strings
- CORS allowed origins
- WebSocket configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Tailwind CSS for the utility-first CSS framework
- MySQL team for the reliable database system

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the individual README files in frontend and backend directories
- Review the API documentation

---

**Note**: This is a demonstration project showcasing modern full-stack development practices. For production use, consider implementing additional security measures, payment integration, and comprehensive testing.
