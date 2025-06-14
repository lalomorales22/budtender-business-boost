
# Cannabis POS - Budtender Business Boost

A comprehensive Point of Sale (POS) system designed specifically for cannabis dispensaries. This web application helps manage inventory, process sales, track orders, manage customers, and integrate with Weedmaps for streamlined operations.

## Project Info

**GitHub Repository**: https://github.com/lalomorales22/budtender-business-boost.git

## Features

### 🏪 Core POS Functionality
- **Point of Sale**: Process cash and credit card transactions with real-time inventory updates
- **Product Management**: Add, edit, and track cannabis products with detailed information
- **Order Management**: View order history, track sales, and manage transaction details
- **Customer Management**: Maintain customer records and purchase history

### 📊 Business Intelligence
- **Dashboard**: Real-time overview of sales, inventory, and business metrics
- **Reports**: Generate detailed reports with export functionality (CSV/JSON)
- **Analytics**: Track low stock items, daily sales, and customer trends

### 🗺️ Weedmaps Integration
- **Product Catalog**: Create and manage Weedmaps-compatible product listings
- **CSV Export**: Generate properly formatted CSV files for Weedmaps import
- **Inventory Sync**: Maintain consistent product information across platforms

### 👥 Staff Management
- **Employee Records**: Manage staff information and access levels
- **Role-based Access**: Control feature access based on employee roles

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State Management**: TanStack React Query
- **Database**: SQLite (local storage)
- **Icons**: Lucide React
- **Charts**: Recharts

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lalomorales22/budtender-business-boost.git
   cd budtender-business-boost
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   - Navigate to `http://localhost:5173` in your web browser
   - The application will automatically initialize the database on first run

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Usage Guide

### Initial Setup
1. Start the application and navigate to the Products page
2. Add your cannabis inventory with details like strain, category, pricing, and stock quantities
3. Set up customer records if needed
4. Configure employee access levels

### Processing Sales
1. Go to the POS page
2. Add products to cart by clicking on available inventory
3. Adjust quantities as needed
4. Select payment method (Cash or Credit)
5. Complete the sale - inventory will automatically update

### Managing Weedmaps Integration
1. Navigate to the Weedmaps section
2. Create product listings with Weedmaps-specific fields
3. Export CSV files formatted for Weedmaps import
4. Keep product catalogs synchronized between systems

### Generating Reports
1. Visit the Reports section
2. Export data in CSV or JSON format
3. Choose from products, orders, customers, or complete database exports
4. Use exported data for business analysis and compliance reporting

## Database Schema

The application uses a local SQLite database with the following main tables:
- **products**: Cannabis inventory management
- **orders**: Sales transaction records
- **order_items**: Individual items within orders
- **customers**: Customer information and history
- **weedmaps_products**: Weedmaps-specific product data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

---

Built with ❤️ for the cannabis industry
